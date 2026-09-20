"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * Terminal boot loader — plays once per session.
 *
 *   pixels  0.0s → 1.5s   "WELCOME" assembles from scattered pixels
 *   text    1.5s → 3.0s   3-line reveal (fade / slide-left / slide-right)
 *   loading 3.0s → ~4.9s  0→100 counter + ASCII progress bar + fake logs
 *   exit    ~4.9s → 5.5s  fade + blur + scale down, then unmount
 *
 * The portfolio is always in the DOM underneath; it is veiled before
 * hydration by `html[data-loader="on"]` (script in app/layout.tsx) and
 * gets its own entrance the moment phase 4 starts.
 *
 * Under `prefers-reduced-motion: reduce` the loader still plays, but the
 * pixel phase is skipped and every transition becomes a plain fade, so the
 * run is ~1.5s shorter and carries no travel or scale.
 * ------------------------------------------------------------------ */

export type Phase = "pixels" | "text" | "loading" | "exit" | "done";

type PixelTarget = {
  /** target position inside the word box */
  x: number;
  y: number;
  /** scattered start position */
  sx: number;
  sy: number;
  /** start rotation (deg) */
  rot: number;
  /** stagger (s) */
  delay: number;
};

type PixelField = {
  points: PixelTarget[];
  width: number;
  height: number;
  size: number;
};

/**
 * Boot decision — read once from sessionStorage + prefers-reduced-motion.
 *
 * `reduce` does not cancel the loader, it picks a motion-free variant:
 * the pixel scatter is dropped and every transition becomes a plain fade.
 */
type Boot = { play: boolean; reduce: boolean };

const SESSION_KEY = "portfolio:loader-shown";
const WORD = "WELCOME";

const PIXEL_MS = 1500;
const TEXT_MS = 1500;
const COUNTER_MS = 1900;
const EXIT_MS = 600;

const MAX_PIXELS = 220;
const BAR_CELLS = 24;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOGS = [
  "> initializing modules...",
  "> compiling assets...",
  "> linking sections...",
  "> ready.",
] as const;
const LOG_AT = [0, 420, 900, 1450] as const;

const EMPTY_FIELD: PixelField = { points: [], width: 0, height: 0, size: 5 };

/* ---------------- boot decision as an external store ---------------- */

const SERVER_BOOT: Boot = { play: false, reduce: false };
let clientBoot: Boot | null = null;

/** Cached so the snapshot reference stays stable across renders. */
function getClientBoot(): Boot {
  if (!clientBoot) {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked (private mode) — treat as a first visit */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    clientBoot = { play: !seen, reduce };
  }
  return clientBoot;
}

function getServerBoot(): Boot {
  return SERVER_BOOT;
}

/** The decision never changes during a page load. */
function subscribeBoot(): () => void {
  return () => {};
}

/* ------------------------- pixel rasteriser ------------------------- */

const FALLBACK_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';

/**
 * Rasterise WORD to an offscreen canvas, then read back the lit pixels as
 * animation targets. Font size and grid density both scale off the viewport.
 *
 * `family` must be a resolved font list — Canvas2D cannot parse `var(...)`,
 * and silently ignores the whole assignment if it tries.
 */
function buildPixelField(vw: number, vh: number, family: string): PixelField {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return EMPTY_FIELD;

  // ~4.2em wide at 0.6em advance per mono glyph — keep it inside the viewport
  const fontSize = Math.max(26, Math.min(vw / 5.2, vh / 5.5, 148));
  const font = `bold ${fontSize}px ${family || FALLBACK_MONO}`;

  ctx.font = font;
  const width = Math.ceil(ctx.measureText(WORD).width) + 8;
  const height = Math.ceil(fontSize * 1.3);

  canvas.width = width;
  canvas.height = height;
  // resizing the canvas resets the 2d state — re-apply
  ctx.font = font;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(WORD, 4, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const stride = Math.max(2, Math.round(fontSize / 13));

  const lit: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      // alpha channel of the sampled pixel
      if (data[(y * width + x) * 4 + 3] > 128) lit.push({ x, y });
    }
  }
  if (lit.length === 0) return EMPTY_FIELD;

  // downsample to a fixed budget so DOM cost stays flat on large screens
  const step = lit.length > MAX_PIXELS ? lit.length / MAX_PIXELS : 1;
  const points: PixelTarget[] = [];
  for (let i = 0; i < lit.length; i += step) {
    const p = lit[Math.floor(i)];
    points.push({
      x: p.x,
      y: p.y,
      sx: width / 2 + (Math.random() - 0.5) * vw * 0.95,
      sy: height / 2 + (Math.random() - 0.5) * vh * 0.9,
      rot: (Math.random() - 0.5) * 200,
      delay: Math.random() * 0.8,
    });
  }

  return {
    points,
    width,
    height,
    size: Math.max(4, Math.min(stride + 1, 8)),
  };
}

/* ----------------------------- component ---------------------------- */

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const boot = useSyncExternalStore(subscribeBoot, getClientBoot, getServerBoot);

  /**
   * Reduced motion starts at the text phase — the pixel scatter is the one
   * thing that cannot be toned down, so it is skipped outright. Safe against
   * hydration: the overlay is not rendered until after the boot snapshot
   * settles, so nothing in the server HTML depends on this.
   */
  const [phase, setPhase] = useState<Phase>(() =>
    typeof window !== "undefined" && getClientBoot().reduce ? "text" : "pixels"
  );
  const [count, setCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [field, setField] = useState<PixelField>(EMPTY_FIELD);

  const timers = useRef<number[]>([]);
  const lastWidth = useRef(0);
  /** used to resolve the mono font family for the canvas */
  const overlayRef = useRef<HTMLDivElement | null>(null);

  /** overlay mounted and running */
  const active = boot.play && phase !== "done";
  const exiting = phase === "exit";
  /** the pixel scatter is the one piece of motion we cannot tone down */
  const showPixels = phase === "pixels" && !boot.reduce;
  /** portfolio hidden behind the loader */
  const veiled = boot.play && (phase === "pixels" || phase === "text" || phase === "loading");
  /** portfolio plays its entrance as the loader fades out */
  const revealed = boot.play && (exiting || phase === "done");

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /* ---------- drop the pre-hydration veil once React owns it ---------- *
   * `boot` is still the server snapshot on the hydration commit, so this
   * has to read the client decision directly — otherwise the veil would
   * come off one paint before the overlay mounts and flash the portfolio. */
  useLayoutEffect(() => {
    if (getClientBoot().play && !veiled) return; // wait until our own veil is painted
    document.documentElement.removeAttribute("data-loader");
  }, [veiled]);

  /* ---------- remember the visit + freeze scroll while playing ---------- */
  useEffect(() => {
    if (!active) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  /* ---------- phase 1: rasterise the word (+ rebuild on resize) ---------- */
  useEffect(() => {
    if (!boot.play || boot.reduce) return; // reduced motion never shows the pixels
    let alive = true;

    const build = () => {
      if (!alive) return;
      const node = overlayRef.current;
      // resolve `var(--font-jetbrains)` down to the actual family list
      const family = node ? window.getComputedStyle(node).fontFamily : "";
      lastWidth.current = window.innerWidth;
      setField(buildPixelField(window.innerWidth, window.innerHeight, family));
    };
    build();

    // the webfont may still be loading — re-measure once it lands
    document.fonts?.ready.then(() => {
      if (alive) build();
    });

    const onResize = () => {
      // ignore mobile URL-bar jitter; only react to real width changes
      if (Math.abs(window.innerWidth - lastWidth.current) < 48) return;
      build();
    };
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
    };
  }, [boot.play, boot.reduce]);

  /* ---------- phase machine ---------- */
  useEffect(() => {
    if (!boot.play) return;

    if (phase === "pixels") {
      after(PIXEL_MS, () => setPhase("text"));
      return clearTimers;
    }

    if (phase === "text") {
      after(TEXT_MS, () => setPhase("loading"));
      return clearTimers;
    }

    if (phase === "loading") {
      LOG_AT.forEach((at, i) => after(at, () => setLogCount(i + 1)));

      const started = performance.now();
      const tick = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - started) / COUNTER_MS);
        // easeOutCubic — quick off the line, crawls into 100
        setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
        if (t >= 1) {
          window.clearInterval(tick);
          setPhase("exit");
        }
      }, 25);

      return () => {
        window.clearInterval(tick);
        clearTimers();
      };
    }

    if (phase === "exit") {
      after(EXIT_MS, () => setPhase("done"));
      return clearTimers;
    }

    return clearTimers;
  }, [boot.play, phase, after, clearTimers]);

  /* ---------- skip: any click, any key ---------- */
  const skip = useCallback(() => {
    clearTimers();
    setCount(100);
    setLogCount(LOGS.length);
    setPhase((prev) => (prev === "exit" || prev === "done" ? prev : "exit"));
  }, [clearTimers]);

  useEffect(() => {
    if (!active) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, skip]);

  /* ---------- safety net ---------- */
  useEffect(
    () => () => {
      clearTimers();
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-loader");
    },
    [clearTimers]
  );

  const bar = "█".repeat(Math.round((count / 100) * BAR_CELLS)).padEnd(BAR_CELLS, "-");

  return (
    <>
      <div
        data-portfolio-root
        className={`flex flex-1 flex-col min-h-full ${
          veiled ? "opacity-0" : revealed ? "portfolio-reveal" : ""
        }`}
      >
        {children}
      </div>

      {active && (
        <motion.div
          ref={overlayRef}
          role="progressbar"
          aria-label="Loading portfolio"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={count}
          onClick={skip}
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          animate={
            exiting
              ? boot.reduce
                ? { opacity: 0, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.98, filter: "blur(4px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          transition={{ duration: EXIT_MS / 1000, ease: EASE }}
          style={{ pointerEvents: exiting ? "none" : "auto" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none bg-[#0a0a0a] text-[#00ff41] font-mono"
        >
          {/* CRT scanline sweep */}
          <div
            aria-hidden
            className="loader-scan pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-[0.07]"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(0,255,65,0.65), transparent)",
            }}
          />

          {/* stage — fixed height so phase 1 → 2 cross-dissolves in place */}
          <div className="relative flex h-[36vh] min-h-[180px] w-full items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {showPixels ? (
                <motion.div
                  key="pixels"
                  aria-hidden
                  className="absolute"
                  style={{ width: field.width, height: field.height }}
                  initial={{ opacity: 1, filter: "blur(1.2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  // the enter delay must not leak into the exit, or `mode="wait"`
                  // holds the stage for a full second and eats the text phase
                  exit={{
                    opacity: 0,
                    filter: "blur(2px)",
                    transition: { duration: 0.3, delay: 0, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
                >
                  {field.points.map((p, i) => (
                    <motion.span
                      key={i}
                      className="absolute left-0 top-0 rounded-[1px] will-change-transform"
                      style={{
                        width: field.size,
                        height: field.size,
                        backgroundColor: "#00ff41",
                        boxShadow: "0 0 6px #00ff41",
                      }}
                      initial={{ x: p.sx, y: p.sy, rotate: p.rot, opacity: 0 }}
                      animate={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: p.delay, ease: EASE }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  className="w-full max-w-[900px] text-left leading-[1.05] tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ fontSize: "clamp(1.9rem, 8vw, 4.5rem)" }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    Welcome
                  </motion.div>
                  <motion.div
                    initial={boot.reduce ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
                    animate={boot.reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
                    transition={
                      boot.reduce
                        ? { duration: 0.4, delay: 0.1, ease: "easeOut" }
                        : { duration: 0.7, delay: 0.1, ease: EASE }
                    }
                  >
                    to my
                  </motion.div>
                  <motion.div
                    initial={boot.reduce ? { opacity: 0 } : { x: "100%", opacity: 0 }}
                    animate={boot.reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
                    transition={
                      boot.reduce
                        ? { duration: 0.4, delay: 0.2, ease: "easeOut" }
                        : { duration: 0.7, delay: 0.3, ease: EASE }
                    }
                  >
                    portfolio
                    <span aria-hidden className="cursor-blink ml-1">
                      _
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* phase 3 — logs, counter, ASCII progress bar */}
          <div className="h-[30vh] min-h-[150px] w-full max-w-[900px] px-6 pt-6">
            <AnimatePresence>
              {(phase === "loading" || exiting) && (
                <motion.div
                  key="counter"
                  initial={boot.reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={boot.reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-[clamp(0.7rem,2.6vw,0.875rem)]"
                >
                  <div className="mb-4 h-[5.5em] space-y-1 text-[#00ff41]/55">
                    {LOGS.slice(0, logCount).map((line) => (
                      <motion.div
                        key={line}
                        initial={boot.reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                        animate={boot.reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>

                  <div className="tabular-nums" style={{ textShadow: "0 0 8px rgba(0,255,65,0.55)" }}>
                    LOADING... {count}%
                  </div>
                  <div
                    aria-hidden
                    className="mt-2 break-all text-[#00ff41]/85"
                    style={{ textShadow: "0 0 8px rgba(0,255,65,0.35)" }}
                  >
                    [{bar}]
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={skip}
            className="absolute bottom-6 text-[11px] uppercase tracking-[0.2em] text-[#00ff41]/45 transition-colors hover:text-[#00ff41]"
          >
            click or press any key to skip
          </button>
        </motion.div>
      )}
    </>
  );
}

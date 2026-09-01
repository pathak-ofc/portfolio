"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Mount flag needed before we can safely portal to document.body
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    // Use pointer:fine, not innerWidth — correctly handles touch laptops,
    // tablets with mice, etc. instead of guessing from screen width.
    const mq = window.matchMedia("(pointer: fine)");
    const updateEnabled = () => setEnabled(mq.matches);
    updateEnabled();
    mq.addEventListener("change", updateEnabled);

    return () => mq.removeEventListener("change", updateEnabled);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !enabled) return;

    const glowEl = glowRef.current;
    if (!glowEl) return;

    mouse.current.x = window.innerWidth / 2;
    mouse.current.y = window.innerHeight / 2;
    pos.current.x = mouse.current.x;
    pos.current.y = mouse.current.y;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        pos.current.x = mouse.current.x;
        pos.current.y = mouse.current.y;
      } else {
        pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
        pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      }
      glowEl.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });

    const interactive = 'a, button, [role="button"], article, .group, input, textarea';

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(interactive)) setIsHovering(true);
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(interactive)) {
        const rel = e.relatedTarget as HTMLElement | null;
        if (!rel || !rel.closest(interactive)) setIsHovering(false);
      }
    };
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
    };
  }, [mounted, enabled]);

  if (!mounted || !enabled) return null;

  // Portal directly to <body> so no ancestor transform/filter/isolate
  // in the component tree can break position:fixed.
  return createPortal(
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{ width: 48, height: 48, transform: "translate3d(0,0,0) translate(-50%,-50%)" }}
    >
      {/* outer — soft amber glow normally, thin elegant ring on hover */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isHovering
            ? "rgba(255,180,84,0.06)"
            : "radial-gradient(circle, rgba(255,180,84,0.85) 0%, rgba(255,180,84,0.22) 38%, transparent 72%)",
          border: isHovering ? "1.5px solid rgba(255,180,84,0.65)" : "1px solid transparent",
          filter: isHovering ? "blur(0px)" : "blur(7px)",
          opacity: isHovering ? 1 : 0.9,
          transform: `scale(${isHovering ? 1.08 : 1})`,
          transition: "transform 260ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease-out, background 220ms ease-out, border-color 220ms ease-out, filter 220ms ease-out",
          boxShadow: isHovering ? "0 0 0 1px rgba(255,180,84,0.12), 0 0 16px rgba(255,180,84,0.22)" : "0 0 14px rgba(255,180,84,0.38)",
        }}
      />
      {/* inner core — 8px dot normally, shrinks to crisp 4px on hover */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: isHovering ? 5 : 8,
          height: isHovering ? 5 : 8,
          background: "#ffb454",
          opacity: 1,
          filter: "blur(0px)",
          boxShadow: isHovering ? "0 0 6px #ffb454" : "0 0 8px #ffb454, 0 0 14px rgba(255,180,84,0.55)",
          transform: `translate(-50%, -50%) scale(${isHovering ? 1 : 1})`,
          transition: "width 220ms cubic-bezier(0.16,1,0.3,1), height 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease-out",
        }}
      />
    </div>,
    document.body
  );
}
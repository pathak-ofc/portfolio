"use client";

import { motion } from "framer-motion";
import { useTyping } from "@/hooks/useTyping";
import { FULL_CODE } from "@/lib/data";
import { useTheme } from "@/app/context/ThemeContext";

export function About({ onNavigate }: { onNavigate: (id: "projects" | "contact") => void; onCopy: (t: string) => void }) {
  const { display: typed, done: typedDone } = useTyping(FULL_CODE, 14);
  const { theme } = useTheme();

  const renderTyped = (code: string) => {
    const lines = code.split("\n");
    return lines.map((line, idx) => {
      const parts: React.ReactNode[] = [];
      const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\bconst\b|\bname\b|\brole\b|\bstack\b|\bstatus\b|\blearnsBy\b)/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(line)) !== null) {
        if (m.index > last) parts.push(<span key={`t-${idx}-${last}`} className="text-[var(--text)]">{line.slice(last, m.index)}</span>);
        const token = m[0];
        if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
          parts.push(<span key={`t-${idx}-${m.index}`} style={{ color: theme === "dark" ? "#a5d6ff" : "#0e639c" }}>{token}</span>);
        } else if (token === "const") {
          parts.push(<span key={`t-${idx}-${m.index}`} style={{ color: theme === "dark" ? "#ff7ab2" : "#d73a49" }}>{token}</span>);
        } else {
          parts.push(<span key={`t-${idx}-${m.index}`} style={{ color: "var(--blue)" }}>{token}</span>);
        }
        last = m.index + token.length;
      }
      if (last < line.length) parts.push(<span key={`t-${idx}-end`}>{line.slice(last)}</span>);
      const content = parts.length ? <>{parts}</> : line;
      return <div key={idx} className="leading-6 min-h-[1.5rem]">{content}</div>;
    });
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="border-b hairline scroll-mt-[72px]">
      <div className="px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-[11px] tracking-widest text-[var(--accent)]">01 —</span>
          <h2 id="about-heading" className="font-mono text-[13px] text-[var(--text-dim)]">about.tsx</h2>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
        </div>

        <div className="grid grid-cols-1 min-[860px]:grid-cols-[1.15fr_0.95fr] gap-8 lg:gap-10 items-start">
          <div className="min-w-0">
            <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] font-semibold tracking-tight leading-[0.95] text-[var(--text)]">
              Bimal Pathak
            </h1>
            <p className="font-mono text-[13px] sm:text-[14px] text-[var(--text-dim)] mt-3">
              <span aria-hidden className="text-[var(--text-faint)]">//</span> full-stack developer, currently an undergrad
            </p>
            <p className="text-[14.5px] leading-6 text-[var(--text-dim)] mt-5 max-w-[56ch]">
              I build full-stack web applications with the MERN stack and Next.js — from REST APIs and database schemas to typed, responsive frontends with TypeScript and Tailwind CSS. Still in undergrad, but I learn by shipping real projects rather than tutorials, and I&apos;m looking for opportunities to contribute to production codebases.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border hairline bg-[var(--panel)] px-3 py-1.5 font-mono text-[12px] text-[var(--text-dim)]">
                <span className="h-2 w-2 rounded-full bg-[var(--mint)] dot-pulse" aria-hidden />
                open to internships &amp; collaborations
              </span>
              <a href="https://github.com/pathak-ofc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--blue)] hover:underline underline-offset-4">
                github.com/pathak-ofc <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="mt-8 flex gap-2 font-mono text-[12px]">
              <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("projects")} className="px-4 py-2 rounded-[8px] bg-[var(--accent)] text-[#0c0c11] font-medium hover:brightness-105 transition cursor-pointer">view projects</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("contact")} className="px-4 py-2 rounded-[8px] border hairline bg-[var(--panel)] text-[var(--text)] hover:bg-[var(--panel-2)] transition cursor-pointer">contact.sh</motion.button>
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-[8px] border hairline bg-[var(--panel)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 flex items-center justify-between px-3 border-b hairline bg-[var(--panel-2)]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/90" aria-hidden />
                  <span className="font-mono text-[12px] text-[var(--text-dim)]">about.tsx</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-faint)] hidden sm:inline">read • write</span>
              </div>
              <div className="p-4 sm:p-5 font-mono text-[12.5px] leading-6 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-[var(--text-dim)]">
                  <code>
                    {renderTyped(typed)}
                    <span className={`inline-block h-[14px] w-2 bg-[var(--accent)] ml-0.5 align-middle ${typedDone ? "cursor-blink" : ""}`} aria-hidden />
                  </code>
                </pre>
              </div>
              <div className="px-3 py-2 border-t hairline bg-[var(--panel-2)] flex items-center justify-between font-mono text-[11px] text-[var(--text-faint)]">
                <span>UTF-8 • TypeScript • 4 spaces</span>
                <span className="text-[var(--mint)]">no errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

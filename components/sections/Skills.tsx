"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/data";
import { useTheme } from "@/app/context/ThemeContext";

export function Skills({ onCopy }: { onCopy: (t: string) => void }) {
  const { theme } = useTheme();

  return (
    <section id="skills" aria-labelledby="skills-heading" className="border-b hairline scroll-mt-[72px]">
      <div className="px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[11px] tracking-widest text-[var(--accent)]">03 —</span>
          <h2 id="skills-heading" className="font-mono text-[13px] text-[var(--text-dim)]">skills.yaml</h2>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
        </div>

        <div className="rounded-[8px] border hairline bg-[var(--panel)] overflow-hidden max-w-[720px] hover:shadow-sm transition-shadow">
          <div className="h-9 flex items-center justify-between px-3 border-b hairline bg-[var(--panel-2)]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffb454]" aria-hidden />
              <span className="font-mono text-[12px] text-[var(--text-dim)]">skills.yaml</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--text-faint)] hidden sm:inline">4 keys • 9 values</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCopy(`frontend: [React, Next.js, TypeScript, Tailwind CSS]\nbackend: [Node.js, Express.js]\ndatabase: [MongoDB]\ntools: [Git, GitHub]`)}
                className="font-mono text-[11px] px-2 py-1 rounded border hairline bg-[var(--panel)] text-[var(--text-dim)] hover:text-[var(--text)] transition cursor-pointer"
              >
                copy
              </motion.button>
            </div>
          </div>
          <div className="p-5 sm:p-6 font-mono text-[13px] leading-7">
            <div className="space-y-1">
              {SKILLS.map((row) => (
                <div key={row.k} className="flex flex-wrap gap-2">
                  <span style={{ color: "var(--blue)" }}>{row.k}:</span>
                  <span className="text-[var(--text-faint)]">[</span>
                  <span className="flex flex-wrap gap-1.5">
                    {row.v.map((val, i) => (
                      <span key={val} className="inline-flex items-center gap-1.5">
                        <span style={{ color: theme === "dark" ? "#a5d6ff" : "#0e639c" }}>&quot;{val}&quot;</span>
                        {i < row.v.length - 1 && <span className="text-[var(--text-faint)]">,</span>}
                      </span>
                    ))}
                  </span>
                  <span className="text-[var(--text-faint)]">]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

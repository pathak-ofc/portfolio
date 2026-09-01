"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="border-b hairline scroll-mt-[72px]">
      <div className="px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[11px] tracking-widest text-[var(--accent)]">02 —</span>
          <h2 id="projects-heading" className="font-mono text-[13px] text-[var(--text-dim)]">projects.json</h2>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
          <span className="font-mono text-[11px] text-[var(--text-faint)] hidden sm:inline">3 pinned</span>
        </div>
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <motion.article
              key={p.file}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group rounded-[8px] border hairline bg-[var(--panel)] overflow-hidden hover:border-[var(--accent)]/20 transition-colors"
            >
              <div className="h-8 flex items-center justify-between px-3 border-b hairline bg-[var(--panel-2)]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.dot }} aria-hidden />
                  <span className="font-mono text-[12px] text-[var(--text-dim)] truncate">{p.file}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border hairline bg-[var(--panel)] text-[var(--text-faint)] hidden sm:inline">READONLY</span>
              </div>
              <div className="p-5">
                <h3 className="text-[17px] font-semibold tracking-tight text-[var(--text)]">{p.title}</h3>
                <p className="text-[13.5px] leading-6 text-[var(--text-dim)] mt-1.5 max-w-[65ch]">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[11px] px-2 py-1 rounded-full border hairline bg-[var(--panel-2)] text-[var(--text-dim)]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <motion.a whileHover={{ x: 2 }} href={p.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[13px] text-[var(--blue)] hover:underline underline-offset-4">
                    view source <span aria-hidden>↗</span>
                  </motion.a>
                  <span className="font-mono text-[11px] text-[var(--text-faint)]">• GitHub</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

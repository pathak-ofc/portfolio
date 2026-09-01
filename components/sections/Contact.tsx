"use client";

import { motion } from "framer-motion";
import { CONTACT } from "@/lib/data";

export function Contact({ onCopy }: { onCopy: (t: string) => void }) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-[72px]">
      <div className="px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[11px] tracking-widest text-[var(--accent)]">04 —</span>
          <h2 id="contact-heading" className="font-mono text-[13px] text-[var(--text-dim)]">contact.sh</h2>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
          <span className="font-mono text-[11px] text-[var(--mint)] hidden sm:inline">● executable</span>
        </div>

        <div className="rounded-[8px] border hairline bg-[var(--panel-2)] overflow-hidden max-w-[720px]">
          <div className="h-9 flex items-center gap-2 px-3 border-b hairline bg-[var(--panel)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6ee7b7]" aria-hidden />
            <span className="font-mono text-[12px] text-[var(--text-dim)]">contact.sh</span>
            <span className="ml-auto font-mono text-[11px] text-[var(--text-faint)]">zsh</span>
          </div>
          <div className="p-5 sm:p-6 font-mono text-[13px] leading-6">
            <div className="space-y-5">
              <div>
                <div className="flex gap-2">
                  <span className="text-[var(--mint)] select-none">$</span>
                  <span className="text-[var(--text)]">open --email</span>
                </div>
                <div className="pl-4 mt-1 flex items-center gap-2 flex-wrap">
                  <a href={`mailto:${CONTACT.email}`} className="text-[var(--blue)] hover:underline underline-offset-4 break-all">
                    {CONTACT.email}
                  </a>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => onCopy(CONTACT.email)} className="text-[11px] px-1.5 py-0.5 rounded border hairline bg-[var(--panel)] text-[var(--text-dim)] hover:text-[var(--text)] transition cursor-pointer">copy</motion.button>
                </div>
              </div>

              <div>
                <div className="flex gap-2">
                  <span className="text-[var(--mint)] select-none">$</span>
                  <span className="text-[var(--text)]">open --github</span>
                </div>
                <div className="pl-4 mt-1">
                  <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="text-[var(--blue)] hover:underline underline-offset-4 break-all">{CONTACT.github}</a>
                </div>
              </div>

              <div>
                <div className="flex gap-2">
                  <span className="text-[var(--mint)] select-none">$</span>
                  <span className="text-[var(--text)]">open --linkedin</span>
                </div>
                <div className="pl-4 mt-1 flex items-center gap-2">
                  <span className="text-[var(--text-faint)] break-all">{CONTACT.linkedin}</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[var(--panel)] border hairline text-[var(--text-faint)]">soon</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-[var(--text-faint)]">
                <span className="text-[var(--mint)] select-none">$</span>
                <span className="flex items-center gap-2">
                  echo &quot;let&apos;s build something&quot; <span className="h-3 w-2 bg-[var(--text)] cursor-blink inline-block" aria-hidden />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

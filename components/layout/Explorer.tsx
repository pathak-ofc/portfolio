"use client";

import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/data";
import type { SectionId } from "@/lib/data";

export function Explorer({
  active,
  onNavigate,
  onCopyEmail,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  onCopyEmail: () => void;
}) {
  return (
    <aside
      className="hidden min-[860px]:flex w-[220px] shrink-0 flex-col border-r hairline bg-[var(--panel)] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto"
      aria-label="Explorer"
    >
      <div className="px-3 pt-4 pb-2">
        <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--text-faint)]">EXPLORER</p>
        <p className="font-mono text-[11px] text-[var(--text-dim)] mt-1">bimal-portfolio</p>
      </div>

      <nav aria-label="File explorer" className="px-2 pb-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-[6px] font-mono text-[13px] text-left transition-colors cursor-pointer
                    ${isActive ? "bg-[var(--panel-2)] text-[var(--accent)]" : "text-[var(--text-dim)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]"}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rotate-45 shrink-0 ${isActive ? "bg-[var(--accent)]" : "bg-[var(--text-faint)]"}`} />
                  <span className="truncate">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        
      </nav>

      <div className="mt-auto border-t hairline p-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--mint)] dot-pulse shrink-0" aria-hidden />
        <span className="font-mono text-[11px] text-[var(--text-dim)]">main • 0 errors</span>
      </div>
    </aside>
  );
}

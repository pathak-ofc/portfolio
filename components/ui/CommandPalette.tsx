"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/data";
import type { SectionId } from "@/lib/data";

type Props = {
  open: boolean;
  query: string;
  setQuery: (q: string) => void;
  active: SectionId;
  onClose: () => void;
  onNavigate: (id: SectionId) => void;
  extraCommands: { id: string; label: string; action: () => void }[];
};

export function CommandPalette({ open, query, setQuery, active, onClose, onNavigate, extraCommands }: Props) {
  const shouldReduceMotion = useReducedMotion();

  const filtered = NAV_ITEMS.filter((n) => (query ? n.label.toLowerCase().includes(query.toLowerCase()) || n.id.includes(query.toLowerCase()) : true));
  const cmds = extraCommands.filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.button aria-label="Close palette" className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12, scale: shouldReduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: shouldReduceMotion ? 1 : 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative w-full max-w-[560px] rounded-[10px] border hairline bg-[var(--panel)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b hairline">
              <span className="text-[var(--text-faint)]" aria-hidden>›</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a file or command… (about, projects, email, theme)"
                className="flex-1 bg-transparent outline-none font-mono text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)]"
              />
              <kbd className="hidden sm:inline font-mono text-[11px] px-1.5 py-1 rounded border hairline bg-[var(--panel-2)] text-[var(--text-faint)]">ESC</kbd>
            </div>
            <div className="p-2 max-h-[320px] overflow-y-auto">
              <p className="px-3 py-2 font-mono text-[11px] tracking-widest text-[var(--text-faint)]">NAVIGATE</p>
              <ul className="space-y-1">
                {filtered.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[6px] font-mono text-[13px] transition-colors cursor-pointer ${active === item.id ? "bg-[var(--accent)] text-[#0c0c11]" : "hover:bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)]"}`}
                    >
                      <span className="text-[10px] px-1 py-0.5 rounded border hairline bg-[var(--panel)] shrink-0">{item.icon}</span>
                      <span>Go to {item.label}</span>
                      <span className="ml-auto text-[11px] opacity-60">↩</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="px-3 pt-4 pb-2 font-mono text-[11px] tracking-widest text-[var(--text-faint)]">COMMANDS</p>
              <ul className="space-y-1 pb-2">
                {cmds.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        c.action();
                        onClose();
                      }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[6px] font-mono text-[13px] hover:bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)] shrink-0" aria-hidden />
                      {c.label}
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && cmds.length === 0 && <li className="px-3 py-6 text-center font-mono text-[13px] text-[var(--text-faint)]">No results for “{query}”</li>}
              </ul>
            </div>
            <div className="px-3 py-2 border-t hairline bg-[var(--panel-2)] flex items-center justify-between font-mono text-[11px] text-[var(--text-faint)]">
              <span>↑↓ navigate • ⏎ select</span>
              <span className="hidden sm:inline">IDE palette • unique feature</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

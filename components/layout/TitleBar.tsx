"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

export function TitleBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-9 flex items-center justify-between px-3 border-b hairline bg-[var(--panel)] shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] border border-black/10" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-black/10" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f] border border-black/10" />
        </div>
        <span className="font-mono text-[12px] tracking-tight text-[var(--text-dim)] truncate hidden sm:inline">bimal-pathak — portfolio</span>
        <span className="font-mono text-[12px] text-[var(--text-dim)] sm:hidden">portfolio</span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPalette}
          className="hidden sm:flex items-center gap-2 font-mono text-[11px] px-2.5 py-1 rounded-md border hairline bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors"
          aria-label="Open command palette (Cmd+K)"
        >
          <span className="opacity-60">⌘</span>K<span className="hidden lg:inline opacity-60">— jump to…</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="font-mono text-[11px] px-2.5 py-1 rounded-md border hairline bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5"
          title={`Theme: ${theme}`}
        >
          <motion.span aria-hidden animate={{ rotate: theme === "dark" ? 0 : 180 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
            {theme === "dark" ? "◐" : "○"}
          </motion.span>
          <span className="hidden sm:inline">{theme === "dark" ? "dark" : "light"}</span>
        </motion.button>
      </div>
    </header>
  );
}

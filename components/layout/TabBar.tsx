"use client";

import { motion } from "framer-motion";
import type { SectionId } from "@/lib/data";
import { NAV_ITEMS } from "@/lib/data";

export function TabBar({ active, onNavigate }: { active: SectionId; onNavigate: (id: SectionId) => void }) {
  return (
    <nav aria-label="Sections" className="flex items-center gap-0 border-b hairline bg-[var(--panel)] overflow-x-auto no-scrollbar sticky top-9 z-20">
      <div className="flex items-center min-w-0">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-2 px-4 h-9 border-r hairline font-mono text-[13px] whitespace-nowrap transition-colors cursor-pointer
                ${isActive ? "bg-[var(--panel-2)] text-[var(--text)]" : "bg-[var(--panel)] text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]/60"}`}
            >
              <span
                aria-hidden
                className="text-[10px] leading-none px-1 py-0.5 rounded-sm font-bold tracking-wider border hairline"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "#0c0c11" : "var(--text-faint)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <motion.span layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
      <div className="ml-auto hidden md:flex items-center gap-2 pr-3 pl-2 shrink-0 font-mono text-[11px] text-[var(--text-faint)]">
        <span className="hidden lg:inline">press</span> <kbd className="px-1.5 py-0.5 rounded border hairline bg-[var(--panel-2)] text-[var(--text-dim)]">⌘K</kbd>
      </div>
    </nav>
  );
}

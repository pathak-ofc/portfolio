"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function Toast({ message }: { message: string | null }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: shouldReduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6, scale: shouldReduceMotion ? 1 : 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="rounded-full bg-[var(--text)] text-[var(--bg)] font-mono text-[12px] px-4 py-2 shadow-lg border hairline"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BackgroundFX() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.22)_100%)] dark:opacity-100 opacity-40" />

      {/* orbs — respect reduced-motion: static when user prefers it */}
      <motion.div
        className="absolute -top-28 -left-28 w-[520px] h-[520px] rounded-full opacity-20 dark:opacity-[0.16] blur-[1px]"
        style={{
          background: "radial-gradient(circle at 30% 30%, #ffb454 0%, rgba(255,180,84,0.22) 28%, transparent 68%)",
          filter: "blur(34px)",
        }}
        animate={reduce ? undefined : { x: [0, 14, -8, 0], y: [0, -10, 8, 0], scale: [1, 1.04, 0.98, 1] }}
        transition={reduce ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-32 w-[640px] h-[640px] rounded-full opacity-20 dark:opacity-[0.13]"
        style={{
          background: "radial-gradient(circle at 70% 50%, #6ee7b7 0%, rgba(110,231,183,0.18) 24%, transparent 66%)",
          filter: "blur(36px)",
        }}
        animate={reduce ? undefined : { x: [0, -12, 10, 0], y: [0, 12, -6, 0], scale: [1, 0.97, 1.03, 1] }}
        transition={reduce ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute top-[42%] left-[52%] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 dark:opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #7dd3fc 0%, rgba(125,211,252,0.16) 30%, transparent 70%)",
          filter: "blur(32px)",
        }}
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.07, 0.11, 0.07] }}
        transition={reduce ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* thin amber beam */}
      <motion.div
        className="absolute left-1/2 top-0 h-px w-[68%] -translate-x-1/2 opacity-40"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,180,84,0.55), transparent)",
          filter: "blur(0.6px)",
        }}
        animate={reduce ? undefined : { opacity: [0.18, 0.42, 0.18] }}
        transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* noise — ultra subtle */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }} />
    </div>
  );
}

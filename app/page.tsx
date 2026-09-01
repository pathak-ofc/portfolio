"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TitleBar } from "@/components/layout/TitleBar";
import { TabBar } from "@/components/layout/TabBar";
import { Explorer } from "@/components/layout/Explorer";
import { Footer } from "@/components/layout/Footer";
import { StatusBar } from "@/components/layout/StatusBar";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Toast } from "@/components/ui/Toast";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "@/app/context/ThemeContext";
import { CONTACT } from "@/lib/data";
import type { SectionId } from "@/lib/data";

export default function Home() {
  const [active, setActive] = useActiveSection();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { toast, show, copy } = useToast();
  const { theme, toggleTheme } = useTheme();

  const scrollTo = useCallback(
    (id: SectionId) => {
      const el = document.getElementById(id);
      if (!el) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      setActive(id);
      setPaletteOpen(false);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [setActive]
  );

  // Keyboard shortcuts for palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
      if (
        e.key === "/" &&
        !paletteOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        const ae = document.activeElement?.tagName;
        if (ae !== "INPUT" && ae !== "TEXTAREA") {
          e.preventDefault();
          setPaletteOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  const extraCommands = [
    { id: "email", label: `Copy email — ${CONTACT.email}`, action: () => copy(CONTACT.email, "Email copied") },
    { id: "github", label: "Open GitHub — github.com/pathak-ofc", action: () => window.open(CONTACT.github, "_blank", "noopener,noreferrer") },
    { id: "theme", label: `Toggle theme — currently ${theme}`, action: toggleTheme },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative isolate">
      <BackgroundFX />
      <CustomCursor />
      <div className="mx-auto w-full max-w-[1168px] min-h-screen flex flex-col border-x hairline bg-[var(--bg)]/92 backdrop-blur-[0.5px] relative">
        <TitleBar onOpenPalette={() => setPaletteOpen(true)} />
        <TabBar active={active} onNavigate={scrollTo} />

        <div className="flex flex-1 min-h-0">
          <Explorer active={active} onNavigate={scrollTo} onCopyEmail={() => copy(CONTACT.email, "Email copied")} />

          <main className="flex-1 min-w-0 bg-[var(--bg)]">
            <About onNavigate={scrollTo} onCopy={(t) => copy(t)} />
            <Projects />
            <Skills onCopy={(t) => copy(t)} />
            <Contact onCopy={(t) => copy(t)} />
            <Footer />
            <StatusBar />
          </main>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        query={query}
        setQuery={setQuery}
        active={active}
        onClose={() => setPaletteOpen(false)}
        onNavigate={scrollTo}
        extraCommands={extraCommands}
      />

      <Toast message={toast} />

      {/* Mobile FAB */}
      <div className="min-[860px]:hidden fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setPaletteOpen(true)}
          className="h-11 w-11 rounded-full bg-[var(--accent)] text-[#0c0c11] flex items-center justify-center shadow-lg border border-black/10 cursor-pointer font-mono text-[14px]"
          aria-label="Open command palette"
        >
          ⌘
        </motion.button>
      </div>
    </div>
  );
}

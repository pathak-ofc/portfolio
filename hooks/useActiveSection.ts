"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/lib/data";
import { NAV_ITEMS } from "@/lib/data";

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return [active, setActive] as const;
}

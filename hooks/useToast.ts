"use client";

import { useCallback, useState } from "react";

export function useToast(duration = 1800) {
  const [toast, setToast] = useState<string | null>(null);

  const show = useCallback(
    (msg: string) => {
      setToast(msg);
      window.setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  const copy = useCallback(
    async (text: string, msg = "Copied to clipboard") => {
      try {
        await navigator.clipboard.writeText(text);
        show(msg);
      } catch {
        show("Copy failed");
      }
    },
    [show]
  );

  return { toast, show, copy, setToast };
}

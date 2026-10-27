"use client";

import { type ReactNode, useEffect, useState } from "react";

/** Acordeão do gabarito. Um link para uma linha dele (`#answer-<id>`, vindo da busca) abre o acordeão e rola até ela. */
export function AnswerAccordion({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const id = location.hash.slice(1);
      if (!id.startsWith("answer-")) return;
      setOpen(true);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <details className="reveal wide" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{open ? "Hide" : "Show"} the answer key (spoilers)</summary>
      <div>{children}</div>
    </details>
  );
}

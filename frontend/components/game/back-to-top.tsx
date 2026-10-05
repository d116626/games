"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Botão flutuante que leva ao topo depois de rolar a página. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 grid size-12 cursor-pointer place-items-center rounded-full border-2 border-black bg-(--game-accent) text-black shadow-[0_3px_0_#000] print:hidden"
    >
      <ArrowUp className="size-5" strokeWidth={3} />
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionLink = { id: string; label: string };

/** Índice das seções com scroll-spy: barra de chips fixa no mobile, lista lateral fixa no desktop. */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Guide sections"
      className="sticky top-0 z-20 -mx-6 flex gap-2 overflow-x-auto border-b border-border bg-background/80 px-6 py-3 backdrop-blur [scrollbar-width:none] lg:top-8 lg:mx-0 lg:flex-col lg:gap-2 lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
    >
      {sections.map(({ id, label }, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? "true" : undefined}
          className={cn(
            "group flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-card-foreground transition-colors lg:min-h-10 lg:rounded-lg lg:px-3",
            "hover:bg-muted aria-[current=true]:bg-(--game-accent) aria-[current=true]:text-black",
          )}
        >
          <span className="hidden font-mono text-[11px] tabular-nums opacity-60 lg:inline">
            {String(i + 1).padStart(2, "0")}
          </span>
          {label}
        </a>
      ))}
    </nav>
  );
}

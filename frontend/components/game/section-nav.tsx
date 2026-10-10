"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionLink = { id: string; label: string; /** Subitens (só no desktop), ex. os blocos do índice. */ children?: SectionLink[] };

/** Índice das seções com scroll-spy: barra de chips fixa no mobile, lista lateral fixa no desktop (com subitens da seção ativa). */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const ids = sections.flatMap((s) => [s.id, ...(s.children?.map((c) => c.id) ?? [])]);
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        const current = ids.findLast((id) => inView.has(id));
        if (current) setActive(current);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Guide sections"
      className="print:hidden sticky top-0 z-20 -mx-6 flex gap-2 overflow-x-auto border-b border-border bg-background/80 px-6 py-3 backdrop-blur [scrollbar-width:none] lg:top-8 lg:mx-0 lg:flex-col lg:gap-2 lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
    >
      {sections.map(({ id, label, children }, i) => {
        const open = active === id || !!children?.some((c) => c.id === active);
        return (
          <div key={id} className="contents lg:flex lg:flex-col lg:gap-1">
            <a
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
            {open && children && (
              <ul className="hidden space-y-0.5 lg:ml-5 lg:block">
                {children.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      aria-current={active === c.id ? "true" : undefined}
                      className="flex min-h-7 items-center rounded-md border border-border bg-card px-2 text-[11px] font-medium text-card-foreground transition-colors hover:bg-muted aria-[current=true]:bg-(--game-accent) aria-[current=true]:text-black"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

import type { ReactNode } from "react";

/** Seção do guia: âncora para o índice, título e contagem de itens. */
export function Section({
  id,
  index,
  title,
  count,
  children,
}: {
  id: string;
  /** Posição da seção (1-based), igual à do índice lateral. */
  index: number;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 lg:scroll-mt-8">
      <header className="mb-6 flex items-center gap-3">
        <span className="rounded-md bg-foreground px-2 py-1 font-mono text-xs tabular-nums text-background">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display text-4xl leading-none md:text-5xl">{title}</h2>
        {count !== undefined && (
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

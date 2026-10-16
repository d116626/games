"use client";

import { useEffect, useRef } from "react";

/** Bloco recolhível do índice. Abre sozinho quando a URL aponta para ele ou para algo dentro dele (`#cats-collars`, `#class-fighter`, `#biome-sewers`), como nos links da busca e de outras seções. */
export function IndexGroup({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const open = () => {
      const target = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
      if (!target || !ref.current?.contains(target)) return;
      // abre o bloco e qualquer <details> aninhado que contenha o alvo
      for (let el: HTMLElement | null = target; el; el = el.parentElement) {
        if (el instanceof HTMLDetailsElement) el.open = true;
      }
      target.scrollIntoView();
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [id]);

  return (
    <details ref={ref} id={id} className="panel group scroll-mt-24">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-2">
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        {count !== undefined && <span className="tag tag-paper">{count}</span>}
        <span className="ml-auto text-sm font-extrabold group-open:hidden">Show</span>
        <span className="ml-auto hidden text-sm font-extrabold group-open:inline">Hide</span>
      </summary>
      <div className="space-y-4 border-t-[2.5px] border-foreground p-4">{children}</div>
    </details>
  );
}

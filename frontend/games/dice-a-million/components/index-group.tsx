"use client";

import { useEffect, useRef } from "react";

/** Bloco recolhível do índice. Abre sozinho quando a URL aponta para ele (`#index-bosses`), como nos links da busca. */
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
      if (location.hash !== `#${id}` || !ref.current) return;
      ref.current.open = true;
      ref.current.scrollIntoView();
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [id]);

  return (
    <details ref={ref} id={id} className="sticker group scroll-mt-24">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-2">
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        {count !== undefined && <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{count}</span>}
        <span className="ml-auto font-mono text-xs group-open:hidden">Show</span>
        <span className="ml-auto hidden font-mono text-xs group-open:inline">Hide</span>
      </summary>
      <div className="space-y-4 border-t-2 border-(--ink) p-4">{children}</div>
    </details>
  );
}

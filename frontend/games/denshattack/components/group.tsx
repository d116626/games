"use client";

import { useEffect, useRef } from "react";

/** Bloco recolhível. Abre sozinho quando a URL aponta para ele ou para algo dentro dele (`#shops-castles`). */
export function Group({
  id,
  title,
  count,
  defaultOpen,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const open = () => {
      const target = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
      if (!target || !ref.current?.contains(target)) return;
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
    <details ref={ref} id={id} open={defaultOpen} className="panel group scroll-mt-24">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-2">
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        {count !== undefined && <span className="tag tag-dim">{count}</span>}
        <span className="ml-auto text-sm font-extrabold group-open:hidden">Show</span>
        <span className="ml-auto hidden text-sm font-extrabold group-open:inline">Hide</span>
      </summary>
      <div className="space-y-4 border-t border-border p-4">{children}</div>
    </details>
  );
}

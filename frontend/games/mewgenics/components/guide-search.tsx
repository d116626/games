"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Tag } from "@/games/mewgenics/components/chip";
import { SEARCH_ENTRIES } from "@/games/mewgenics/lib/search";

const MAX_RESULTS = 30;

/** Busca em tudo: coleiras, vizinhos, áreas, regras de criação e troféus. */
export function GuideSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (query.trim().length < 2) return [];
    return SEARCH_ENTRIES.flatMap((e) => {
      const name = e.name.toLowerCase();
      const haystack = `${name} ${e.kind.toLowerCase()} ${e.text.toLowerCase()}`;
      if (!tokens.every((t) => haystack.includes(t))) return [];
      return [{ e, r: tokens.every((t) => name.includes(t)) ? 0 : 1 }];
    }).sort((a, b) => a.r - b.r);
  }, [query]);

  return (
    <section aria-label="Search the guide" className="mt-6 print:hidden">
      <label className="panel flex min-h-14 items-center gap-3 px-4 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-(--coral)">
        <Search className="size-5 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search collars, neighbours, areas, odds, trophies..."
          className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="grid size-10 cursor-pointer place-items-center">
            <X className="size-5" />
          </button>
        )}
      </label>
      {query.trim().length >= 2 && (
        <div className="mt-4" aria-live="polite">
          <p className="label">
            {results.length} {results.length === 1 ? "result" : "results"}
            {results.length > MAX_RESULTS && ` · showing ${MAX_RESULTS}`}
          </p>
          <ul className="mt-2 divide-y divide-border border-y-2 border-foreground">
            {results.slice(0, MAX_RESULTS).map(({ e }) => (
              <li key={`${e.kind}-${e.name}`}>
                <a href={e.href} className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1 py-2 hover:bg-(--mustard)/30">
                  <Tag tone="paper">{e.kind}</Tag>
                  <span className="font-extrabold">{e.name}</span>
                  <span className="line-clamp-1 min-w-0 flex-1 text-sm text-muted-foreground">{e.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

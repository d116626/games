"use client";

import { Link2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import type { SearchEntry } from "@/games/dice-a-million/types";

const MAX_RESULTS = 40;

const urlListeners = new Set<() => void>();
function subscribeUrl(cb: () => void) {
  urlListeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    urlListeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

function rank(entry: SearchEntry, tokens: string[]) {
  const name = entry.name.toLowerCase();
  const haystack = `${name} ${entry.kind} ${entry.condition ?? ""} ${entry.text}`.toLowerCase();
  if (!tokens.every((t) => haystack.includes(t))) return null;
  return tokens.every((t) => name.startsWith(t)) ? 0 : tokens.every((t) => name.includes(t)) ? 1 : 2;
}

/** Busca em tudo: dados, anéis, cartas, chefes, encantamentos, estratégias e passos do roteiro. */
export function GuideSearch({ entries }: { entries: SearchEntry[] }) {
  const search = useSyncExternalStore(subscribeUrl, () => location.search, () => "");
  const params = new URLSearchParams(search);
  const query = params.get("q") ?? "";
  const kind = params.get("type") ?? "";
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const kinds = useMemo(() => [...new Set(entries.map((e) => e.kind))], [entries]);

  /** A busca vive na URL (?q=&type=), então qualquer link copiado reproduz o resultado. */
  const update = (q: string, k: string) => {
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q);
    if (k) next.set("type", k);
    const qs = next.toString();
    history.replaceState(null, "", `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`);
    urlListeners.forEach((l) => l());
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const ranked = entries.flatMap((e) => {
      const r = kind && e.kind !== kind ? null : rank(e, tokens);
      return r === null ? [] : [{ e, r }];
    });
    return ranked.sort((a, b) => a.r - b.r);
  }, [entries, query, kind]);

  return (
    <section aria-label="Search the guide" className="mt-8 scroll-mt-20 print:hidden">
      <label className="sticker flex min-h-14 items-center gap-3 px-4 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-white">
        <Search className="size-5 shrink-0" />
        <input
          ref={input}
          value={query}
          onChange={(e) => update(e.target.value, kind)}
          type="search"
          placeholder="Search dice, rings, cards, bosses, tips...  ( / )"
          className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => update("", kind)} className="grid size-8 cursor-pointer place-items-center">
            <X className="size-4" />
          </button>
        )}
      </label>

      {tokens.length > 0 && query.trim().length >= 2 && (
        <div className="sticker mt-3 p-4" aria-live="polite">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {results.length === 0
                ? "No results"
                : `${results.length} result${results.length === 1 ? "" : "s"}${results.length > MAX_RESULTS ? `, showing ${MAX_RESULTS}` : ""}`}
            </p>
            <label className="ml-auto flex items-center gap-2 text-xs font-semibold">
              Type
              <select
                value={kind}
                onChange={(e) => update(query, e.target.value)}
                className="min-h-9 rounded-md border-2 border-(--ink) bg-white px-2 text-xs"
              >
                <option value="">All</option>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(location.href).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
              className="hud-tab flex min-h-9 cursor-pointer items-center gap-1.5 rounded px-3 text-xs"
            >
              <Link2 className="size-3.5" /> {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <ul className="grid max-h-[32rem] gap-4 overflow-y-auto md:grid-cols-2">
            {results.slice(0, MAX_RESULTS).map(({ e }) => {
              const row = <ItemRow icon={e.icon} name={e.name} tag={e.kind} faces={e.faces} condition={e.condition} text={e.text} />;
              return (
                <li key={e.id}>
                  {e.href ? (
                    <a href={e.href} className="block rounded-md hover:bg-black/5">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

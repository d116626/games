"use client";

import { Link2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Chip, Tag } from "@/games/mewgenics/components/chip";
import { SEARCH_ENTRIES, type SearchEntry } from "@/games/mewgenics/lib/search";

const KINDS = [...new Set(SEARCH_ENTRIES.map((e) => e.kind))];

const urlListeners = new Set<() => void>();
function subscribeUrl(cb: () => void) {
  urlListeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    urlListeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

/** 0 = nome começa com todos os termos, 1 = nome contém, 2 = só o texto; null = não bate. */
function rank(e: SearchEntry, tokens: string[]) {
  const name = e.name.toLowerCase();
  const haystack = `${name} ${e.kind} ${e.where ?? ""} ${e.text}`.toLowerCase();
  if (!tokens.every((t) => haystack.includes(t))) return null;
  return tokens.every((t) => name.startsWith(t)) ? 0 : tokens.every((t) => name.includes(t)) ? 1 : 2;
}

/** Busca em tudo. Vive na URL (?q=&type=), então um link copiado reproduz o resultado; "/" foca o campo. */
export function GuideSearch() {
  const search = useSyncExternalStore(subscribeUrl, () => location.search, () => "");
  const params = new URLSearchParams(search);
  const query = params.get("q") ?? "";
  const kind = params.get("type") ?? "";
  const input = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const active = query.trim().length >= 2;

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
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // resultados da consulta em todos os tipos; o filtro de tipo só recorta esta lista
  const matches = useMemo(() => {
    if (!active) return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return SEARCH_ENTRIES.flatMap((e) => {
      const r = rank(e, tokens);
      return r === null ? [] : [{ e, r }];
    }).sort((a, b) => a.r - b.r);
  }, [active, query]);

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    matches.forEach(({ e }) => c.set(e.kind, (c.get(e.kind) ?? 0) + 1));
    return c;
  }, [matches]);

  const results = kind ? matches.filter(({ e }) => e.kind === kind) : matches;

  return (
    <section aria-label="Search the guide" className="mt-6 print:hidden">
      <label className="panel flex min-h-14 items-center gap-3 px-4 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-(--coral)">
        <Search className="size-5 shrink-0" />
        <input
          ref={input}
          value={query}
          onChange={(e) => update(e.target.value, kind)}
          type="search"
          placeholder="Search collars, enemies, bosses, debuffs, quests, trophies...  ( / )"
          className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => update("", "")} className="grid size-10 cursor-pointer place-items-center">
            <X className="size-5" />
          </button>
        )}
      </label>

      {active && (
        <div className="panel mt-3 p-4" aria-live="polite">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="label">
              {results.length === 0 ? "No results" : `${results.length} result${results.length === 1 ? "" : "s"}`}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(location.href).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
              className="btn btn-ghost ml-auto cursor-pointer text-sm"
            >
              <Link2 className="size-3.5" /> {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={!kind} onClick={() => update(query, "")}>
              All {matches.length}
            </Chip>
            {KINDS.filter((k) => counts.has(k)).map((k) => (
              <Chip key={k} active={kind === k} onClick={() => update(query, kind === k ? "" : k)}>
                {k} {counts.get(k)}
              </Chip>
            ))}
          </div>

          <ul className="max-h-[28rem] divide-y divide-border overflow-y-auto border-y-2 border-foreground">
            {results.map(({ e }) => (
              <li key={`${e.kind}-${e.where ?? ""}-${e.name}-${e.href}`}>
                <a href={e.href} className="block py-2 hover:bg-(--mustard)/30">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Tag tone="paper">{e.kind}</Tag>
                    <span className="font-extrabold">{e.name}</span>
                    {e.where && <span className="text-sm text-muted-foreground">{e.where}</span>}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{e.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

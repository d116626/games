"use client";

import { Link2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Chip, Tag } from "@/games/denshattack/components/ui";
import { SEARCH_ENTRIES, type SearchEntry } from "@/games/denshattack/lib/search";

const KINDS = [...new Set(SEARCH_ENTRIES.map((e) => e.kind))];
const MAX_RESULTS = 100;

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

/** Campo, filtros e resultados. O estado vive na URL (?q=&type=), então várias instâncias (hero e painel) ficam em sincronia. */
function SearchUI({
  inputRef,
  onPick,
  className,
}: {
  inputRef?: React.Ref<HTMLInputElement>;
  onPick?: () => void;
  className?: string;
}) {
  const search = useSyncExternalStore(subscribeUrl, () => location.search, () => "");
  const params = new URLSearchParams(search);
  const query = params.get("q") ?? "";
  const kind = params.get("type") ?? "";
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
    <section aria-label="Search the guide" className={className}>
      <label className="panel flex min-h-14 items-center gap-3 px-4 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-(--signal)">
        <Search className="size-5 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => update(e.target.value, kind)}
          type="search"
          placeholder="Search levels, spray cans, gears, dares, skin codes, songs, trophies...  ( / )"
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

          <ul className="max-h-[28rem] divide-y divide-border overflow-y-auto border-y border-border">
            {results.slice(0, MAX_RESULTS).map(({ e }) => (
              <li key={`${e.kind}-${e.where ?? ""}-${e.name}-${e.href}`}>
                <a href={e.href} onClick={onPick} className="block py-2 hover:bg-(--signal)/15">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Tag tone="cyan">{e.kind}</Tag>
                    <span className="font-extrabold">{e.name}</span>
                    {e.where && <span className="text-sm text-muted-foreground">{e.where}</span>}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{e.text}</span>
                </a>
              </li>
            ))}
          </ul>
          {results.length > MAX_RESULTS && (
            <p className="mt-2 text-sm text-muted-foreground">Showing the first {MAX_RESULTS}. Add a word or pick a type to narrow it down.</p>
          )}
        </div>
      )}
    </section>
  );
}

/** Busca do guia: inline no topo e, fora dele, um botão flutuante e a tecla "/" abrem a mesma busca num painel. */
export function GuideSearch() {
  const heroInput = useRef<HTMLInputElement>(null);
  const heroBox = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = heroBox.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (e.key !== "/" || typing) return;
      e.preventDefault();
      if (heroVisible) heroInput.current?.focus();
      else setOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [heroVisible]);

  return (
    <>
      <div ref={heroBox}>
        <SearchUI inputRef={heroInput} className="mt-6 print:hidden" />
      </div>

      {!heroVisible && !open && (
        <button
          type="button"
          aria-label="Search the guide"
          onClick={() => setOpen(true)}
          className="btn fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 cursor-pointer print:hidden"
        >
          <Search className="size-4" /> Search
        </button>
      )}

      {open && (
        <dialog
          ref={(d) => {
            if (d && !d.open) d.showModal();
          }}
          onClose={() => setOpen(false)}
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
          aria-label="Search the guide"
          className="m-auto max-h-[90vh] w-[min(48rem,calc(100vw-1.5rem))] overflow-y-auto border border-border bg-background p-3 text-foreground backdrop:bg-black/50 print:hidden"
        >
          <SearchUI onPick={() => setOpen(false)} />
        </dialog>
      )}
    </>
  );
}

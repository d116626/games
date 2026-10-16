"use client";

import { useEffect, useRef, useState } from "react";
import { type Filter, LevelCard, visibleSpots } from "@/games/denshattack/components/level-card";
import { Bar, Chip, Tag } from "@/games/denshattack/components/ui";
import { KIND_LABEL, levels, TRACKED, uniqueItems } from "@/games/denshattack/lib/data";
import { useProgress } from "@/games/denshattack/lib/progress";
import type { Chapter } from "@/games/denshattack/types";

const CHAPTER_IDS = new Map(levels.chapters.map((c) => [c.n, uniqueItems(undefined, c.n).map((i) => i.id)]));

/** `#chapter-3`, `#level-3-2-2` ou `#spot-3-2-2-4` -> capítulo 3. */
function chapterOfHash(): number | undefined {
  const m = /^#(?:chapter-|level-|spot-)(\d)/.exec(location.hash);
  return m ? Number(m[1]) : undefined;
}

/** Capítulo recolhível. O conteúdo só é montado na primeira vez que abre (são ~100 níveis com imagens). Abre sozinho
 *  quando a URL aponta para o capítulo ou para um nível dele. */
function ChapterBlock({ chapter, filter }: { chapter: Chapter; filter: Filter }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [mounted, setMounted] = useState(false);
  const done = useProgress();
  const ids = CHAPTER_IDS.get(chapter.n) ?? [];
  const ticked = ids.filter((id) => done.has(id)).length;
  const chapterLevels = levels.levels.filter((l) => l.chapter === chapter.n);
  const shown = chapterLevels.filter(
    (l) => (filter.kind === "all" && !filter.missing) || visibleSpots(l, filter, done).length > 0,
  );

  useEffect(() => {
    const open = () => {
      if (chapterOfHash() === chapter.n && ref.current) ref.current.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [chapter.n]);

  // depois de montar, leva a um nível apontado pela URL
  useEffect(() => {
    if (!mounted) return;
    const id = location.hash.slice(1);
    if (id.startsWith(`level-${chapter.n}-`) || id.startsWith(`spot-${chapter.n}-`)) document.getElementById(id)?.scrollIntoView();
  }, [mounted, chapter.n]);

  return (
    <details
      ref={ref}
      id={`chapter-${chapter.n}`}
      className="panel group scroll-mt-24"
      onToggle={(e) => e.currentTarget.open && setMounted(true)}
    >
      <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2">
        <span className="font-display text-4xl leading-none text-(--signal)">{chapter.n}</span>
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-none">{chapter.title}</h3>
          <p className="label mt-1">{chapter.region}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden w-28 sm:block">
            <Bar value={ticked} max={ids.length} label={`Chapter ${chapter.n} progress`} />
          </div>
          <span className="text-sm font-bold tabular-nums">
            {ticked} / {ids.length}
          </span>
          <span className="text-sm font-extrabold group-open:hidden">Show</span>
          <span className="hidden text-sm font-extrabold group-open:inline">Hide</span>
        </div>
      </summary>
      {mounted && (
        <div className="space-y-4 border-t border-border p-4">
          {shown.length === 0 && <p className="text-muted-foreground">Nothing matches this filter in this chapter.</p>}
          {shown.map((l) => (
            <LevelCard key={l.code} level={l} filter={filter} done={done} />
          ))}
        </div>
      )}
    </details>
  );
}

/** Os 9 capítulos, com filtro por tipo e "só o que falta". */
export function Levels() {
  const [filter, setFilter] = useState<Filter>({ kind: "all", missing: false });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter the level lists">
        <Chip active={filter.kind === "all"} onClick={() => setFilter((f) => ({ ...f, kind: "all" }))}>
          All
        </Chip>
        {TRACKED.map((k) => (
          <Chip key={k} active={filter.kind === k} onClick={() => setFilter((f) => ({ ...f, kind: k }))}>
            {KIND_LABEL[k]}s
          </Chip>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <Chip active={filter.missing} onClick={() => setFilter((f) => ({ ...f, missing: !f.missing }))}>
          Only what is missing
        </Chip>
        <Tag tone="dim" className="ml-auto">
          {levels.levels.length} levels
        </Tag>
      </div>
      {levels.chapters.map((c) => (
        <ChapterBlock key={c.n} chapter={c} filter={filter} />
      ))}
    </div>
  );
}

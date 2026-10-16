"use client";

import { Bar, Big, Tag } from "@/games/denshattack/components/ui";
import { guide, KIND_LABEL, levels, TRACKED, uniqueItems } from "@/games/denshattack/lib/data";
import { clearProgress, useProgress } from "@/games/denshattack/lib/progress";
import type { ItemKind } from "@/games/denshattack/types";

const ITEMS = Object.fromEntries(TRACKED.map((k) => [k, uniqueItems([k])])) as Record<ItemKind, ReturnType<typeof uniqueItems>>;
const TOTAL = TRACKED.reduce((n, k) => n + ITEMS[k].length, 0);

/** Visão geral: o que existe para coletar, o que cada coisa faz e o seu progresso (salvo neste navegador). */
export function Guide() {
  const done = useProgress();
  const count = (kind: ItemKind) => ITEMS[kind].filter((i) => done.has(i.id)).length;
  const total = TRACKED.reduce((n, k) => n + count(k), 0);

  return (
    <div className="space-y-10">
      <div className="panel p-5">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <Big>
            {total}
            <span className="text-foreground/50"> / {TOTAL}</span>
          </Big>
          <p className="label pb-1">items ticked in the level lists</p>
          <button
            type="button"
            className="btn btn-ghost ml-auto"
            onClick={() => {
              if (total === 0 || window.confirm("Clear all ticked items?")) clearProgress();
            }}
          >
            Reset
          </button>
        </div>
        <div className="mt-3">
          <Bar value={total} max={TOTAL} label="Items ticked" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Ticks are saved only in this browser. Trains, sticker sets, zines and onsens are not listed one by one.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {guide.collectibles.map((c) => {
          const kind = TRACKED.find((k) => k === c.id);
          return (
            <li key={c.id} className="panel p-4">
              <div className="flex items-baseline gap-3">
                <Big>{c.stated}</Big>
                <h3 className="font-display text-2xl">{c.name}</h3>
                <Tag tone="dim" className="ml-auto">
                  {c.trophy}
                </Tag>
              </div>
              <p className="mt-2">{c.how}</p>
              {c.spend && <p className="mt-1 text-muted-foreground">Spend on: {c.spend}</p>}
              {kind && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{KIND_LABEL[kind]}s ticked</span>
                    <span className="tabular-nums">
                      {count(kind)} / {ITEMS[kind].length}
                    </span>
                  </div>
                  <Bar value={count(kind)} max={ITEMS[kind].length} label={`${c.name}s ticked`} />
                  {ITEMS[kind].length !== c.stated && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      The guide lists {ITEMS[kind].length} of {c.stated}.
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="space-y-2">
        {guide.facts.map((f) => (
          <li key={f} className="flex gap-3">
            <span aria-hidden className="mt-2 size-2 shrink-0 bg-(--signal)" />
            {f}
          </li>
        ))}
      </ul>

      <div>
        <h3 className="font-display text-2xl">Where the sources disagree</h3>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {levels.discrepancies.map((d) => (
            <li key={d.topic} className="py-3">
              <Tag tone="pink" className="mr-2">
                {d.topic}
              </Tag>
              {d.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

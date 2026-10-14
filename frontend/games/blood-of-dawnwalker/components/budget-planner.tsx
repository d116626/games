"use client";

import { Check } from "lucide-react";
import type { BudgetItem } from "@/games/blood-of-dawnwalker/types";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const DAY = 16;

/** Contador de segmentos: marque o que vai fazer e veja quanto do relógio (480) sobra. */
export function BudgetPlanner({ total, items }: { total: number; items: BudgetItem[] }) {
  const { set, toggle, reset } = useLocalSet("blood-of-dawnwalker:budget");
  const on = (i: BudgetItem) => !i.optional || set.has(i.id);
  const picked = items.filter(on);
  const used = picked.reduce((n, i) => n + (i.segments ?? 0), 0);
  const unknown = picked.filter((i) => i.segments === undefined).length;
  const left = total - used;
  const groups = [...new Set(items.map((i) => i.group))];

  return (
    <div>
      <div className="sticky top-[4.5rem] z-10 -mx-3 rounded-2xl border border-border bg-background/90 px-4 py-3 backdrop-blur lg:top-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-display text-5xl leading-none">
            {used}
            <span className="text-2xl text-muted-foreground"> / {total}</span>
            <span className="ml-3 font-sans text-sm normal-case text-muted-foreground">
              segments · day {Math.min(30, Math.floor(used / DAY) + 1)} of 30
            </span>
          </p>
          <p className={cn("text-sm font-bold", left < 0 ? "text-destructive" : "text-(--dawn)")}>
            {left >= 0 ? `${left} left` : `${-left} over budget`}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", left < 0 ? "bg-destructive" : "bg-(--game-accent)")}
            style={{ width: `${Math.min(100, Math.max(0, (used / total) * 100))}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        A day is {DAY} segments (8 day, 8 night). Tick what you plan to do.
        {unknown > 0 && ` ${unknown} ticked ${unknown === 1 ? "item has" : "items have"} no documented cost and ${unknown === 1 ? "is" : "are"} not counted.`}{" "}
        Saved only in this browser.{" "}
        <button type="button" onClick={() => set.size > 0 && reset()} className="cursor-pointer underline underline-offset-4 hover:text-foreground">
          Reset
        </button>
      </p>

      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <div key={g}>
            <h3 className="label mb-1">{g}</h3>
            <ul className="divide-y divide-border">
              {items
                .filter((i) => i.group === g)
                .map((i) => (
                  <li key={i.id}>
                    <label className={cn("flex min-h-12 items-start gap-3 py-3", i.optional && "cursor-pointer")}>
                      <input type="checkbox" checked={on(i)} disabled={!i.optional} onChange={() => toggle(i.id)} className="peer sr-only" />
                      <span
                        aria-hidden
                        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground/40 text-transparent peer-checked:border-(--game-accent) peer-checked:bg-(--game-accent) peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                      >
                        <Check className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-bold">{i.name}</span>
                        {i.note && <span className="block text-muted-foreground">{i.note}</span>}
                      </span>
                      <span
                        className={cn(
                          "w-12 shrink-0 text-right font-display text-2xl leading-none tabular-nums",
                          i.segments === undefined ? "text-muted-foreground" : i.segments < 0 ? "text-(--dawn)" : "text-foreground",
                        )}
                      >
                        {i.segments === undefined ? "?" : i.segments > 0 ? `+${i.segments}` : i.segments}
                      </span>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

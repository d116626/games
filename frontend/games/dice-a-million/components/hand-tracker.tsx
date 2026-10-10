"use client";

import { Check } from "lucide-react";
import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";
import { ItemRef } from "@/games/dice-a-million/components/item-ref";
import { rarityTier, type ItemInfo } from "@/games/dice-a-million/types";
import { useLocalSet } from "@/lib/local-store";

export type TrackerCell = { id: string; label: string; rarity: number; info: ItemInfo };
export type TrackerRow = { hand: string; cells: (TrackerCell | null)[] };

/** Matriz mão x objetivo com marcação salva no navegador e sugestão do próximo objetivo. */
export function HandTracker({ columns, rows }: { columns: string[]; rows: TrackerRow[] }) {
  const { set, toggle, reset } = useLocalSet("dice-a-million:hand-goals");
  const cells = rows.flatMap((r) => r.cells.flatMap((c) => (c ? [{ ...c, hand: r.hand }] : [])));
  const done = cells.filter((c) => set.has(c.id)).length;
  const order = cells.filter((c) => !set.has(c.id)).sort((a, b) => b.rarity - a.rarity);

  return (
    <div className="space-y-3">
      <div className="sticker p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-2xl leading-none">
            {done} / {cells.length} <span className="font-sans text-sm font-semibold">hand goals</span>
          </p>
          <button
            type="button"
            onClick={() => done > 0 && window.confirm("Clear all marked goals?") && reset()}
            className="hud-tab min-h-9 cursor-pointer rounded px-3 text-xs"
          >
            Reset
          </button>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-(--ink) bg-white">
          <div className="h-full bg-(--game-accent)" style={{ width: `${(done / cells.length) * 100}%` }} />
        </div>
        {order.length > 0 ? (
          <div className="mt-3">
            <p className="text-sm font-bold">Suggested order, easiest first</p>
            <ol className="mt-1 space-y-1 text-sm">
              {order.slice(0, 5).map((c, i) => (
                <li key={c.id} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{i + 1}</span>
                  <span>
                    {c.hand.replace(" Hand", "")}: {c.label} - <b>{c.info.name}</b>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.rarity}% of players, {rarityTier(c.rarity).label.toLowerCase()}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="mt-2 text-sm font-bold">Every hand goal is done.</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Ordered by how many players already have the achievement. Saved only in this browser. Click a reward name for details.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const goals = row.cells.flatMap((c, i) => (c ? [{ cell: c, label: columns[i] }] : []));
          const got = goals.filter((g) => set.has(g.cell.id)).length;
          return (
            <li key={row.hand} className="sticker-sm p-3">
              <h4 className="mb-2 flex items-center justify-between font-display text-xl leading-none">
                {row.hand.replace(" Hand", "")}
                <span className="hud-tab rounded px-1.5 py-0.5 font-mono text-[10px]">
                  {got}/{goals.length}
                </span>
              </h4>
              <ul className="space-y-1.5">
                {goals.map(({ cell, label }) => (
                  <li key={cell.id}>
                    <Goal cell={cell} label={label} done={set.has(cell.id)} onToggle={() => toggle(cell.id)} />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Goal({ cell, label, done, onToggle }: { cell: TrackerCell; label: string; done: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark ${cell.info.name} as done`}
        onClick={onToggle}
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md border-2 border-(--ink) bg-white aria-checked:bg-(--game-accent)"
      >
        {done && <Check className="size-4 text-black" strokeWidth={3} />}
      </button>
      <ItemRef item={cell.info} className={`flex min-w-0 items-center gap-2 text-left ${done ? "opacity-50" : ""}`}>
        {cell.info.icon && <AchievementIcon src={cell.info.icon} name="" className="size-8 shrink-0 rounded-md" />}
        <span className="min-w-0 leading-tight">
          <span className="block text-[11px] text-muted-foreground">{label}</span>
          <span className="block truncate text-xs font-semibold">{cell.info.name}</span>
        </span>
      </ItemRef>
    </div>
  );
}

"use client";

import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { Chip } from "@/games/mewgenics/components/chip";
import type { Grade, Trophy, TrophyDataset } from "@/games/mewgenics/types";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const GRADES: Grade[] = ["platinum", "gold", "silver", "bronze"];
const GRADE_DOT: Record<Grade, string> = {
  platinum: "bg-cyan-400",
  gold: "bg-amber-400",
  silver: "bg-slate-400",
  bronze: "bg-orange-600",
};
const POINTS: Record<Grade, number> = { platinum: 300, gold: 90, silver: 30, bronze: 15 };

/** Checklist de troféus PS5, por grupo ou do mais raro ao mais comum. Salvo só no navegador. */
export function Trophies({ data }: { data: TrophyDataset }) {
  const { set, toggle, reset } = useLocalSet("mewgenics:trophies");
  const [byGroup, setByGroup] = useState(true);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [hideDone, setHideDone] = useState(false);

  const all = data.trophies;
  const key = (t: Trophy) => String(t.id);
  const done = all.filter((t) => set.has(key(t)));
  const earned = done.reduce((n, t) => n + POINTS[t.grade], 0);
  const filtered = all.filter((t) => (!grade || t.grade === grade) && !(hideDone && set.has(key(t))));

  const groups = byGroup
    ? data.groups.map((g) => ({ ...g, list: filtered.filter((t) => t.group === g.id) })).filter((g) => g.list.length > 0)
    : [{ id: "all", title: "", summary: "", list: [...filtered].sort((a, b) => a.psnRate - b.psnRate) }];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <p className="font-display text-6xl leading-none">
            {done.length}
            <span className="text-3xl text-muted-foreground"> / {all.length}</span>
            <span className="ml-3 font-sans text-base font-bold text-muted-foreground">
              {earned} / {data.points} pts
            </span>
          </p>
          <button
            type="button"
            onClick={() => done.length > 0 && window.confirm("Clear all marked trophies?") && reset()}
            className="min-h-10 cursor-pointer text-sm font-bold underline underline-offset-4"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-foreground bg-card">
          <div className="h-full bg-(--coral)" style={{ width: `${(done.length / all.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Saved only in this browser. Rarity is the PSN rate.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={byGroup} onClick={() => setByGroup(true)}>
          By group
        </Chip>
        <Chip active={!byGroup} onClick={() => setByGroup(false)}>
          Rarest first
        </Chip>
        <Chip active={hideDone} onClick={() => setHideDone(!hideDone)}>
          Hide done
        </Chip>
        {GRADES.map((g) => (
          <Chip key={g} active={grade === g} onClick={() => setGrade(grade === g ? null : g)}>
            {g}
          </Chip>
        ))}
      </div>

      <div className="space-y-10">
        {groups.map((g) => (
          <div key={g.id}>
            {g.title && (
              <header className="mb-2">
                <h3 className="font-display text-3xl leading-tight">{g.title}</h3>
                <p className="max-w-3xl text-muted-foreground">{g.summary}</p>
              </header>
            )}
            <ul className="divide-y divide-border border-y-2 border-foreground">
              {g.list.map((t) => (
                <Row key={t.id} t={t} done={set.has(key(t))} onToggle={() => toggle(key(t))} />
              ))}
            </ul>
          </div>
        ))}
        {groups.length === 0 && <p className="text-muted-foreground">Nothing matches these filters.</p>}
      </div>
    </div>
  );
}

function Row({ t, done, onToggle }: { t: Trophy; done: boolean; onToggle: () => void }) {
  return (
    <li id={`trophy-${t.id}`} className={cn("flex scroll-mt-24 gap-3 py-3 sm:gap-4", done && "opacity-50")}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark ${t.name} as done`}
        onClick={onToggle}
        className={cn(
          "mt-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-[3px] border-foreground transition-colors",
          done ? "bg-(--coral) text-white" : "bg-card hover:bg-(--mustard)",
        )}
      >
        {done && <Check className="size-4" strokeWidth={3} />}
      </button>
      <GameImage src={t.icon} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg border-2 border-foreground" />
      <div className="min-w-0 flex-1">
        <h4 className={cn("text-base font-extrabold leading-snug", done && "line-through")}>{t.name}</h4>
        <p>{t.description}</p>
        {t.tip && <p className="mt-1 border-l-4 border-(--mustard) pl-3 text-[0.95rem]">{t.tip}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className="flex items-center justify-end gap-1.5 text-sm font-extrabold tabular-nums">
          <span className={cn("size-3 rounded-full border border-foreground", GRADE_DOT[t.grade])} aria-hidden />
          {t.psnRate}%
        </p>
        <p className="text-xs text-muted-foreground">{t.grade}</p>
        <a href={t.url} target="_blank" rel="noreferrer" aria-label={`${t.name} on PSNProfiles`} className="mt-1 inline-block">
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </li>
  );
}

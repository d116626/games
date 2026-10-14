"use client";

import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Chip, Tag } from "@/games/blood-of-dawnwalker/components/chip";
import type { Grade, Trophy, TrophyDataset } from "@/games/blood-of-dawnwalker/types";
import { GameImage } from "@/components/game/game-image";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const GRADES: Grade[] = ["platinum", "gold", "silver", "bronze"];
const GRADE_DOT: Record<Grade, string> = {
  platinum: "bg-cyan-300",
  gold: "bg-amber-400",
  silver: "bg-slate-300",
  bronze: "bg-orange-500",
};
const POINTS: Record<Grade, number> = { platinum: 300, gold: 90, silver: 30, bronze: 15 };
const TIERS = ["Ultra Rare", "Very Rare", "Rare", "Common"];

type Group = { id: number; title: string; summary?: string; points: string[]; list: Trophy[] };

/** Checklist de troféus PS5: roadmap em etapas (linha do tempo) ou lista plana por raridade. */
export function Trophies({ data }: { data: TrophyDataset }) {
  const { set, toggle, reset } = useLocalSet("blood-of-dawnwalker:trophies");
  const [byStep, setByStep] = useState(true);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [hideDone, setHideDone] = useState(false);

  const all = data.trophies;
  const key = (t: Trophy) => String(t.id);
  const done = all.filter((t) => set.has(key(t)));
  const earned = done.reduce((n, t) => n + POINTS[t.grade], 0);
  const tags = [...new Set(all.flatMap((t) => t.tags))].sort();
  const filtered = all.filter(
    (t) =>
      (!grade || t.grade === grade) &&
      (!tier || t.psnTier === tier) &&
      (!tag || t.tags.includes(tag)) &&
      !(hideDone && set.has(key(t))),
  );

  const groups: Group[] = byStep
    ? [
        ...data.stages.map((s) => ({ ...s, list: filtered.filter((t) => t.stage === s.id) })),
        { id: 0, title: "Anytime", points: [], list: filtered.filter((t) => t.stage === undefined) },
      ].filter((g) => g.list.length > 0)
    : [{ id: -1, title: "", points: [], list: [...filtered].sort((a, b) => a.psnRate - b.psnRate) }];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <p className="font-display text-6xl leading-none">
            {done.length}
            <span className="text-3xl text-muted-foreground"> / {all.length}</span>
            <span className="ml-3 font-sans text-base normal-case text-muted-foreground">
              {earned} / {data.points} pts · difficulty {data.difficulty} · about {data.hours} h
            </span>
          </p>
          <button
            type="button"
            onClick={() => done.length > 0 && window.confirm("Clear all marked trophies?") && reset()}
            className="min-h-10 cursor-pointer text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-(--game-accent)" style={{ width: `${(done.length / all.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Saved only in this browser. Rarity is the PSN rate.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={byStep} onClick={() => setByStep(true)}>
            By step
          </Chip>
          <Chip active={!byStep} onClick={() => setByStep(false)}>
            Rarest first
          </Chip>
          <Chip active={tag === "Missable"} onClick={() => setTag(tag === "Missable" ? null : "Missable")}>
            Missable
          </Chip>
          <Chip active={hideDone} onClick={() => setHideDone(!hideDone)}>
            Hide done
          </Chip>
        </div>
        <details className="group text-sm">
          <summary className="min-h-10 cursor-pointer py-2 text-muted-foreground hover:text-foreground">More filters</summary>
          <div className="space-y-3 pb-1 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label w-16">Grade</span>
              {GRADES.map((g) => (
                <Chip key={g} active={grade === g} onClick={() => setGrade(grade === g ? null : g)}>
                  {g}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label w-16">Rarity</span>
              {TIERS.map((t) => (
                <Chip key={t} active={tier === t} onClick={() => setTier(tier === t ? null : t)}>
                  {t}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label w-16">Tag</span>
              {tags
                .filter((t) => t !== "Missable")
                .map((t) => (
                  <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                    {t}
                  </Chip>
                ))}
            </div>
          </div>
        </details>
      </div>

      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.id} className={cn(byStep && g.id > 0 && "relative border-l-2 border-(--game-accent)/40 pl-6 md:ml-4 md:pl-8")}>
            {byStep && g.id > 0 && (
              <span className="absolute -left-4 top-0 grid size-8 place-items-center rounded-full bg-(--game-accent) font-display text-lg text-white">
                {g.id}
              </span>
            )}
            {g.title && (
              <header className="mb-3 space-y-2">
                <h3 className="font-display text-3xl leading-tight">{g.title}</h3>
                {g.summary && <p className="max-w-3xl text-muted-foreground">{g.summary}</p>}
                {g.points.length > 0 && (
                  <ul className="max-w-3xl list-disc space-y-1 pl-5 marker:text-(--game-accent)">
                    {g.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </header>
            )}
            <ul className="divide-y divide-border">
              {g.list.map((t) => (
                <Row key={t.id} t={t} done={set.has(key(t))} onToggle={() => toggle(key(t))} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Row({ t, done, onToggle }: { t: Trophy; done: boolean; onToggle: () => void }) {
  const missable = t.tags.includes("Missable");
  return (
    <li id={`trophy-${t.id}`} className={cn("flex scroll-mt-24 gap-3 py-3 sm:gap-4", done && "opacity-50")}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark ${t.name} as done`}
        onClick={onToggle}
        className={cn(
          "mt-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-colors",
          done ? "border-(--game-accent) bg-(--game-accent) text-white" : "border-foreground/40 hover:border-(--dawn)",
        )}
      >
        {done && <Check className="size-4" />}
      </button>
      <GameImage src={t.icon} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <h4 className="flex flex-wrap items-baseline gap-x-2 text-base font-bold leading-snug">
          <span className={cn(done && "line-through")}>{t.name}</span>
          {missable && <span className="label text-destructive">Missable</span>}
          {t.tags
            .filter((x) => x !== "Missable")
            .map((x) => (
              <Tag key={x}>{x}</Tag>
            ))}
        </h4>
        <p className="text-muted-foreground">{t.description}</p>
        {t.tip && <p className="mt-1 border-l-2 border-(--dawn)/60 pl-3 text-[0.95rem]">{t.tip}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className="flex items-center justify-end gap-1.5 text-sm font-bold tabular-nums">
          <span className={cn("size-2.5 rounded-full", GRADE_DOT[t.grade])} aria-hidden />
          {t.psnRate}%
        </p>
        <p className="text-xs text-muted-foreground">{t.grade}</p>
        <a
          href={t.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.name} on PSNProfiles`}
          className="mt-1 inline-block text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </li>
  );
}

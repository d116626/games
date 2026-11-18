"use client";

import { Check, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { Bar, Chip, Tag } from "@/games/grand-theft-auto-vi/components/ui";
import { trophies } from "@/games/grand-theft-auto-vi/lib/data";
import type { Grade, Trophy } from "@/games/grand-theft-auto-vi/types";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const GRADES: Grade[] = ["platinum", "gold", "silver", "bronze"];
const POINTS: Record<Grade, number> = { platinum: 300, gold: 90, silver: 30, bronze: 15 };
const TONE = { platinum: "cyan", gold: "orange", silver: "silver", bronze: "bronze" } as const;
const RARE = new Set(["Ultra Rare", "Very Rare", "Rare"]);

function Row({ t, done, flash, onToggle }: { t: Trophy; done: boolean; flash: boolean; onToggle: () => void }) {
  return (
    <li id={`trophy-${t.id}`} className={cn("flex scroll-mt-24 gap-3 py-3 transition-colors duration-500 sm:gap-4", done && "opacity-55", flash && "bg-(--pink)/20")}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark ${t.name} as done`}
        onClick={onToggle}
        className={cn(
          "mt-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-colors",
          done ? "border-(--pink) bg-(--pink) text-black" : "border-foreground/40 hover:border-(--pink)",
        )}
      >
        {done && <Check className="size-4" />}
      </button>
      <GameImage src={t.icon} alt="" width={56} height={56} className="size-14 shrink-0 rounded-lg bg-card" />
      <div className="min-w-0 flex-1">
        <h4 className={cn("font-display text-xl leading-tight", done && "line-through")}>{t.name}</h4>
        <p className="mt-1">{t.description}</p>
        {t.note && <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Tag tone={TONE[t.grade]}>{t.grade}</Tag>
          {t.psnRate !== undefined && t.psnTier && (
            <Tag tone={RARE.has(t.psnTier) ? "pink" : "dim"}>
              {t.psnRate}% {t.psnTier}
            </Tag>
          )}
        </div>
      </div>
      <a
        href={t.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${t.name} on PSNProfiles`}
        className="mt-1 shrink-0 self-start text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="size-4" />
      </a>
    </li>
  );
}

/** Checklist de troféus da PS5: marcar o que já tem, filtrar por nível e esconder o que está feito. */
export function Trophies() {
  const { set, toggle, reset } = useLocalSet("grand-theft-auto-vi:trophies");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [hideDone, setHideDone] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);

  const all = trophies.trophies;
  const key = (t: Trophy) => String(t.id);
  const done = all.filter((t) => set.has(key(t)));
  const earned = done.reduce((n, t) => n + POINTS[t.grade], 0);
  const list = all.filter((t) => (!grade || t.grade === grade) && !(hideDone && set.has(key(t))));

  // Vindo da busca (#trophy-<id>): tira os filtros, para a linha não estar escondida, e a destaca por um instante.
  useEffect(() => {
    const onHash = () => {
      const id = Number(/^#trophy-(\d+)$/.exec(location.hash)?.[1]);
      if (!id) return;
      setGrade(null);
      setHideDone(false);
      setFlash(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (flash === null) return;
    document.getElementById(`trophy-${flash}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <p className="font-display text-6xl leading-none">
            {done.length}
            <span className="text-3xl text-muted-foreground"> / {all.length}</span>
            <span className="ml-3 font-sans text-base normal-case text-muted-foreground">
              {earned} / {trophies.points} pts
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
        <div className="mt-3">
          <Bar value={done.length} max={all.length} label="Trophies done" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {trophies.counts.platinum} platinum · {trophies.counts.gold} gold · {trophies.counts.silver} silver · {trophies.counts.bronze} bronze.
          Your ticks are saved only in this browser.
          {trophies.hasRarity ? " Rarity is the PSN rate." : " Rarity will show once the PSN has real numbers."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip active={grade === null} onClick={() => setGrade(null)}>
          All
        </Chip>
        {GRADES.map((g) => (
          <Chip key={g} active={grade === g} onClick={() => setGrade(grade === g ? null : g)}>
            {g} {trophies.counts[g]}
          </Chip>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <Chip active={hideDone} onClick={() => setHideDone((v) => !v)}>
          Hide done
        </Chip>
      </div>

      <ul className="divide-y divide-border border-y border-border">
        {list.map((t) => (
          <Row key={t.id} t={t} done={set.has(key(t))} flash={flash === t.id} onToggle={() => toggle(key(t))} />
        ))}
      </ul>
      {list.length === 0 && <p className="text-muted-foreground">Nothing here. Change the filters.</p>}
    </div>
  );
}

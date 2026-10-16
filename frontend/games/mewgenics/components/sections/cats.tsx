"use client";

import { BicepsFlexed, BowArrow, Clover, Heart, Lightbulb, Mouth, Footprints, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Breeding } from "@/games/mewgenics/components/breeding";
import { CatLab } from "@/games/mewgenics/components/cat-lab";
import { Chip, Tag, Thumb } from "@/games/mewgenics/components/chip";
import { Disagreements } from "@/games/mewgenics/components/disagreements";
import { IndexGroup } from "@/games/mewgenics/components/index-group";
import { TrophyLink } from "@/games/mewgenics/components/trophy-link";
import { breeding, classes, trophyIcon } from "@/games/mewgenics/lib/data";
import { cn } from "@/lib/utils";

/** Ícone de cada atributo, na ordem em que aparecem no gato. São ícones do lucide, não os do jogo; o pareamento é dedução pelos desenhos. */
const STAT_ICON: Record<string, LucideIcon> = {
  Strength: BicepsFlexed,
  Dexterity: BowArrow,
  Constitution: Heart,
  Intelligence: Lightbulb,
  Speed: Footprints,
  Charisma: Mouth,
  Luck: Clover,
};

const STAT_ORDER = Object.keys(STAT_ICON);
const STAT_RULES = [...classes.statRules].sort((a, b) => {
  const rank = (stat: string) => (STAT_ORDER.includes(stat) ? STAT_ORDER.indexOf(stat) : STAT_ORDER.length);
  return rank(a.stat) - rank(b.stat);
});

const ROLES = ["Damage", "Tank", "Support", "Control"];
const KITTENS = { yes: "Kittens", no: "No kittens", rare: "Rarely" } as const;
const KITTEN_TONE = { yes: "teal", no: "pink", rare: "mustard" } as const;

/** Gatos: coleiras, criação, calculadora, orientação e regras de stats. */
export function Cats() {
  const [role, setRole] = useState<string | null>(null);
  const list = classes.classes.filter((c) => !role || c.roles.includes(role));

  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-muted-foreground">Everything about your cats: collars, breeding and inheritance, a stats calculator and the rules behind the numbers.</p>

      <IndexGroup id="cats-collars" title="Collars (classes)" count={classes.classes.length}>
        <p className="max-w-3xl">{classes.intro}</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={role === null} onClick={() => setRole(null)}>
            All
          </Chip>
          {ROLES.map((r) => (
            <Chip key={r} active={role === r} onClick={() => setRole(role === r ? null : r)}>
              {r}
            </Chip>
          ))}
        </div>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {list.map((c) => (
            <li key={c.id} id={`class-${c.id}`} className="flex scroll-mt-24 gap-4 py-3">
              <Thumb src={trophyIcon(c.trophy)} />
              <div className="min-w-0 flex-1">
              <h4 className="flex flex-wrap items-center gap-2 text-xl font-extrabold">
                {c.name}
                {c.tier && <Tag tone="paper">Tier {c.tier}</Tag>}
                {c.mods.map((m) => (
                  <Tag key={m} tone={m.startsWith("-") ? "paper" : "pink"}>
                    {m}
                  </Tag>
                ))}
                {c.roles.map((r) => (
                  <span key={r} className="label">
                    {r}
                  </span>
                ))}
                <TrophyLink name={c.trophy} />
              </h4>
              <p className="mt-1">{c.summary}</p>
              {c.special && <p className="mt-1 text-[0.95rem]">{c.special}</p>}
              <p className="mt-1 text-[0.95rem]">
                <span className="label mr-2">Unlock</span>
                {c.unlock}
              </p>
              {c.pick && (
                <p className="text-[0.95rem]">
                  <span className="label mr-2">Pick when</span>
                  {c.pick}
                </p>
              )}
              {c.conflict && <p className="text-[0.95rem] text-muted-foreground">{c.conflict}</p>}
              </div>
            </li>
          ))}
        </ul>
        <Disagreements items={classes.discrepancies} title="Class disagreements" />
      </IndexGroup>

      <IndexGroup id="cats-breeding" title="Breeding">
        <Breeding />
      </IndexGroup>

      <IndexGroup id="cats-lab" title="Cat lab">
        <CatLab />
      </IndexGroup>

      <IndexGroup id="cats-orientation" title="Orientation and kittens" count={breeding.orientation.length}>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {breeding.orientation.map((o) => (
            <li key={o.pair} className="grid items-baseline gap-x-6 gap-y-1 py-2.5 sm:grid-cols-[1fr_8rem_1fr]">
              <p className="font-bold">{o.pair}</p>
              <span>
                <Tag tone={KITTEN_TONE[o.kittens]} className={cn(o.kittens === "yes" && "text-white")}>
                  {KITTENS[o.kittens]}
                </Tag>
              </span>
              <p>{o.result}</p>
            </li>
          ))}
        </ul>
        <ul className="max-w-3xl list-disc space-y-1.5 pl-5 marker:text-(--coral)">
          {breeding.orientationNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </IndexGroup>

      <IndexGroup id="cats-stats" title="Stat rules" count={classes.statRules.length}>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {STAT_RULES.map((r) => {
            const Icon = STAT_ICON[r.stat];
            return (
              <li key={r.stat} className="grid gap-x-6 py-2.5 sm:grid-cols-[11rem_1fr]">
                <span className="flex items-center gap-2 font-extrabold">
                  {Icon && <Icon aria-hidden className="size-5 shrink-0" />}
                  {r.stat}
                </span>
                <span>{r.rule}</span>
              </li>
            );
          })}
        </ul>
      </IndexGroup>
    </div>
  );
}

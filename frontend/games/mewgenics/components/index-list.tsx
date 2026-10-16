"use client";

import { useState } from "react";
import { Chip, Tag, Thumb } from "@/games/mewgenics/components/chip";
import { Disagreements } from "@/games/mewgenics/components/disagreements";
import { IndexGroup } from "@/games/mewgenics/components/index-group";
import { Trophies } from "@/games/mewgenics/components/trophies";
import { breeding, classes, start, trophies, trophyIcon, trophyId } from "@/games/mewgenics/lib/data";
import { cn } from "@/lib/utils";

const ROLES = ["Damage", "Tank", "Support", "Control"];
const KITTENS = { yes: "Kittens", no: "No kittens", rare: "Rarely" } as const;
const KITTEN_TONE = { yes: "teal", no: "pink", rare: "mustard" } as const;

function TrophyLink({ name }: { name?: string }) {
  const id = trophyId(name);
  if (!id) return null;
  return (
    <a href={`#trophy-${id}`} className="text-sm font-bold underline underline-offset-4">
      trophy
    </a>
  );
}

/** Índice de consulta: coleiras, vizinhos, orientação e regras de stats. */
export function IndexList() {
  const [role, setRole] = useState<string | null>(null);
  const list = classes.classes.filter((c) => !role || c.roles.includes(role));
  const npcs = [...start.npcs].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-5">
      <IndexGroup id="index-classes" title="Collars (classes)" count={classes.classes.length}>
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

      <IndexGroup id="index-neighbours" title="Neighbours" count={npcs.length}>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {npcs.map((n, i) => (
            <li key={n.id} id={`npc-${n.id}`} className="flex scroll-mt-24 gap-4 py-3">
              <Thumb src={trophyIcon(n.trophy)} />
              <div className="min-w-0 flex-1">
              <h4 className="flex flex-wrap items-baseline gap-x-3 text-xl font-extrabold">
                <span className="font-display text-lg text-(--coral)">{i + 1}</span>
                {n.name}
                <span className="text-base font-semibold text-muted-foreground">{n.role}</span>
                <TrophyLink name={n.trophy} />
              </h4>
              <p className="mt-1">
                <span className="label mr-2">Takes</span>
                {n.takes}
              </p>
              <p>
                <span className="label mr-2">Gives</span>
                {n.gives.join("; ")}
              </p>
              <p className="text-[0.95rem] text-muted-foreground">{n.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </IndexGroup>

      <IndexGroup id="index-orientation" title="Orientation and kittens" count={breeding.orientation.length}>
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

      <IndexGroup id="index-stats" title="Stat rules" count={classes.statRules.length}>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {classes.statRules.map((r) => (
            <li key={r.stat} className="grid gap-x-6 py-2.5 sm:grid-cols-[11rem_1fr]">
              <span className="font-extrabold">{r.stat}</span>
              <span>{r.rule}</span>
            </li>
          ))}
        </ul>
      </IndexGroup>

      <IndexGroup id="index-trophies" title="Trophies (PS5)" count={trophies.trophies.length}>
        <Trophies data={trophies} />
      </IndexGroup>
    </div>
  );
}

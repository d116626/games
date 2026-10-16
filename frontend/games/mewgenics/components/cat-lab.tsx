"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Tag } from "@/games/mewgenics/components/chip";
import { classes } from "@/games/mewgenics/lib/data";
import type { CatClass, Family } from "@/games/mewgenics/types";

const STATS = ["STR", "DEX", "CON", "INT", "SPD", "CHA", "LCK"] as const;
type Stat = (typeof STATS)[number];
type Stats = Record<Stat, number>;

const FULL: Record<Stat, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  SPD: "Speed",
  CHA: "Charisma",
  LCK: "Luck",
};

const FAMILY_LABEL: Record<Family, string> = {
  melee: "Strength-based: melee classes",
  ranged: "Dexterity-based: ranged classes",
  hybrid: "Strong in both: hybrid",
  mind: "Weak in both: mind classes",
  any: "Balanced: flexible classes",
};

/** Regras de bolso do Greenside: de STR e DEX sai a família de classes. */
function familyOf({ STR, DEX }: Stats): Family {
  if (STR >= 7 && DEX >= 7) return "hybrid";
  if (STR >= DEX + 2) return "melee";
  if (DEX >= STR + 2) return "ranged";
  if (STR <= 5 && DEX <= 5) return "mind";
  return "any";
}

function modsOf(c: CatClass | undefined): Partial<Stats> {
  const out: Partial<Stats> = {};
  for (const m of c?.mods ?? []) {
    const hit = /^([+-]\d+)\s+(\w+)$/.exec(m);
    if (hit && (STATS as readonly string[]).includes(hit[2])) out[hit[2] as Stat] = Number(hit[1]);
  }
  return out;
}

/** Calculadora do gato: stats base + coleira dão HP, mana, crítico e dano à distância; sugere coleiras. */
export function CatLab() {
  const [base, setBase] = useState<Stats>({ STR: 5, DEX: 5, CON: 5, INT: 5, SPD: 5, CHA: 5, LCK: 5 });
  const [collar, setCollar] = useState("");
  const chosen = classes.classes.find((c) => c.id === collar);
  const mods = modsOf(chosen);
  const total = Object.fromEntries(STATS.map((s) => [s, base[s] + (mods[s] ?? 0)])) as Stats;

  const set = (s: Stat, v: number) => setBase((b) => ({ ...b, [s]: Math.min(20, Math.max(0, v)) }));
  const family = familyOf(base);
  const suggestions = classes.classes.filter((c) => c.family === family || c.family === "any");

  const results = [
    { label: "HP", value: total.CON * 4, hint: "4 per CON" },
    { label: "Max mana", value: total.CHA * 3, hint: "3 per CHA" },
    { label: "Mana / turn", value: total.INT, hint: "1 per INT" },
    { label: "Crit chance", value: `${total.LCK * 2}%`, hint: "2% per LCK" },
  ];

  return (
    <div className="space-y-10">
      <p className="max-w-3xl">
        Type the <strong>base</strong> stats of a cat (kittens inherit base stats only). Pick a collar to see the totals
        with its bonus. Formulas come from Greenside&apos;s guide.
      </p>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
        <div>
          <ul className="divide-y divide-border border-y-2 border-foreground">
            {STATS.map((s) => (
              <li key={s} className="flex items-center gap-3 py-1.5">
                <span className="w-14 font-display text-lg">{s}</span>
                <span className="hidden flex-1 text-sm text-muted-foreground sm:block">{FULL[s]}</span>
                <button
                  type="button"
                  aria-label={`Decrease ${FULL[s]}`}
                  onClick={() => set(s, base[s] - 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-foreground bg-card active:bg-(--mustard)"
                >
                  <Minus className="size-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={20}
                  aria-label={`${FULL[s]} base`}
                  value={base[s]}
                  onChange={(e) => set(s, Number(e.target.value))}
                  className="h-11 w-14 rounded-lg border-2 border-foreground bg-card text-center font-display text-xl"
                />
                <button
                  type="button"
                  aria-label={`Increase ${FULL[s]}`}
                  onClick={() => set(s, base[s] + 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-foreground bg-card active:bg-(--mustard)"
                >
                  <Plus className="size-4" />
                </button>
                <span className="w-9 text-right font-bold tabular-nums text-(--coral)" aria-label="Total with collar">
                  {mods[s] ? total[s] : ""}
                </span>
              </li>
            ))}
          </ul>
          <label className="mt-4 flex flex-wrap items-center gap-3">
            <span className="label">Collar</span>
            <select
              value={collar}
              onChange={(e) => setCollar(e.target.value)}
              className="h-11 min-w-48 rounded-lg border-2 border-foreground bg-card px-3 font-bold"
            >
              <option value="">None (collarless)</option>
              {classes.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.mods.join(" ")}
                </option>
              ))}
            </select>
          </label>
          {chosen?.special && <p className="mt-2 text-sm text-muted-foreground">{chosen.special}</p>}
        </div>

        <div className="space-y-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {results.map((r) => (
              <div key={r.label} className="border-t-4 border-(--coral) pt-2">
                <dt className="label">{r.label}</dt>
                <dd className="font-display text-5xl leading-none">{r.value}</dd>
                <p className="mt-1 text-sm text-muted-foreground">{r.hint}</p>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="font-display text-xl">Ranged basic attacks</h3>
            <ul className="mt-2 divide-y divide-border border-y-2 border-foreground">
              {classes.ranged.map((r) => {
                const bonus = (total.DEX - 5) / (r.halfScaling ? 4 : 2);
                return (
                  <li key={r.name} className="flex items-baseline justify-between py-1.5">
                    <span className="font-bold">{r.name}</span>
                    <span className="font-display text-xl tabular-nums">{Math.max(0, Math.floor(r.damage + bonus))}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Base damage + (DEX - 5) / 2. The guide does not say how odd values round; these round down.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl">Which collar?</h3>
        <p className="mt-1 font-bold">{FAMILY_LABEL[family]}</p>
        <ul className="mt-3 grid gap-x-10 border-t-2 border-foreground md:grid-cols-2">
          {suggestions.map((c) => (
            <li key={c.id} className="border-b border-border py-3">
              <p className="flex flex-wrap items-center gap-2 font-extrabold">
                {c.name}
                {c.tier && <Tag tone="paper">Tier {c.tier}</Tag>}
                {c.mods.map((m) => (
                  <Tag key={m} tone="pink">
                    {m}
                  </Tag>
                ))}
              </p>
              <p className="text-[0.95rem]">{c.pick ?? c.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted-foreground">
          Greenside only says high or low; the cut-offs here (7+, a gap of 2, 5 or below) are our reading. Mutations and
          passives can override all of it. Every collar is in the Index.
        </p>
      </div>
    </div>
  );
}

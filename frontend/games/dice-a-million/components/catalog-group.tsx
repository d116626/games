"use client";

import { useState } from "react";
import { DieShape, MAX_PIPS } from "@/games/dice-a-million/components/die-shape";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import { type CatalogItem, RARITIES, type Rarity, type Trait } from "@/games/dice-a-million/types";
import { cn } from "@/lib/utils";

/** Formatos agrupados como no jogo: 1 a 6 pontos, e a cruz para 7 lados ou mais. */
const bucket = (sides: number) => Math.min(sides, MAX_PIPS + 1);

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-8 cursor-pointer rounded border-2 border-(--ink) px-2 text-sm font-semibold",
        active ? "bg-(--ink) text-white" : "bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

/** Lista de itens do catálogo com filtros de raridade, formato (nº de lados, nos dados) e palavras-chave (todas as marcadas). */
export function CatalogGroup({ items, traits }: { items: CatalogItem[]; traits: Trait[] }) {
  const [rarity, setRarity] = useState<Rarity | null>(null);
  const [sides, setSides] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const counts = new Map<string, number>();
  for (const i of items) for (const t of i.traits ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  const available = traits.filter((t) => counts.has(t.id)).sort((a, b) => counts.get(b.id)! - counts.get(a.id)!);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const hasRarity = items.some((i) => i.rarity);
  const shapes = [...new Set(items.flatMap((i) => (i.sides ? [bucket(i.sides)] : [])))].sort((a, b) => a - b);
  const shown = items.filter(
    (i) =>
      (!rarity || i.rarity === rarity) &&
      (!sides || (i.sides && bucket(i.sides) === sides)) &&
      picked.every((t) => i.traits?.includes(t)),
  );

  return (
    <>
      {(hasRarity || shapes.length > 0 || available.length > 0) && (
        <div className="mb-4 space-y-2">
          {hasRarity && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 text-sm font-bold">Rarity</span>
              {RARITIES.map((r) => (
                <Chip key={r.id} active={rarity === r.id} onClick={() => setRarity(rarity === r.id ? null : r.id)}>
                  {r.label}
                </Chip>
              ))}
            </div>
          )}
          {shapes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 text-sm font-bold">Shape</span>
              {shapes.map((n) => (
                <Chip key={n} active={sides === n} onClick={() => setSides(sides === n ? null : n)}>
                  <DieShape sides={n} className="size-5" />
                </Chip>
              ))}
            </div>
          )}
          {available.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 text-sm font-bold">Tags</span>
              {available.map((t) => (
                <Chip key={t.id} active={picked.includes(t.id)} onClick={() => toggle(t.id)}>
                  {t.label} <span className="opacity-60">{counts.get(t.id)}</span>
                </Chip>
              ))}
            </div>
          )}
          {available.filter((t) => picked.includes(t.id)).map((t) => (
            <p key={t.id} className="text-sm">
              <b>{t.label}:</b> {t.description}
            </p>
          ))}
          <p className="text-xs text-muted-foreground">
            Showing {shown.length} of {items.length}.
          </p>
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((i) => (
          <li key={i.id}>
            <ItemRow icon={i.icon} name={i.name} tag={i.hidden ? "Hidden" : undefined} faces={i.faces} sides={i.sides} rarity={i.rarity} condition={i.condition} text={i.effect} />
          </li>
        ))}
      </ul>
    </>
  );
}

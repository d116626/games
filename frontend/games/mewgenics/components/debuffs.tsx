"use client";

import { useState } from "react";
import { Chip, Tag } from "@/games/mewgenics/components/chip";
import { debuffs } from "@/games/mewgenics/lib/data";

const KINDS = [
  { id: "damage", label: "Damage over time" },
  { id: "control", label: "Control" },
  { id: "modifier", label: "Modifiers" },
] as const;

/** Debuffs e status: o que fazem, como usar em inimigos e o que vigiar nos seus gatos. */
export function Debuffs() {
  const [kind, setKind] = useState<string | null>(null);
  const list = debuffs.debuffs.filter((d) => !kind || d.kind === kind);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip active={kind === null} onClick={() => setKind(null)}>
          All
        </Chip>
        {KINDS.map((k) => (
          <Chip key={k.id} active={kind === k.id} onClick={() => setKind(kind === k.id ? null : k.id)}>
            {k.label}
          </Chip>
        ))}
      </div>
      <ul className="divide-y divide-border border-y-2 border-foreground">
        {list.map((d) => (
          <li key={d.id} id={`debuff-${d.id}`} className="scroll-mt-24 py-3">
            <h4 className="flex flex-wrap items-center gap-2 text-xl font-extrabold">
              {d.name}
              {d.rating === "top" && <Tag tone="teal">Top pick</Tag>}
              {d.rating === "weak" && <Tag tone="paper">Weak pick</Tag>}
            </h4>
            <p className="mt-1">{d.what}</p>
            <p className="mt-1 text-[0.95rem]">
              <span className="label mr-2">Use</span>
              {d.use}
            </p>
            {d.watch && (
              <p className="mt-1 text-[0.95rem]">
                <span className="label mr-2">Watch out</span>
                {d.watch}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

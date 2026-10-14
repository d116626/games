"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Chip, Tag } from "@/games/blood-of-dawnwalker/components/chip";
import type { SkillsDataset, TreeId } from "@/games/blood-of-dawnwalker/types";

type Entry = { id: string; name: string; tree: TreeId; effect: string; tags: string[]; ultimate?: boolean };

/** Árvores e lista de habilidades/perks agrupada por árvore, uma linha por item. */
export function Skills({ data }: { data: SkillsDataset }) {
  const [tree, setTree] = useState<TreeId | null>(null);
  const [view, setView] = useState<"abilities" | "perks">("abilities");
  const [ultimates, setUltimates] = useState(false);
  const [q, setQ] = useState("");

  const entries: Entry[] =
    view === "abilities"
      ? data.abilities.map((a) => ({ ...a, tags: [a.kind, ...(a.cost ? [a.cost] : [])] }))
      : data.perks.filter((p) => !ultimates || p.ultimate).map((p) => ({ ...p, tags: [] }));
  const needle = q.trim().toLowerCase();
  const shown = entries.filter((e) => (!tree || e.tree === tree) && (e.name + " " + e.effect).toLowerCase().includes(needle));

  return (
    <div className="space-y-10">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-3">
        {data.trees.map((t) => (
          <div key={t.id} className="border-t-2 border-(--game-accent)/70 pt-3">
            <h3 className="font-display text-3xl leading-none">{t.name}</h3>
            <p className="label mt-1">{t.time === "anytime" ? "Day and night" : `${t.time} only`}</p>
            <p className="mt-2">{t.summary}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              <b className="text-foreground">Unlock:</b> {t.unlock}
            </p>
          </div>
        ))}
      </div>
      <ul className="max-w-3xl list-disc space-y-1 pl-5 text-muted-foreground marker:text-(--game-accent)">
        {data.rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={view === "abilities"} onClick={() => setView("abilities")}>
            Abilities
          </Chip>
          <Chip active={view === "perks"} onClick={() => setView("perks")}>
            Perks
          </Chip>
          {view === "perks" && (
            <Chip active={ultimates} onClick={() => setUltimates(!ultimates)}>
              Ultimates only
            </Chip>
          )}
          <span className="mx-1 hidden w-px bg-border sm:block" aria-hidden />
          {data.trees.map((t) => (
            <Chip key={t.id} active={tree === t.id} onClick={() => setTree(tree === t.id ? null : t.id)}>
              {t.name}
            </Chip>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or effect"
          aria-label="Search skills"
          className="min-h-11 w-full max-w-md rounded-full border border-border bg-transparent px-4"
        />
        <p className="text-sm text-muted-foreground">{shown.length} shown</p>
      </div>

      <div className="space-y-10">
        {data.trees.map((t) => {
          const list = shown.filter((e) => e.tree === t.id);
          if (list.length === 0) return null;
          return (
            <section key={t.id}>
              <h3 className="label mb-1">
                {t.name} · {list.length}
              </h3>
              <ul className="divide-y divide-border border-y border-border">
                {list.map((e) => (
                  <li key={e.id} className="grid gap-x-8 gap-y-0.5 py-3 sm:grid-cols-[15rem_1fr]">
                    <div>
                      <p className="flex items-center gap-1.5 font-bold">
                        {e.ultimate && <Star className="size-4 fill-(--game-accent) text-(--game-accent)" aria-label="Ultimate" />}
                        {e.name}
                      </p>
                      {e.tags.length > 0 && <Tag>{e.tags.join(" · ")}</Tag>}
                    </div>
                    <p className="text-muted-foreground">{e.effect}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

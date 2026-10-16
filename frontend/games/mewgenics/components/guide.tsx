"use client";

import { Check } from "lucide-react";
import { Big, Tag, Thumb } from "@/games/mewgenics/components/chip";
import { Disagreements } from "@/games/mewgenics/components/disagreements";
import { biomes, route, start, trophyIcon, trophyId } from "@/games/mewgenics/lib/data";
import type { Area, Milestone } from "@/games/mewgenics/types";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const KIND = {
  home: { label: "At home", tone: "teal", rule: "border-(--teal)" },
  breeding: { label: "Breeding", tone: "pink", rule: "border-(--pink)" },
  event: { label: "Event", tone: "mustard", rule: "border-(--mustard)" },
} as const;

const NPC_NAME = new Map(start.npcs.map((n) => [n.id, n.name]));

type Segment = { lanes: { path: string | null; areas: Area[] }[] };

/** Áreas consecutivas de trilhas A e B viram colunas lado a lado; o resto segue em linha. */
function segmentsOf(areas: Area[]): Segment[] {
  const out: Segment[] = [];
  for (const a of areas) {
    const last = out.at(-1);
    const lane = last?.lanes.at(-1);
    if (!a.path) {
      if (last && last.lanes.length === 1 && !lane?.path) lane?.areas.push(a);
      else out.push({ lanes: [{ path: null, areas: [a] }] });
    } else if (lane?.path === a.path) lane.areas.push(a);
    else if (last && lane?.path && lane.path !== a.path) last.lanes.push({ path: a.path, areas: [a] });
    else out.push({ lanes: [{ path: a.path, areas: [a] }] });
  }
  return out;
}

function MilestoneRow({ m }: { m: Milestone }) {
  const k = KIND[m.kind];
  return (
    <div className={cn("border-l-4 pl-3", k.rule)}>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-extrabold">
        <Tag tone={k.tone}>{k.label}</Tag>
        {m.title}
        {m.npcs.map((id) => (
          <a key={id} href={`#npc-${id}`} className="text-sm font-bold underline underline-offset-4">
            {NPC_NAME.get(id)}
          </a>
        ))}
        {m.kind === "breeding" && (
          <a href="#cats-breeding" className="text-sm font-bold underline underline-offset-4">
            Breeding
          </a>
        )}
      </p>
      <p className="text-[0.95rem]">
        <span className="label mr-2">When</span>
        {m.when}
      </p>
      <p className="text-[0.95rem]">{m.text}</p>
    </div>
  );
}

/** O guia numa linha do tempo: antes da primeira corrida, atos com áreas e marcos de casa; marque o que já fez. */
const biomeIds = new Set(biomes.biomes.map((b) => b.id));

export function Guide() {
  const { set, toggle, reset } = useLocalSet("mewgenics:route-done");
  const available = (a: Area) => !set.has(a.id) && !!a.needs && a.needs.every((id) => set.has(id));
  const next = route.areas.filter(available);
  const doneCount = route.areas.filter((a) => set.has(a.id)).length;
  const at = (id: string) => route.milestones.filter((m) => m.at === id);

  const AreaRow = ({ a }: { a: Area }) => {
    const done = set.has(a.id);
    const isNext = available(a);
    const tid = trophyId(a.trophy);
    return (
      <li id={`area-${a.id}`} className="scroll-mt-24 space-y-3">
        <div className={cn("flex gap-3", done && "opacity-55")}>
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            aria-label={`Mark ${a.name} as done`}
            onClick={() => toggle(a.id)}
            className={cn(
              "mt-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-[3px] border-foreground transition-colors",
              done ? "bg-(--coral) text-white" : isNext ? "bg-(--mustard)" : "bg-card hover:bg-(--mustard)",
            )}
          >
            {done && <Check className="size-4" strokeWidth={3} />}
          </button>
          <Thumb src={trophyIcon(a.trophy)} className="size-12" />
          <div className="min-w-0 flex-1">
            <h4 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xl font-extrabold">
              <span className={cn(done && "line-through")}>{a.name}</span>
              {isNext && <Tag tone="mustard">Next</Tag>}
              {a.unlocks && <Tag tone="pink">Unlocks {a.unlocks}</Tag>}
              {biomeIds.has(a.id) && (
                <a href={`#biome-${a.id}`} className="text-sm font-bold underline underline-offset-4">
                  enemies and bosses
                </a>
              )}
              {tid && (
                <a href={`#trophy-${tid}`} className="text-sm font-bold underline underline-offset-4">
                  trophy
                </a>
              )}
            </h4>
            <p>
              <span className="label mr-2">Needs</span>
              {a.requires}
            </p>
            {a.note && <p className="text-muted-foreground">{a.note}</p>}
          </div>
        </div>
        {at(a.id).map((m) => (
          <div key={m.id} className="ml-11">
            <MilestoneRow m={m} />
          </div>
        ))}
      </li>
    );
  };

  return (
    <div className="space-y-14">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <p className="font-display text-5xl leading-none">
            {doneCount}
            <span className="text-2xl text-muted-foreground"> / {route.areas.length} areas</span>
          </p>
          <button
            type="button"
            onClick={() => doneCount > 0 && window.confirm("Clear your progress?") && reset()}
            className="min-h-10 cursor-pointer text-sm font-bold underline underline-offset-4"
          >
            Reset
          </button>
        </div>
        <p className="mt-3">
          <span className="label mr-2">Next up</span>
          {next.length > 0 ? (
            next.map((a) => (
              <a key={a.id} href={`#area-${a.id}`} className="tag mr-2 mt-1">
                {a.name}
              </a>
            ))
          ) : (
            <span className="text-muted-foreground">Nothing left that the guide can place.</span>
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tick an area when you finish it. Saved only in this browser. Secret areas whose needs the sources do not spell
          out are never greyed or marked Next.
        </p>
      </div>

      <div>
        <h3 className="font-display text-3xl">Before your first run</h3>
        <ol className="mt-3 divide-y divide-border border-y-2 border-foreground">
          {start.steps.map((s, i) => (
            <li key={s.title} className="flex gap-5 py-4">
              <Big className="w-10 shrink-0 text-5xl">{i + 1}</Big>
              <div>
                <h4 className="text-xl font-extrabold leading-snug">{s.title}</h4>
                <p className="mt-1 max-w-3xl text-[1.02rem]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-sm text-muted-foreground">{start.note}</p>
      </div>

      <ul className="max-w-3xl list-disc space-y-1.5 pl-5 marker:text-(--coral)">
        {route.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      {route.acts.map((act) => {
        const areas = route.areas.filter((a) => a.act === act.id);
        return (
          <div key={act.id}>
            <h3 className="font-display text-3xl">{act.title}</h3>
            <p className="mt-1 max-w-3xl text-muted-foreground">{act.summary}</p>
            <div className="mt-5 space-y-6 border-l-4 border-foreground pl-5 md:ml-3 md:pl-7">
              {at(`act${act.id}`).map((m) => (
                <MilestoneRow key={m.id} m={m} />
              ))}
              {segmentsOf(areas).map((seg) => (
                <div
                  key={seg.lanes[0].areas[0].id}
                  className={cn(seg.lanes.length > 1 && "grid gap-x-8 gap-y-6 lg:grid-cols-2")}
                >
                  {seg.lanes.map((lane) => (
                    <div key={lane.areas[0].id} className="space-y-5">
                      {lane.path && (
                        <p className="label">
                          Path {lane.path}
                          {seg.lanes.length > 1 && " · pick either first, you need both"}
                        </p>
                      )}
                      <ul className="space-y-5">
                        {lane.areas.map((a) => (
                          <AreaRow key={a.id} a={a} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Disagreements items={route.discrepancies} />
    </div>
  );
}

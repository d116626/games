import { ArrowRight, TriangleAlert } from "lucide-react";
import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";
import { HandTracker, type TrackerRow } from "@/games/dice-a-million/components/hand-tracker";
import { ItemRef } from "@/games/dice-a-million/components/item-ref";
import { RichText } from "@/games/dice-a-million/components/rich-text";
import { achievementById, roadmap } from "@/games/dice-a-million/lib/data";
import { itemInfo } from "@/games/dice-a-million/lib/items";
import type { Achievement, HandGoal, HandUnlock, ItemInfo } from "@/games/dice-a-million/types";

const pad = (n: number) => String(n).padStart(2, "0");

const infoOf = (a: Achievement): ItemInfo =>
  itemInfo(a.name) ?? { name: a.name, icon: a.icon, condition: a.how, text: a.tip ?? "" };

function Unlocks({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {ids.map((id) => {
        const a = achievementById.get(id);
        return (
          a && (
            <li key={id} className="sticker-sm">
              <ItemRef item={infoOf(a)} className="flex min-h-9 items-center gap-1.5 py-1 pl-1 pr-2.5">
                <AchievementIcon src={a.icon} name="" className="size-7 rounded-md border-0" />
                <span className="text-xs font-bold">{a.name}</span>
              </ItemRef>
            </li>
          )
        );
      })}
    </ul>
  );
}

function HandTile({ hand }: { hand: HandUnlock }) {
  const icon = hand.icon ? achievementById.get(hand.icon)?.icon : undefined;
  const body = (
    <>
      <p className="mt-1.5 text-sm">{hand.requirement}</p>
      <details className="mt-2 text-sm">
        <summary className="min-h-9 cursor-pointer py-1.5 font-mono text-[11px] uppercase tracking-wider">Rules and notes</summary>
        <div className="space-y-1.5 pb-1">
          {hand.effect ? <p>{hand.effect}</p> : <p className="text-muted-foreground">No rules documented yet.</p>}
          {hand.starter && (
            <p>
              <b>Starts with:</b> {hand.starter}
            </p>
          )}
          {hand.stats && (
            <p>
              <b>Stats:</b> {hand.stats}
            </p>
          )}
          {hand.tips && hand.tips.length > 0 && (
            <ul className="list-disc space-y-1 pl-5">
              {hand.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </>
  );
  return (
    <li className="sticker-sm flex gap-3 p-3">
      {icon ? (
        <AchievementIcon src={icon} name={hand.name} className="size-14" />
      ) : (
        <span className="hud-tab grid size-14 shrink-0 place-items-center rounded-lg font-display text-3xl">
          {hand.name[0]}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-2xl leading-none">{hand.name}</h4>
        {hand.after && (
          <p className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <ArrowRight className="size-3" /> play as {hand.after}
          </p>
        )}
        {body}
      </div>
    </li>
  );
}

const COLUMNS: { key: keyof Omit<HandGoal, "hand" | "icon">; label: string }[] = [
  { key: "face3", label: "Beat Face 3" },
  { key: "million", label: "1M pips" },
  { key: "rush", label: "Dice Rush" },
  { key: "promotion", label: "Promotion" },
  { key: "power6", label: "Power VI" },
];

function GoalMatrix() {
  const rows: TrackerRow[] = roadmap.goals.map((row) => ({
    hand: row.hand,
    cells: COLUMNS.map((c) => {
      const a = row[c.key] ? achievementById.get(row[c.key]!) : undefined;
      return a ? { id: a.id, label: c.label, rarity: a.rarity, info: infoOf(a) } : null;
    }),
  }));
  return <HandTracker columns={COLUMNS.map((c) => c.label)} rows={rows} />;
}

/** Roteiro em etapas, em ordem, para chegar à promoção final. Rolagem contínua, sem checklist. */
export function Roadmap() {
  return (
    <div className="space-y-14">
      <nav aria-label="Stages" className="sticker p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The route</p>
        <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {roadmap.stages.map((s, i) => (
            <li key={s.id}>
              <a href={`#stage-${s.id}`} className="flex min-h-9 items-center gap-2 text-sm font-semibold hover:underline">
                <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{pad(i + 1)}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {roadmap.stages.map((stage, i) => (
        <article key={stage.id} id={`stage-${stage.id}`} className="scroll-mt-20 space-y-5 lg:scroll-mt-8">
          <header className="sticker p-4">
            <span className="hud-tab rounded-md px-2 py-1 text-xs">Stage {pad(i + 1)}</span>
            <h3 className="mt-2 font-display text-3xl leading-none md:text-4xl">{stage.title}</h3>
            <p className="mt-2 max-w-3xl font-medium">{stage.goal}</p>
          </header>

          <ol className="space-y-3 border-l-[3px] border-(--ink) pl-5 md:ml-4">
            {stage.steps.map((step, j) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[2.2rem] top-3 grid size-7 place-items-center rounded-full border-2 border-(--ink) bg-(--game-accent) font-mono text-xs font-bold text-black">
                  {j + 1}
                </span>
                <div className="sticker-sm p-4">
                  <h4 className="font-bold">{step.title}</h4>
                  <div className="mt-1 text-sm">
                    <RichText text={step.body} />
                  </div>
                  {step.warning && (
                    <p className="mt-2 flex gap-2 rounded-md bg-(--ink) p-2.5 text-xs text-white">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-(--game-accent)" />
                      {step.warning}
                    </p>
                  )}
                  <Unlocks ids={step.unlocks} />
                </div>
              </li>
            ))}
          </ol>

          {stage.id === "hands" && (
            <ul className="grid gap-3 md:grid-cols-2">
              {roadmap.hands.map((h) => (
                <HandTile key={h.name} hand={h} />
              ))}
            </ul>
          )}
          {stage.id === "mastery" && <GoalMatrix />}
        </article>
      ))}
    </div>
  );
}

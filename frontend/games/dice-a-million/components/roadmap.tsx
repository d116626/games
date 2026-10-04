import { ArrowRight, TriangleAlert } from "lucide-react";
import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";
import { achievementById, roadmap } from "@/games/dice-a-million/lib/data";
import type { HandGoal, HandUnlock } from "@/games/dice-a-million/types";

const pad = (n: number) => String(n).padStart(2, "0");

function Unlocks({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {ids.map((id) => {
        const a = achievementById.get(id);
        return (
          a && (
            <li key={id} className="sticker-sm flex items-center gap-1.5 py-1 pl-1 pr-2.5">
              <AchievementIcon src={a.icon} name="" className="size-7 rounded-md border-0" />
              <span className="text-xs font-bold">{a.name}</span>
            </li>
          )
        );
      })}
    </ul>
  );
}

function HandTile({ hand }: { hand: HandUnlock }) {
  const icon = hand.icon ? achievementById.get(hand.icon)?.icon : undefined;
  return (
    <li className="sticker-sm flex gap-3 p-3">
      {icon ? (
        <AchievementIcon src={icon} name={hand.name} className="size-14" />
      ) : (
        <span className="hud-tab grid size-14 shrink-0 place-items-center rounded-lg font-display text-3xl">
          {hand.name[0]}
        </span>
      )}
      <div className="min-w-0">
        <h4 className="font-display text-2xl leading-none">{hand.name}</h4>
        {hand.after && (
          <p className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <ArrowRight className="size-3" /> play as {hand.after}
          </p>
        )}
        <p className="mt-1.5 text-sm">{hand.requirement}</p>
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
  return (
    <div className="sticker overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <thead>
          <tr className="hud-tab text-xs">
            <th className="px-3 py-2 font-normal">Hand</th>
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-3 py-2 font-normal">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roadmap.goals.map((row) => (
            <tr key={row.hand} className="border-t-2 border-(--ink)/15">
              <th className="px-3 py-2 font-display text-lg font-normal">{row.hand.replace(" Hand", "")}</th>
              {COLUMNS.map((c) => {
                const a = row[c.key] ? achievementById.get(row[c.key]!) : undefined;
                return (
                  <td key={c.key} className="px-3 py-2">
                    {a ? (
                      <span className="flex items-center gap-2">
                        <AchievementIcon src={a.icon} name="" className="size-8 rounded-md" />
                        <span className="text-xs font-semibold leading-tight">{a.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
                  <p className="mt-1 text-sm">{step.body}</p>
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

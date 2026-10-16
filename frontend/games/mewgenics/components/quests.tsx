import { GameImage } from "@/components/game/game-image";
import { Bullets } from "@/games/mewgenics/components/bullets";
import { Disagreements } from "@/games/mewgenics/components/disagreements";
import { quests } from "@/games/mewgenics/lib/data";
import type { QuestItem } from "@/games/mewgenics/types";

function Items({ items }: { items: QuestItem[] }) {
  return (
    <ul className="divide-y divide-border border-y-2 border-foreground">
      {items.map((q) => (
        <li key={q.id} id={`quest-${q.id}`} className="scroll-mt-24 py-3">
          <h4 className="flex flex-wrap items-baseline gap-x-3 text-xl font-extrabold">
            {q.name}
            {q.aka && <span className="text-base font-semibold text-muted-foreground">also: {q.aka}</span>}
          </h4>
          {q.unlock && (
            <p className="mt-1">
              <span className="label mr-2">Get it</span>
              {q.unlock}
            </p>
          )}
          <div className={q.image ? "mt-1 grid gap-3 md:grid-cols-[1fr_14rem] md:items-start" : "mt-1"}>
            <p>{q.text}</p>
            {q.image && (
              <GameImage
                src={q.image}
                alt={`${q.name} item card`}
                className="w-full rounded-lg border-2 border-foreground bg-card"
              />
            )}
          </div>
          {q.tips.length > 0 && (
            <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 text-[0.95rem] marker:text-(--coral)">
              {q.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Itens de quest principais (vêm das defesas da casa). */
export function MainQuests() {
  return (
    <div className="space-y-4">
      <Bullets title="How they work" items={quests.mainRules} />
      <figure className="max-w-xl">
        <GameImage
          src={quests.image}
          alt="Event at the end of an Act 3 quest"
          width={720}
          height={405}
          className="aspect-video w-full rounded-lg border-2 border-foreground bg-card"
        />
        <figcaption className="mt-1 text-sm text-muted-foreground">{quests.imageCaption}</figcaption>
      </figure>
      <Items items={quests.mainItems} />
      <Bullets title="Tips" items={quests.mainTips} />
      <Disagreements items={quests.discrepancies} title="Quest disagreements" />
    </div>
  );
}

/** Missões secundárias do Dr. Beanies. */
export function SideQuests() {
  return (
    <div className="space-y-4">
      <Bullets title="How they work" items={quests.sideRules} />
      <Items items={quests.sideItems} />
    </div>
  );
}

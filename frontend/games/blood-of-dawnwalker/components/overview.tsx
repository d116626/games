import type { TipsDataset } from "@/games/blood-of-dawnwalker/types";

/** Números principais do jogo: uma faixa de fatos, sem caixas. */
export function Overview({ facts }: { facts: TipsDataset["facts"] }) {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-xl leading-relaxed">
        Coen has <b className="text-(--game-accent)">30 days</b> to save his family. Quests, camps, ruins and spending skill points
        cost time; walking and fighting do not. Every choice trades time for XP, gear or Infamy, so most of this guide is
        about spending the clock well.
      </p>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="border-t-2 border-(--game-accent)/70 pt-3">
            <dt className="label">{f.label}</dt>
            <dd className="mt-1 text-lg font-bold leading-snug">{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="max-w-3xl text-muted-foreground">
        <b className="text-foreground">Playing on PS5?</b> Start with the trophies: Duelist difficulty must be set before the
        first save, and 28 of the 47 trophies are missable.
      </p>
    </div>
  );
}

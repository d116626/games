import { TriangleAlert } from "lucide-react";
import type { TipsDataset } from "@/games/blood-of-dawnwalker/types";

/** Dicas por tema e as divergências entre fontes (lista de duas colunas). */
export function Tips({ data }: { data: TipsDataset }) {
  return (
    <div className="space-y-16">
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {data.groups.map((g) => (
          <section key={g.id} className="border-t-2 border-(--game-accent)/70 pt-3">
            <h3 className="font-display text-3xl leading-none">{g.title}</h3>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 marker:text-(--game-accent)">
              {g.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div>
        <h3 className="flex items-center gap-2 font-display text-3xl leading-none">
          <TriangleAlert className="size-6 text-(--dawn)" /> Where the sources disagree
        </h3>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {data.discrepancies.map((d) => (
            <div key={d.topic} className="grid gap-x-8 gap-y-1 py-4 md:grid-cols-[13rem_1fr]">
              <dt className="font-bold">{d.topic}</dt>
              <dd className="text-muted-foreground">{d.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

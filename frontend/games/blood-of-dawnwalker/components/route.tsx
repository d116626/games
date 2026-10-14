import { TriangleAlert } from "lucide-react";
import { BudgetPlanner } from "@/games/blood-of-dawnwalker/components/budget-planner";
import type { RouteDataset } from "@/games/blood-of-dawnwalker/types";

/** Planejador de segmentos e a rota em 10 partes (linha do tempo). */
export function Route({ data }: { data: RouteDataset }) {
  return (
    <div className="space-y-12">
      <p className="flex max-w-3xl items-start gap-2 text-muted-foreground">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-(--dawn)" />
        {data.note}
      </p>
      <BudgetPlanner total={data.totalSegments} items={data.budget} />
      <ol className="space-y-8 border-l-2 border-(--game-accent)/40 pl-6 md:ml-4 md:pl-8">
        {data.parts.map((p, i) => (
          <li key={p.id} className="relative">
            <span className="absolute -left-[2.35rem] top-0 grid size-8 place-items-center rounded-full bg-(--game-accent) font-display text-lg text-white md:-left-[3.35rem]">
              {i + 1}
            </span>
            <h3 className="font-display text-3xl leading-tight">{p.title.replace(/^Part \d+ - /, "")}</h3>
            <p className="mt-1 max-w-3xl text-muted-foreground">{p.focus}</p>
            {p.steps.length > 0 && (
              <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 marker:text-(--game-accent)">
                {p.steps.map((s) => (
                  <li key={s.text}>
                    {s.text}
                    {s.note && <span className="text-muted-foreground"> {s.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

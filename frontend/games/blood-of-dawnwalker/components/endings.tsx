import { Check, TriangleAlert, X } from "lucide-react";
import { Tag } from "@/games/blood-of-dawnwalker/components/chip";
import type { Ending, EndingsDataset } from "@/games/blood-of-dawnwalker/types";

/** Sete finais, sem botão de spoiler (decisão do usuário). Uma linha por final: resumo à esquerda, passos à direita. */
export function Endings({ data }: { data: EndingsDataset }) {
  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-lg text-muted-foreground">{data.intro}</p>
      {(["main", "secret"] as const).map((g) => (
        <div key={g}>
          <h3 className="label mb-2">{g === "main" ? "Main endings" : "Secret endings"}</h3>
          <div className="divide-y divide-border border-y border-border">
            {data.endings
              .filter((e) => e.group === g)
              .map((e) => (
                <EndingRow key={e.id} e={e} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EndingRow({ e }: { e: Ending }) {
  return (
    <article id={`ending-${e.id}`} className="grid scroll-mt-24 gap-x-10 gap-y-4 py-8 md:grid-cols-[17rem_1fr]">
      <div>
        <h4 className="font-display text-4xl leading-none">{e.name}</h4>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-bold">
          {e.freesFamily ? <Check className="size-4 text-(--dawn)" /> : <X className="size-4 text-destructive" />}
          {e.freesFamily ? "Family freed" : "Family not freed"}
        </p>
        {e.trophy && <Tag className="mt-1 block">Trophy: {e.trophy}</Tag>}
        <p className="mt-3 text-muted-foreground">{e.summary}</p>
      </div>
      <div>
        <ol className="space-y-3">
          {e.steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-(--game-accent)/20 text-xs font-bold text-(--game-accent)">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {e.warnings.length > 0 && (
          <ul className="mt-4 space-y-2">
            {e.warnings.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

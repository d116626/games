import type { Discrepancy } from "@/games/mewgenics/types";

/** Pontos em que os guias discordam: recolhidos, com os dois lados e o veredito. */
export function Disagreements({ items, title = "Where the guides disagree" }: { items: Discrepancy[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-2xl">{title}</h3>
      <ul className="mt-3 divide-y divide-border border-y-2 border-foreground">
        {items.map((d) => (
          <li key={d.topic}>
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-2 font-bold">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-sm text-background group-open:rotate-45">
                  +
                </span>
                {d.topic}
              </summary>
              <div className="space-y-2 pb-4 pl-9">
                <ul className="list-disc space-y-1 pl-5 marker:text-(--coral)">
                  {d.sides.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {d.verdict && (
                  <p>
                    <span className="tag tag-teal mr-2">Verdict</span>
                    {d.verdict}
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

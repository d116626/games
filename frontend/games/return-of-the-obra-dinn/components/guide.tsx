import { guide } from "@/games/return-of-the-obra-dinn/lib/data";
import { topicId } from "@/games/return-of-the-obra-dinn/lib/search";

const GROUPS = [
  { label: "How it works", topics: guide.basics },
  { label: "How to deduce", topics: guide.deduction },
  { label: "Marking the answer", topics: guide.causes },
];

/** Como o jogo funciona e como deduzir, em sequência de passos numerados e sem entregar nenhum fate. */
export function Guide() {
  let step = 0;
  return (
    <div className="max-w-2xl space-y-12">
      {GROUPS.map((g) => (
        <div key={g.label} className="space-y-8">
          <p className="label border-b border-border pb-2">{g.label}</p>
          {g.topics.map((t) => (
            <div key={t.title} id={topicId(t.title)} className="scroll-mt-24 space-y-3">
              <h3 className="font-display text-3xl leading-tight">
                <span className="mr-3 text-muted-foreground">{++step}.</span>
                {t.title}
              </h3>
              {t.items.map((i) => (
                <p key={i} className="text-lg leading-relaxed">
                  {i}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

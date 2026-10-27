import { Entry } from "@/games/return-of-the-obra-dinn/components/entry";
import { Reveal, Tag } from "@/games/return-of-the-obra-dinn/components/ui";
import { chapters } from "@/games/return-of-the-obra-dinn/lib/data";

/** Capítulos do livro, na ordem do jogo: dicas progressivas e respostas atrás de botões. */
export function Chapters() {
  return (
    <div className="space-y-12">
      <p className="text-muted-foreground">
        Chapters follow the order of the book. Each entry opens in steps: where to look, who it is, then the answer.
      </p>
      {chapters.chapters.map((ch) => (
        <article key={ch.n} id={`chapter-${ch.n}`} className="scroll-mt-24 space-y-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-3xl">
              {ch.roman}. {ch.title}
            </h3>
            <Tag tone="dim">{ch.fateCount} entries</Tag>
            {ch.solveCount !== ch.fateCount && <Tag tone="outline">{ch.solveCount} to solve</Tag>}
          </div>
          <Reveal label="Chapter summary (spoilers)">
            <p>{ch.summary}</p>
          </Reveal>
          <div className="space-y-6">
            {ch.parts.map((p) => (
              <div key={p.n ?? "x"} className="panel p-4">
                <header className="flex items-baseline gap-3">
                  <h4 className="font-display text-xl">{p.n ? `Part ${p.n}` : "Disappearances"}</h4>
                  {p.location && <span className="label">{p.location}</span>}
                </header>
                <ul className="divide-y divide-border">
                  {p.fates.map((f, i) => (
                    <Entry key={f.crew ?? i} entry={f} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

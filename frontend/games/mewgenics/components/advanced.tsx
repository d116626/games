import { GameImage } from "@/components/game/game-image";
import { Bullets } from "@/games/mewgenics/components/bullets";
import { advanced } from "@/games/mewgenics/lib/data";
import type { Pic } from "@/games/mewgenics/types";

function Figure({ pic, className }: { pic: Pic; className?: string }) {
  return (
    <figure className={className}>
      <GameImage
        src={pic.src}
        alt={pic.caption}
        width={pic.width}
        height={pic.height}
        className="h-auto w-full rounded-lg border-2 border-foreground bg-card"
      />
      <figcaption className="mt-1 text-sm text-muted-foreground">{pic.caption}</figcaption>
    </figure>
  );
}

/** Técnicas da comunidade (uma fonte cada): o que levar, passos com imagens, dicas e ressalvas. */
export function Advanced() {
  return (
    <div className="space-y-4">
      <p className="panel max-w-3xl p-4">{advanced.intro}</p>
      <ul className="space-y-3">
        {advanced.techniques.map((t) => (
          <li key={t.id}>
            <details id={`tech-${t.id}`} className="group scroll-mt-24 rounded-xl border-2 border-foreground bg-card">
              <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2">
                <h4 className="text-xl font-extrabold">{t.title}</h4>
                <span className="ml-auto text-sm font-extrabold group-open:hidden">Show</span>
                <span className="ml-auto hidden text-sm font-extrabold group-open:inline">Hide</span>
              </summary>
              <div className="space-y-5 border-t-2 border-foreground p-4">
                <p className="max-w-3xl">{t.summary}</p>
                {t.needs.length > 0 && <Bullets title="What you need" items={t.needs} />}
                {t.items.length > 0 && (
                  <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {t.items.map((p) => (
                      <Figure key={p.src} pic={p} />
                    ))}
                  </div>
                )}
                {t.steps.length > 0 && (
                  <ol className="space-y-4">
                    {t.steps.map((s, i) => (
                      <li key={s.title} className="grid gap-x-3 sm:grid-cols-[2rem_1fr]">
                        <span className="grid size-8 place-items-center rounded-full bg-foreground text-sm font-extrabold text-background">
                          {i + 1}
                        </span>
                        <div className="space-y-2">
                          <h5 className="text-lg font-extrabold">{s.title}</h5>
                          <p className="max-w-3xl">{s.text}</p>
                          {s.images.length > 0 && (
                            <div className="grid items-start gap-3 sm:grid-cols-2">
                              {s.images.map((p) => (
                                <Figure key={p.src} pic={p} />
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {t.tips.length > 0 && <Bullets title="Tips" items={t.tips} />}
                {t.caveats.length > 0 && <Bullets title="Caveats" items={t.caveats} />}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

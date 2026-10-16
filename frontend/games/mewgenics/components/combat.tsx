import { GameImage } from "@/components/game/game-image";
import { combat } from "@/games/mewgenics/lib/data";

/** Princípios de combate do Greenside: regra de ouro e tópicos com capturas quando existem. */
export function Combat() {
  return (
    <div className="space-y-4">
      <p className="panel max-w-3xl p-4 text-lg font-bold">
        <span className="label mr-2">Golden rule</span>
        {combat.goldenRule}
      </p>
      <ul className="divide-y divide-border border-y-2 border-foreground">
        {combat.topics.map((t) => (
          <li key={t.id} id={`combat-${t.id}`} className="scroll-mt-24 py-3">
            <h4 className="text-xl font-extrabold">{t.title}</h4>
            <p className="mt-1 max-w-3xl">{t.text}</p>
            {t.tips.length > 0 && (
              <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 text-[0.95rem] marker:text-(--coral)">
                {t.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            )}
            {t.images.length > 0 && (
              <figure className="mt-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {t.images.map((src) => (
                    <GameImage
                      key={src}
                      src={src}
                      alt={t.caption ?? t.title}
                      width={720}
                      height={405}
                      className="aspect-video w-full rounded-lg border-2 border-foreground bg-card"
                    />
                  ))}
                </div>
                {t.caption && <figcaption className="mt-1 text-sm text-muted-foreground">{t.caption}</figcaption>}
              </figure>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

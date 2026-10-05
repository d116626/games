import { GameImage } from "@/components/game/game-image";
import { RichText } from "@/games/dice-a-million/components/rich-text";
import { meta, strategy } from "@/games/dice-a-million/lib/data";

/** Capturas de tela e dicas de estratégia por tema. */
export function Strategy() {
  const screens = meta.images.filter((i) => i.src.includes("/screens/"));
  return (
    <div className="space-y-8">
      <ul className="grid gap-4 sm:grid-cols-2">
        {screens.map((s, i) => (
          <li key={s.src} className="sticker overflow-hidden" style={{ rotate: i % 2 ? "0.6deg" : "-0.6deg" }}>
            <GameImage src={s.src} alt={s.alt} className="aspect-video w-full object-cover" />
          </li>
        ))}
      </ul>

      <div className="gap-4 space-y-4 lg:columns-2">
        {strategy.map((group) => (
          <section key={group.title} className="sticker break-inside-avoid overflow-hidden">
            <h3 className="bg-(--game-accent) px-4 py-2 font-display text-2xl leading-none">{group.title}</h3>
            <ul className="list-disc space-y-2 py-4 pl-9 pr-4 text-sm">
              {group.tips.map((t) => (
                <li key={t}>
                  <RichText text={t} />
                </li>
              ))}
            </ul>
            <p className="border-t-2 border-(--ink) px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Source: {group.source}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

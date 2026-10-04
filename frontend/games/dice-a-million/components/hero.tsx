import { ArrowDown } from "lucide-react";
import { GameImage } from "@/components/game/game-image";
import { game } from "@/games/dice-a-million/game";
import { achievements, bestiary, image, roadmap } from "@/games/dice-a-million/lib/data";

/** Hero do guia: arte do jogo, logo, números do guia e entrada para a roteiro. */
export function Hero() {
  const hero = image("hero.jpg");
  const logo = image("logo.png");
  const stats = [
    `${achievements.length} achievements`,
    `${roadmap.stages.length} stages`,
    `${bestiary.bosses.length} bosses`,
  ];
  return (
    <section className="relative mt-2 overflow-hidden rounded-2xl border-[3px] border-(--ink) shadow-[6px_6px_0_var(--ink)]">
      {hero && <GameImage src={hero.src} alt="" loading="eager" className="absolute inset-0 size-full object-cover" />}
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-(--ink)/55 via-(--ink)/15 to-transparent" />
      <div className="relative grid items-center gap-8 p-6 md:grid-cols-[minmax(0,20rem)_1fr] md:p-10">
        <h1>
          <span className="sr-only">{game.name}</span>
          {logo && <GameImage src={logo.src} alt="" loading="eager" className="mx-auto w-56 drop-shadow-[0_6px_0_rgb(0_0_0/0.35)] md:w-full" />}
        </h1>
        <div className="space-y-5">
          <p className="sticker inline-block max-w-md px-4 py-3 text-lg font-medium leading-snug">
            {game.tagline}
          </p>
          <ul className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <li key={s} className="hud-tab rounded-md px-2.5 py-1 text-xs">
                {s}
              </li>
            ))}
          </ul>
          <a href="#roadmap" className="roll-plate inline-flex min-h-12 items-center gap-2 px-6 text-sm">
            Start the roadmap <ArrowDown className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

import { GameImage } from "@/components/game/game-image";
import { Bullets } from "@/games/mewgenics/components/bullets";
import { Tag } from "@/games/mewgenics/components/chip";
import { biomes, route } from "@/games/mewgenics/lib/data";
import type { Foe } from "@/games/mewgenics/types";

function FoeList({ title, foes }: { title: string; foes: Foe[] }) {
  return (
    <div>
      <p className="label mb-1">{title}</p>
      <ul className="divide-y divide-border border-y-2 border-foreground">
        {foes.map((f) => (
          <li key={f.name} className="grid gap-x-4 gap-y-2 py-2 sm:grid-cols-[13rem_1fr]">
            <span className="flex flex-wrap items-baseline gap-2 font-extrabold">
              {f.name}
              {f.priority && <Tag tone="pink">Kill first</Tag>}
            </span>
            <span className={f.image ? "grid gap-3 md:grid-cols-[1fr_16rem] md:items-start" : undefined}>
              <span>{f.text}</span>
              {f.image && (
                <GameImage
                  src={f.image}
                  alt={`${f.name} boss intro screen`}
                  width={720}
                  height={405}
                  className="aspect-video w-full rounded-lg border-2 border-foreground bg-card"
                />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Biomas: um bloco recolhível por área da rota (mesmo id), com perigos, inimigos notáveis e chefes. */
export function Biomes() {
  return (
    <div className="space-y-3">
      {biomes.biomes.map((b) => {
        const area = route.areas.find((a) => a.id === b.id);
        return (
          <details key={b.id} id={`biome-${b.id}`} className="group scroll-mt-24 rounded-xl border-2 border-foreground bg-card">
            <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2">
              <h4 className="text-xl font-extrabold">{area?.name ?? b.id}</h4>
              {b.leans && <Tag tone="teal">Favours {b.leans.toLowerCase()}</Tag>}
              <span className="ml-auto text-sm font-extrabold group-open:hidden">Show</span>
              <span className="ml-auto hidden text-sm font-extrabold group-open:inline">Hide</span>
            </summary>
            <div className="space-y-4 border-t-2 border-foreground p-4">
              {b.image && (
                <GameImage
                  src={b.image}
                  alt={`${area?.name ?? b.id} title screen`}
                  width={720}
                  height={405}
                  className="aspect-video max-h-64 w-full rounded-lg border-2 border-foreground bg-card object-cover"
                />
              )}
              <p className="max-w-3xl">{b.summary}</p>
              <Bullets title="Hazards and weather" items={b.hazards} />
              <FoeList title="Notable enemies" foes={b.enemies} />
              <FoeList title="Bosses" foes={b.bosses} />
              {b.tips.length > 0 && <Bullets title="Tips" items={b.tips} />}
            </div>
          </details>
        );
      })}
      <Bullets title="Act 3 tips (Past and Future)" items={biomes.act3Tips} />
    </div>
  );
}

/** Defesas da casa: preparação comum e os chefes (Guillotina em 3 rodadas e os demais). */
export function HouseBosses() {
  return (
    <div className="space-y-4">
      <Bullets title="Setup (all house defences)" items={biomes.houseSetup} />
      <ul className="divide-y divide-border border-y-2 border-foreground">
        {biomes.houseBosses.map((h) => (
          <li key={h.id} id={`house-${h.id}`} className="scroll-mt-24 py-3">
            <h4 className="text-xl font-extrabold">{h.name}</h4>
            <p className="mt-1">{h.text}</p>
            <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 marker:text-(--coral)">
              {h.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

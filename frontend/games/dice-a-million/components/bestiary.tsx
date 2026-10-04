import { Skull } from "lucide-react";
import { bestiary } from "@/games/dice-a-million/lib/data";

/** Chefes (com a versão reforçada) e dados inimigos. */
export function Bestiary() {
  return (
    <div className="space-y-10">
      <ul className="grid gap-4 md:grid-cols-2">
        {bestiary.bosses.map((boss) => (
          <li key={boss.name} className="sticker flex flex-col gap-3 p-4">
            <h3 className="font-display text-3xl leading-none">{boss.name}</h3>
            <p className="text-sm">{boss.effect}</p>
            {boss.empowered && (
              <p className="mt-auto flex gap-2 rounded-md bg-(--ink) p-3 text-sm text-white">
                <Skull className="mt-0.5 size-4 shrink-0 text-(--game-accent)" />
                <span>
                  <b className="font-mono text-[11px] uppercase tracking-widest text-(--game-accent)">
                    Empowered{" "}
                  </b>
                  {boss.empowered}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em]">
          <span className="hud-tab rounded-md px-2 py-1">Enemy dice</span>
          Rolled against you
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bestiary.enemyDice.map((die) => (
            <li key={die.name} className="sticker-sm flex items-start gap-3 p-3">
              <span className="font-display text-3xl leading-none">{die.name}</span>
              <span className="text-sm">{die.effect}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

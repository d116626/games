import { Ban, ChevronRight, RefreshCw, Skull } from "lucide-react";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import { bestiary } from "@/games/dice-a-million/lib/data";

/** Chefes (com a versão reforçada) e o chefe final, no mesmo formato compacto do índice. */
export function Bosses() {
  const { finalBoss } = bestiary;
  return (
    <div className="space-y-6">
      <ul className="space-y-2 text-xs">
        <li className="flex gap-2">
          <RefreshCw className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <b>Boss reroll:</b> on the map you can banish the next boss. The first reroll in a run is free, each one after costs 2
            max ring slots, and after any reroll all later round targets are 1.5x higher.
          </span>
        </li>
        <li className="flex gap-2">
          <Skull className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <b>Empowered:</b> always on Faces 4 and 5 (after you win), and on Faces 1 to 3 in ULTRAHARD.
          </span>
        </li>
      </ul>

      <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {bestiary.bosses.map((boss) => (
          <li key={boss.name}>
            <ItemRow
              icon={boss.icon}
              name={boss.name}
              tag={boss.targetMod ? `Target x${boss.targetMod}` : undefined}
              text={boss.effect}
            >
              {boss.empowered && (
                <p className="mt-1 flex gap-1.5 text-xs">
                  <Skull className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    <b>Empowered:</b> {boss.empowered}
                  </span>
                </p>
              )}
              {boss.banned && (
                <p className="mt-1 flex gap-1.5 text-xs text-muted-foreground">
                  <Ban className="mt-0.5 size-3.5 shrink-0" />
                  {boss.banned}
                </p>
              )}
              {boss.tips && (
                <details className="group mt-1 text-xs">
                  <summary className="flex cursor-pointer list-none items-center gap-1 font-bold">
                    <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" />
                    How to beat it
                  </summary>
                  <p className="mt-1 pl-5">{boss.tips}</p>
                </details>
              )}
            </ItemRow>
          </li>
        ))}
      </ul>

      <div className="border-t-2 border-(--ink)/15 pt-4">
        <ItemRow
          icon={finalBoss.icon}
          iconClass="h-16 w-9"
          name={finalBoss.name}
          tag={`${finalBoss.hp} HP`}
          text={`${finalBoss.effect} Waits at the end of Face 6. At ${finalBoss.phaseTwoHp} HP another boss joins: ${finalBoss.phaseTwoBosses.join(", ")}.`}
        >
          <details className="group mt-1 text-xs">
            <summary className="flex cursor-pointer list-none items-center gap-1 font-bold">
              <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" />
              Dice it can roll (odds)
            </summary>
            <ul className="mt-1 grid gap-x-6 gap-y-0.5 pl-5 sm:grid-cols-2">
              {finalBoss.attacks.map((attack) => (
                <li key={attack.dice.join()} className="flex gap-2">
                  <span className="w-9 shrink-0 text-right tabular-nums">~{attack.chance}%</span>
                  {attack.dice.join(" + ")}
                </li>
              ))}
            </ul>
          </details>
        </ItemRow>
      </div>
    </div>
  );
}

/** Dados que os chefes rolam contra você. */
export function EnemyDice() {
  return (
    <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      {bestiary.enemyDice.map((die) => (
        <li key={die.name}>
          <ItemRow icon={die.icon} name={die.name} text={die.effect} />
        </li>
      ))}
    </ul>
  );
}

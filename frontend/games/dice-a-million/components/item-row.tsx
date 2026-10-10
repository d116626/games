import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";
import { DieShape, isHollow } from "@/games/dice-a-million/components/die-shape";
import { RARITIES, type Rarity } from "@/games/dice-a-million/types";

/** Linha de item: ícone, nome, raridade, formato (ícone de dado), condição de desbloqueio e efeito. */
export function ItemRow({
  icon,
  name,
  tag,
  faces,
  sides,
  rarity,
  condition,
  text,
  iconClass = "size-12",
  children,
}: {
  icon?: string;
  name: string;
  tag?: string;
  faces?: string;
  sides?: number;
  rarity?: Rarity;
  condition?: string;
  text: string;
  iconClass?: string;
  children?: React.ReactNode;
}) {
  const tier = RARITIES.find((r) => r.id === rarity);
  return (
    <div className="flex gap-3">
      {icon && <AchievementIcon src={icon} name="" className={`shrink-0 ${iconClass}`} />}
      <div className="min-w-0 text-sm">
        <h4 className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold leading-tight">
          {name}
          {tag && <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{tag}</span>}
          {tier && (
            <span
              className="rounded border-2 border-(--ink) px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-(--ink)"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </span>
          )}
          {sides && (
            <span className="rounded bg-(--ink) px-1 py-0.5 leading-none text-white">
              <DieShape sides={sides} hollow={isHollow(sides, faces)} className="size-4" />
            </span>
          )}
        </h4>
        {condition && (
          <p className="mt-0.5 text-xs">
            <b>Unlock:</b> {condition}
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
        {children}
      </div>
    </div>
  );
}

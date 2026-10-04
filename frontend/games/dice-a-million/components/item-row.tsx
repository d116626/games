import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";

/** Linha de item: ícone, nome, faces, condição de desbloqueio e efeito. */
export function ItemRow({
  icon,
  name,
  tag,
  faces,
  condition,
  text,
}: {
  icon?: string;
  name: string;
  tag?: string;
  faces?: string;
  condition?: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      {icon && <AchievementIcon src={icon} name="" className="size-12" />}
      <div className="min-w-0 text-sm">
        <h4 className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold leading-tight">
          {name}
          {tag && <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{tag}</span>}
          {faces && <span className="font-mono text-[11px] font-normal text-muted-foreground">faces {faces}</span>}
        </h4>
        {condition && (
          <p className="mt-0.5 text-xs">
            <b>Unlock:</b> {condition}
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

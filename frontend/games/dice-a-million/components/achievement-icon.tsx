import { GameImage } from "@/components/game/game-image";
import { cn } from "@/lib/utils";

/** Ícone da conquista (jpg quadrado) ou sprite oficial do item (png sem fundo, em `/items/`). */
export function AchievementIcon({ src, name, className }: { src: string; name: string; className?: string }) {
  return (
    <GameImage
      src={src}
      alt={name}
      width={64}
      height={64}
      className={cn(
        "shrink-0 object-contain",
        !src.includes("/items/") && "rounded-lg border-2 border-(--ink) bg-white",
        className,
      )}
    />
  );
}

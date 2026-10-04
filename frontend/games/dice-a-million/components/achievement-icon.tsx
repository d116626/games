import { GameImage } from "@/components/game/game-image";
import { cn } from "@/lib/utils";

/** Ícone da conquista (que é o ícone do dado, anel, mão ou carta). */
export function AchievementIcon({ src, name, className }: { src: string; name: string; className?: string }) {
  return (
    <GameImage
      src={src}
      alt={name}
      width={64}
      height={64}
      className={cn("shrink-0 rounded-lg border-2 border-(--ink) bg-white", className)}
    />
  );
}

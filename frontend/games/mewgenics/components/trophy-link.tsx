import { trophyId } from "@/games/mewgenics/lib/data";

/** Link para o troféu ligado a uma coleira, vizinho ou área. */
export function TrophyLink({ name }: { name?: string }) {
  const id = trophyId(name);
  if (!id) return null;
  return (
    <a href={`#trophy-${id}`} className="text-sm font-bold underline underline-offset-4">
      trophy
    </a>
  );
}

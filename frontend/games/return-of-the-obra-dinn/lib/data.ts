import type {
  ChaptersDataset,
  CrewDataset,
  CrewMember,
  Fate,
  GuideDataset,
  TrophyDataset,
} from "@/games/return-of-the-obra-dinn/types";
import type { GameMeta } from "@/games/types";
import chaptersJson from "@/public/data/return-of-the-obra-dinn/chapters.json";
import crewJson from "@/public/data/return-of-the-obra-dinn/crew.json";
import guideJson from "@/public/data/return-of-the-obra-dinn/guide.json";
import metaJson from "@/public/data/return-of-the-obra-dinn/meta.json";
import trophiesJson from "@/public/data/return-of-the-obra-dinn/trophies.json";

export const meta: GameMeta = metaJson;
export const guide = guideJson as GuideDataset;
export const chapters = chaptersJson as ChaptersDataset;
export const crew = (crewJson as CrewDataset).crew;
export const trophies = trophiesJson as TrophyDataset;

const BY_ID = new Map(crew.map((c) => [c.id, c]));

export function crewById(id: string): CrewMember {
  const c = BY_ID.get(id);
  if (!c) throw new Error(`Unknown crew id: ${id}`);
  return c;
}

/** "Shot with a gun by Robert Witterel", "Spiked by a beast", "Suicide with a gun". */
export function fateText(fate: Fate): string {
  if (fate.killer) return `${fate.cause} by ${crewById(fate.killer).name}`;
  return fate.byBeast ? `${fate.cause} by a beast` : fate.cause;
}

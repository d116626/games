import type { ExtrasDataset, GuideDataset, Item, ItemKind, LevelsDataset, TrophyDataset } from "@/games/denshattack/types";
import type { GameMeta } from "@/games/types";
import extrasJson from "@/public/data/denshattack/extras.json";
import guideJson from "@/public/data/denshattack/guide.json";
import levelsJson from "@/public/data/denshattack/levels.json";
import metaJson from "@/public/data/denshattack/meta.json";
import trophiesJson from "@/public/data/denshattack/trophies.json";

export const meta: GameMeta = metaJson;
export const guide = guideJson as GuideDataset;
export const levels = levelsJson as LevelsDataset;
export const extras = extrasJson as ExtrasDataset;
export const trophies = trophiesJson as TrophyDataset;

/** Itens marcáveis de cada tipo, sem repetição (um dare em partes aparece em vários spots com o mesmo id). */
export function uniqueItems(kinds?: ItemKind[], chapter?: number): Item[] {
  const seen = new Map<string, Item>();
  for (const level of levels.levels) {
    if (chapter !== undefined && level.chapter !== chapter) continue;
    for (const spot of level.spots) {
      for (const item of spot.items) {
        if ((!kinds || kinds.includes(item.kind)) && !seen.has(item.id)) seen.set(item.id, item);
      }
    }
  }
  return [...seen.values()];
}

export const KIND_LABEL: Record<ItemKind, string> = { can: "Spray Can", gear: "Gear", film: "Film Roll", dare: "Dare" };
export const TRACKED: ItemKind[] = ["can", "gear", "film", "dare"];

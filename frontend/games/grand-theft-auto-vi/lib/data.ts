import type { TrophyDataset } from "@/games/grand-theft-auto-vi/types";
import type { GameMeta } from "@/games/types";
import metaJson from "@/public/data/grand-theft-auto-vi/meta.json";
import trophiesJson from "@/public/data/grand-theft-auto-vi/trophies.json";

export const meta: GameMeta = metaJson;
export const trophies = trophiesJson as TrophyDataset;

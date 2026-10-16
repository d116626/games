import type {
  BreedingDataset,
  ClassDataset,
  RouteDataset,
  StartDataset,
  Trophy,
  TrophyDataset,
} from "@/games/mewgenics/types";
import type { GameMeta } from "@/games/types";
import breedingJson from "@/public/data/mewgenics/breeding.json";
import classesJson from "@/public/data/mewgenics/classes.json";
import metaJson from "@/public/data/mewgenics/meta.json";
import routeJson from "@/public/data/mewgenics/route.json";
import startJson from "@/public/data/mewgenics/start.json";
import trophiesJson from "@/public/data/mewgenics/trophies.json";

export const meta: GameMeta = metaJson;
export const trophies = trophiesJson as TrophyDataset;
export const start = startJson as StartDataset;
export const breeding = breedingJson as BreedingDataset;
export const classes = classesJson as ClassDataset;
export const route = routeJson as RouteDataset;

/** Id do troféu pelo nome, para ligar classes, áreas e NPCs à lista de troféus. */
const byName = new Map<string, Trophy>(trophies.trophies.map((t) => [t.name, t]));
export function trophyId(name?: string): number | undefined {
  return name ? byName.get(name)?.id : undefined;
}

/** Ícone do troféu: serve de imagem para classes, vizinhos e áreas (o jogo não tem retratos nas fontes). */
export function trophyIcon(name?: string): string | undefined {
  return name ? byName.get(name)?.icon : undefined;
}

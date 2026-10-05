import achievementsJson from "@/public/data/dice-a-million/achievements.json";
import bestiaryJson from "@/public/data/dice-a-million/bestiary.json";
import catalogJson from "@/public/data/dice-a-million/catalog.json";
import metaJson from "@/public/data/dice-a-million/meta.json";
import roadmapJson from "@/public/data/dice-a-million/roadmap.json";
import strategyJson from "@/public/data/dice-a-million/strategy.json";
import type {
  Achievement,
  Boss,
  CatalogItem,
  Enchantment,
  EnemyDie,
  HandGoal,
  HandUnlock,
  Stage,
  TipGroup,
} from "@/games/dice-a-million/types";
import type { GameMeta } from "@/games/types";

export const meta: GameMeta = metaJson;
export const achievements = achievementsJson.items as Achievement[];
export const catalog = catalogJson.items as CatalogItem[];
export const roadmap = roadmapJson as { stages: Stage[]; hands: HandUnlock[]; goals: HandGoal[] };
export const bestiary = bestiaryJson as {
  bosses: Boss[];
  enemyDice: EnemyDie[];
  enchantments: Enchantment[];
  curses: EnemyDie[];
};
export const strategy = strategyJson.groups as TipGroup[];

export const achievementById = new Map(achievements.map((a) => [a.id, a]));
export const image = (name: string) => meta.images.find((i) => i.src.endsWith(name));

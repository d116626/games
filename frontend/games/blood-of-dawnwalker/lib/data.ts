import courtJson from "@/public/data/blood-of-dawnwalker/court.json";
import endingsJson from "@/public/data/blood-of-dawnwalker/endings.json";
import metaJson from "@/public/data/blood-of-dawnwalker/meta.json";
import routeJson from "@/public/data/blood-of-dawnwalker/route.json";
import skillsJson from "@/public/data/blood-of-dawnwalker/skills.json";
import tipsJson from "@/public/data/blood-of-dawnwalker/tips.json";
import trophiesJson from "@/public/data/blood-of-dawnwalker/trophies.json";
import type {
  CourtDataset,
  EndingsDataset,
  RouteDataset,
  SkillsDataset,
  TipsDataset,
  TrophyDataset,
} from "@/games/blood-of-dawnwalker/types";
import type { GameMeta } from "@/games/types";

export const meta: GameMeta = metaJson;
export const trophies = trophiesJson as TrophyDataset;
export const endings = endingsJson as EndingsDataset;
export const court = courtJson as CourtDataset;
export const skills = skillsJson as SkillsDataset;
export const route = routeJson as RouteDataset;
export const tips = tipsJson as TipsDataset;

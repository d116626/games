import type { Mission, StoryDataset, Trophy, TrophyDataset } from "@/games/grand-theft-auto-vi/types";
import type { GameMeta } from "@/games/types";
import metaJson from "@/public/data/grand-theft-auto-vi/meta.json";
import storyJson from "@/public/data/grand-theft-auto-vi/story.json";
import trophiesJson from "@/public/data/grand-theft-auto-vi/trophies.json";

export const meta: GameMeta = metaJson;
export const story = storyJson as StoryDataset;
export const trophies = trophiesJson as TrophyDataset;

export const missions = story.missions;
export const MAIN_COUNT = missions.filter((m) => m.kind === "main").length;

const TROPHY_BY_ID = new Map<number, Trophy>(trophies.trophies.map((t) => [t.id, t]));
const MISSION_BY_ID = new Map<string, Mission>(missions.map((m) => [m.id, m]));

export const trophyById = (id: number) => TROPHY_BY_ID.get(id);
export const missionById = (id: string) => MISSION_BY_ID.get(id);

export const chapterLabel = (n: number) => (n === 0 ? "Prologue" : `Chapter ${n}`);

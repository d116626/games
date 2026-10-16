/** Mesmo formato dos JSONs exportados pelo Python (`utils/games/denshattack/schemas.py`). */
export type ItemKind = "can" | "gear" | "film" | "dare";
export type LevelKind = "level" | "race" | "boss" | "story" | "castle" | "fanzine" | "onsen";

export type Item = { id: string; kind: ItemKind; title?: string; n?: number; of?: number };
export type Spot = { text: string; items: Item[]; images: string[] };

export type Level = {
  code: string;
  name: string;
  chapter: number;
  kind: LevelKind;
  prefecture?: string;
  song?: string;
  artist?: string;
  /** Pontuação da medalha de platina. */
  platinum?: number;
  note?: string;
  spots: Spot[];
};

export type Chapter = { n: number; title: string; region: string };
export type Discrepancy = { topic: string; text: string };
export type LevelsDataset = { chapters: Chapter[]; levels: Level[]; medalTips: string[]; discrepancies: Discrepancy[] };

export type Collectible = {
  id: string;
  name: string;
  stated: number;
  found?: number;
  how: string;
  spend?: string;
  trophy: string;
};
export type GuideDataset = { collectibles: Collectible[]; facts: string[] };

export type Trophy = {
  id: number;
  name: string;
  description: string;
  grade: "platinum" | "gold" | "silver" | "bronze";
  group: string;
  icon: string;
  url: string;
  /** Total da barra de progresso ("0/134"). */
  goal?: number;
  psnRate: number;
  psnTier: string;
  profilesRate: number;
  profilesTier: string;
};
export type TrophyDataset = {
  points: number;
  counts: Record<string, number>;
  groups: { id: string; title: string }[];
  trophies: Trophy[];
};

export type Skin = { name: string; includes: string; code: string; url?: string; image?: string; olderCode?: string };
export type Track = { where: string; song: string; artist: string };
export type ExtrasDataset = { skinHow: string[]; skins: Skin[]; skinNotes: Discrepancy[]; tracks: Track[]; reward: string[] };

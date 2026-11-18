export type Grade = "platinum" | "gold" | "silver" | "bronze";

export type Trophy = {
  id: number;
  name: string;
  description: string;
  grade: Grade;
  icon: string;
  url: string;
  /** Só existe quando a PSN já tem taxas reais (`TrophyDataset.hasRarity`). */
  psnRate?: number;
  psnTier?: string;
  note?: string;
};

export type TrophyDataset = {
  points: number;
  counts: Record<Grade, number>;
  hasRarity: boolean;
  trophies: Trophy[];
};

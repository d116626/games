export type Category =
  | "dice"
  | "rings"
  | "hands"
  | "cards"
  | "challenges"
  | "vortex"
  | "secrets";

/** Formatos dos JSONs de `public/data/dice-a-million` (ver `utils/games/dice_a_million/schemas.py`). */
export type Achievement = {
  id: string;
  name: string;
  category: Category;
  how?: string;
  tip?: string;
  rarity: number;
  icon: string;
};

export type Step = { title: string; body: string; unlocks: string[]; warning?: string };
export type Stage = { id: string; title: string; goal: string; steps: Step[] };
export type HandUnlock = { name: string; icon?: string; requirement: string; after?: string };
export type HandGoal = {
  hand: string;
  icon?: string;
  face3?: string;
  million?: string;
  rush?: string;
  promotion?: string;
  power6?: string;
};

export type Boss = { name: string; effect: string; empowered?: string };
export type EnemyDie = { name: string; effect: string };
export type Enchantment = { name: string; effect: string; appliesTo: "die" | "ring" };
export type TipGroup = { title: string; tips: string[]; source: string };

/** Faixa de raridade pela % global de jogadores que têm a conquista. */
export function rarityTier(percent: number) {
  if (percent >= 50) return { label: "Common", color: "#2ec4a6" };
  if (percent >= 20) return { label: "Uncommon", color: "#74c04a" };
  if (percent >= 5) return { label: "Rare", color: "#f6a21e" };
  return { label: "Ultra rare", color: "#e0457b" };
}

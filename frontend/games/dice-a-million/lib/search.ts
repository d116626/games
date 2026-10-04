import { bestiary, catalog, roadmap, strategy } from "@/games/dice-a-million/lib/data";
import type { SearchEntry } from "@/games/dice-a-million/types";

const KIND_LABEL = { dice: "Die", rings: "Ring", cards: "Card", hands: "Hand" } as const;

/** Tudo o que a busca encontra, montado no servidor. */
export const searchEntries: SearchEntry[] = [
  ...catalog.map((i) => ({
    id: `item-${i.id}`,
    kind: KIND_LABEL[i.kind],
    name: i.name,
    text: i.effect,
    condition: i.condition,
    faces: i.faces,
    icon: i.icon,
  })),
  ...bestiary.bosses.map((b) => ({
    id: `boss-${b.name}`,
    kind: "Boss",
    name: b.name,
    text: [b.effect, b.empowered && `Empowered: ${b.empowered}`].filter(Boolean).join(" "),
    href: "#bosses",
  })),
  ...bestiary.enemyDice.map((d) => ({ id: `enemy-${d.name}`, kind: "Enemy die", name: d.name, text: d.effect, href: "#bosses" })),
  ...bestiary.enchantments.map((e) => ({ id: `ench-${e.name}`, kind: "Enchantment", name: e.name, text: e.effect, href: "#index" })),
  ...strategy.flatMap((g) =>
    g.tips.map((t, i) => ({ id: `tip-${g.title}-${i}`, kind: "Strategy", name: g.title, text: t, href: "#strategy" })),
  ),
  ...roadmap.stages.flatMap((s) =>
    s.steps.map((st) => ({
      id: `step-${s.id}-${st.title}`,
      kind: "Roadmap",
      name: st.title,
      text: st.body,
      href: `#stage-${s.id}`,
    })),
  ),
];

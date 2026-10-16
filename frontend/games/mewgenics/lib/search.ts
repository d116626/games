import { advanced, biomes, breeding, classes, combat, debuffs, events, hidden, quests, route, start, trophies } from "@/games/mewgenics/lib/data";

/** `where` situa a entrada (ex.: o bioma de um inimigo) sem multiplicar os tipos do filtro. */
export type SearchEntry = { kind: string; name: string; text: string; href: string; where?: string };

/** Tudo que a busca acha. Cada entrada leva ao item (classes, vizinhos, áreas, troféus) ou à seção. */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...classes.classes.map((c) => ({
    kind: "Collar",
    name: c.name,
    text: [c.summary, c.pick, c.unlock, c.mods.join(" "), c.roles.join(" ")].filter(Boolean).join(" "),
    href: `#class-${c.id}`,
  })),
  ...start.npcs.map((n) => ({
    kind: "Neighbour",
    name: n.name,
    text: [n.role, n.takes, n.gives.join(" "), n.tip].join(" "),
    href: `#npc-${n.id}`,
  })),
  ...route.areas.map((a) => ({
    kind: "Area",
    name: a.name,
    text: [a.requires, a.unlocks, a.note].filter(Boolean).join(" "),
    href: `#area-${a.id}`,
  })),
  ...biomes.biomes.flatMap((b) => {
    const name = route.areas.find((a) => a.id === b.id)?.name ?? b.id;
    return [
      { kind: "Biome", name, text: [b.summary, ...b.hazards, ...b.tips].join(" "), href: `#biome-${b.id}` },
      ...b.enemies.map((e) => ({ kind: "Enemy", where: name, name: e.name, text: e.text, href: `#biome-${b.id}` })),
      ...b.bosses.map((e) => ({ kind: "Boss", where: name, name: e.name, text: e.text, href: `#biome-${b.id}` })),
    ];
  }),
  ...biomes.houseBosses.map((h) => ({
    kind: "House boss",
    name: h.name,
    text: [h.text, ...h.tips].join(" "),
    href: `#house-${h.id}`,
  })),
  ...combat.topics.map((t) => ({
    kind: "Combat",
    name: t.title,
    text: [t.text, ...t.tips].join(" "),
    href: `#combat-${t.id}`,
  })),
  ...combat.levels.rewards.map((r) => ({
    kind: "Level up",
    name: `Level ${r.level}: ${r.title}`,
    text: r.text,
    href: `#level-${r.level.replace(/\s|→/g, "")}`,
  })),
  ...events.groups.flatMap((g) =>
    g.events.map((e) => ({
      kind: "Event",
      where: g.title,
      name: e.name,
      text: [e.text, e.flag].filter(Boolean).join(" "),
      href: `#event-${e.id}`,
    })),
  ),
  {
    kind: "Event",
    where: "Tragedy",
    name: "Tragedy events",
    text: [events.tragedy.text, ...events.tragedy.harmless].join(" "),
    href: "#event-tragedy",
  },
  ...advanced.techniques.map((t) => ({
    kind: "Technique",
    name: t.title,
    text: [t.summary, ...t.needs, ...t.steps.map((s) => `${s.title}. ${s.text}`), ...t.tips, ...t.caveats].join(" "),
    href: `#tech-${t.id}`,
  })),
  ...hidden.groups.flatMap((g) =>
    g.tips.map((t) => ({
      kind: "Hidden tip",
      name: t.title,
      text: [t.text, t.note].filter(Boolean).join(" "),
      where: g.title,
      href: `#hidden-${t.id}`,
    })),
  ),
  ...debuffs.debuffs.map((d) => ({
    kind: "Debuff",
    name: d.name,
    text: [d.what, d.use, d.watch].filter(Boolean).join(" "),
    href: `#debuff-${d.id}`,
  })),
  ...quests.mainItems.map((q) => ({
    kind: "Quest item",
    name: q.name,
    text: [q.aka, q.unlock, q.text, ...q.tips].filter(Boolean).join(" "),
    href: `#quest-${q.id}`,
  })),
  ...quests.sideItems.map((q) => ({
    kind: "Side quest",
    name: q.name,
    text: [q.text, ...q.tips].join(" "),
    href: `#quest-${q.id}`,
  })),
  ...breeding.houseStats.map((s) => ({ kind: "House stat", name: s.name, text: `${s.effect} ${s.target}`, href: "#cats-breeding" })),
  ...breeding.odds.map((o) => ({ kind: "Odds", name: o.what, text: `${o.base} ${o.boost}`, href: "#cats-breeding" })),
  ...classes.statRules.map((r) => ({ kind: "Stat rule", name: r.stat, text: r.rule, href: "#cats-stats" })),
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    text: `${t.description} ${t.tip ?? ""} ${t.grade}`,
    href: `#trophy-${t.id}`,
  })),
];

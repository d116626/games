import { chapters, crew, fateText, guide, trophies } from "@/games/return-of-the-obra-dinn/lib/data";

/** `where` situa a entrada sem multiplicar os tipos do filtro. */
/** `keywords` entram na busca mas não aparecem no resultado (o fate, por exemplo). */
export type SearchEntry = { kind: string; name: string; text: string; href: string; where?: string; keywords?: string };


export const topicId = (title: string) => `topic-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Tudo que a busca acha. Os tripulantes vêm do gabarito: o resultado mostra só nome, cargo e capítulo, mas a busca também acha pelo fate e pela dica. */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...[...guide.basics, ...guide.deduction, ...guide.causes].map((t) => ({
    kind: "Guide",
    name: t.title,
    text: t.items.join(" "),
    href: `#${topicId(t.title)}`,
  })),
  ...chapters.chapters.map((c) => ({
    kind: "Chapter",
    name: `${c.roman}. ${c.title}`,
    text: [...new Set(c.parts.flatMap((p) => (p.location ? [p.location] : [])))].join(", "),
    href: `#chapter-${c.n}`,
  })),
  ...crew.map((c) => ({
    kind: "Crew",
    name: c.name,
    text: `${c.role} · chapter ${chapters.chapters.find((ch) => ch.n === c.chapter)?.roman}`,
    keywords: [fateText(c.fate), c.alsoListed, c.origin, c.how].filter(Boolean).join(" "),
    href: `#answer-${c.id}`,
  })),
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    text: `${t.description} ${t.grade} ${t.psnTier}`,
    href: `#trophy-${t.id}`,
  })),
];

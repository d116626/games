import { extras, KIND_LABEL, levels, trophies } from "@/games/denshattack/lib/data";

/** `where` situa a entrada (ex.: o nível de um item) sem multiplicar os tipos do filtro. */
export type SearchEntry = { kind: string; name: string; text: string; href: string; where?: string };

const LEVEL_KIND = { race: "race", boss: "boss", story: "story", castle: "castle shop", fanzine: "fanzine", onsen: "onsen" } as const;

/** Tudo que a busca acha. Itens e dares levam ao ponto exato dentro do nível (`#spot-<nível>-<índice>`). */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...levels.levels.flatMap((l) => {
    const where = `${l.code} ${l.name}`;
    const seen = new Set<string>();
    const items = l.spots.flatMap((s, i) =>
      s.items.flatMap((it) => {
        if (seen.has(it.id)) return [];
        seen.add(it.id);
        const name = it.kind === "dare" ? (it.title ?? "") : it.kind === "film" ? KIND_LABEL.film : `${KIND_LABEL[it.kind]} ${it.n}/${it.of}`;
        return [{ kind: KIND_LABEL[it.kind], name, where, text: s.text, href: `#spot-${l.code}-${i}` }];
      }),
    );
    const text = [
      l.kind !== "level" && LEVEL_KIND[l.kind],
      l.prefecture,
      l.song && `${l.song} ${l.artist}`,
      l.platinum && `platinum ${l.platinum} ${l.platinum.toLocaleString("en-US")}`,
      l.note,
    ]
      .filter(Boolean)
      .join(" ");
    return [{ kind: "Level", name: l.name, where: l.code, text, href: `#level-${l.code}` }, ...items];
  }),
  ...extras.skins.map((s) => ({
    kind: "Skin code",
    name: s.name,
    text: [s.includes, s.code, s.olderCode].filter(Boolean).join(" "),
    href: `#skin-${s.code}`,
  })),
  ...levels.levels
    .filter((l) => l.song)
    .map((l) => ({
      kind: "Song",
      name: l.song ?? "",
      where: `${l.code} ${l.name}`,
      text: [l.artist, l.prefecture].filter(Boolean).join(" "),
      href: `#song-${l.code}`,
    })),
  ...extras.tracks.map((t, i) => ({ kind: "Song", name: t.song, where: t.where, text: t.artist, href: `#track-${i}` })),
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    text: `${t.description} ${t.grade} ${t.psnTier}`,
    href: `#trophy-${t.id}`,
  })),
];

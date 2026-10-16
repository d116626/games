import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";
import { Extras } from "@/games/denshattack/components/extras";
import { Guide } from "@/games/denshattack/components/guide";
import { GuideSearch } from "@/games/denshattack/components/guide-search";
import { Hero } from "@/games/denshattack/components/hero";
import { Levels } from "@/games/denshattack/components/levels";
import { Medals } from "@/games/denshattack/components/medals";
import { Shops } from "@/games/denshattack/components/shops";
import { Trophies } from "@/games/denshattack/components/trophies";
import { game } from "@/games/denshattack/game";
import { extras, levels, meta, trophies } from "@/games/denshattack/lib/data";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "guide", label: "Guide" },
  {
    id: "levels",
    label: "Levels",
    children: levels.chapters.map((c) => ({ id: `chapter-${c.n}`, label: `${c.n}. ${c.region}` })),
  },
  {
    id: "shops",
    label: "Shops",
    children: [
      { id: "shops-castles", label: "Castles" },
      { id: "shops-fanzines", label: "Fanzines" },
      { id: "shops-onsens", label: "Onsens" },
    ],
  },
  {
    id: "medals",
    label: "Medals",
    children: [{ id: "medals-tips", label: "Tips" }],
  },
  {
    id: "extras",
    label: "Extras",
    children: [
      { id: "extras-skins", label: "Skin codes" },
      { id: "extras-music", label: "Soundtrack" },
      { id: "extras-rewards", label: "Secret rewards" },
    ],
  },
  { id: "trophies", label: "Trophies" },
];

const SHOP_COUNT = levels.levels.filter((l) => ["castle", "fanzine", "onsen"].includes(l.kind)).length;
const MEDAL_COUNT = levels.levels.filter((l) => ["level", "race", "boss"].includes(l.kind)).length;

export default function Page() {
  return (
    <GameShell
      game={game}
      hero={
        <>
          <Hero />
          <GuideSearch />
        </>
      }
      sections={SECTIONS}
      sources={meta.sources}
      updated={meta.updated}
      issuesUrl="https://github.com/d116626/games/issues/new"
      disclaimer="Fan-made, unofficial. Denshattack! is © its developers and publisher. Compiled from the community guides listed in Sources; tell us and we will remove anything on request. Screenshots are from the 100pguides collectibles guide."
    >
      <Section id="guide" index={1} title="Guide">
        <Guide />
      </Section>
      <Section id="levels" index={2} title="Levels" count={levels.levels.length}>
        <Levels />
      </Section>
      <Section id="shops" index={3} title="Shops" count={SHOP_COUNT}>
        <Shops />
      </Section>
      <Section id="medals" index={4} title="Medals" count={MEDAL_COUNT}>
        <Medals />
      </Section>
      <Section id="extras" index={5} title="Extras" count={extras.skins.length}>
        <Extras />
      </Section>
      <Section id="trophies" index={6} title="Trophies" count={trophies.trophies.length}>
        <Trophies />
      </Section>
    </GameShell>
  );
}

import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";
import { Breeding } from "@/games/mewgenics/components/breeding";
import { CatLab } from "@/games/mewgenics/components/cat-lab";
import { GuideSearch } from "@/games/mewgenics/components/guide-search";
import { Guide } from "@/games/mewgenics/components/guide";
import { Hero } from "@/games/mewgenics/components/hero";
import { IndexList } from "@/games/mewgenics/components/index-list";
import { game } from "@/games/mewgenics/game";
import { meta, route } from "@/games/mewgenics/lib/data";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "guide", label: "Guide" },
  { id: "breeding", label: "Breeding" },
  { id: "lab", label: "Cat lab" },
  {
    id: "index",
    label: "Index",
    children: [
      { id: "index-classes", label: "Collars" },
      { id: "index-neighbours", label: "Neighbours" },
      { id: "index-biomes", label: "Biomes" },
      { id: "index-house", label: "House bosses" },
      { id: "index-combat", label: "Combat" },
      { id: "index-levels", label: "Leveling" },
      { id: "index-events", label: "Events" },
      { id: "index-debuffs", label: "Debuffs" },
      { id: "index-quests", label: "Quest items" },
      { id: "index-side", label: "Side quests" },
      { id: "index-advanced", label: "Advanced" },
      { id: "index-hidden", label: "Hidden interactions" },
      { id: "index-orientation", label: "Orientation" },
      { id: "index-stats", label: "Stat rules" },
      { id: "index-trophies", label: "Trophies" },
    ],
  },
];

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
      disclaimer="Fan-made, unofficial. Mewgenics is © Edmund McMillen and Tyler Glaiel. Compiled from the community guides listed in Sources; tell us and we will remove anything on request."
    >
      <Section id="guide" index={1} title="Guide" count={route.areas.length}>
        <Guide />
      </Section>
      <Section id="breeding" index={2} title="Breeding">
        <Breeding />
      </Section>
      <Section id="lab" index={3} title="Cat lab">
        <CatLab />
      </Section>
      <Section id="index" index={4} title="Index">
        <IndexList />
      </Section>
    </GameShell>
  );
}

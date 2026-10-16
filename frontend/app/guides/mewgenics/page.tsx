import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";
import { GuideSearch } from "@/games/mewgenics/components/guide-search";
import { Guide } from "@/games/mewgenics/components/guide";
import { Hero } from "@/games/mewgenics/components/hero";
import { Cats } from "@/games/mewgenics/components/sections/cats";
import { CombatSection } from "@/games/mewgenics/components/sections/combat";
import { QuestsSection } from "@/games/mewgenics/components/sections/quests";
import { World } from "@/games/mewgenics/components/sections/world";
import { Trophies } from "@/games/mewgenics/components/trophies";
import { game } from "@/games/mewgenics/game";
import { meta, route, trophies } from "@/games/mewgenics/lib/data";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "guide", label: "Guide" },
  {
    id: "cats",
    label: "Cats",
    children: [
      { id: "cats-collars", label: "Collars" },
      { id: "cats-breeding", label: "Breeding" },
      { id: "cats-lab", label: "Cat lab" },
      { id: "cats-orientation", label: "Orientation" },
      { id: "cats-stats", label: "Stat rules" },
    ],
  },
  {
    id: "combat",
    label: "Combat",
    children: [
      { id: "combat-basics", label: "Basics" },
      { id: "combat-levels", label: "Leveling" },
      { id: "combat-debuffs", label: "Debuffs" },
      { id: "combat-hidden", label: "Hidden interactions" },
    ],
  },
  {
    id: "world",
    label: "World",
    children: [
      { id: "world-biomes", label: "Biomes" },
      { id: "world-house", label: "House bosses" },
      { id: "world-neighbours", label: "Neighbours" },
      { id: "world-events", label: "Events" },
    ],
  },
  {
    id: "quests",
    label: "Quests",
    children: [
      { id: "quests-items", label: "Quest items" },
      { id: "quests-side", label: "Side quests" },
      { id: "quests-advanced", label: "Advanced" },
    ],
  },
  { id: "trophies", label: "Trophies" },
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
      <Section id="cats" index={2} title="Cats">
        <Cats />
      </Section>
      <Section id="combat" index={3} title="Combat">
        <CombatSection />
      </Section>
      <Section id="world" index={4} title="World">
        <World />
      </Section>
      <Section id="quests" index={5} title="Quests">
        <QuestsSection />
      </Section>
      <Section id="trophies" index={6} title="Trophies" count={trophies.trophies.length}>
        <Trophies data={trophies} />
      </Section>
    </GameShell>
  );
}

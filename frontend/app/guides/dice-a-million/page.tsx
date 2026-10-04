import { Bestiary } from "@/games/dice-a-million/components/bestiary";
import { Hero } from "@/games/dice-a-million/components/hero";
import { IndexList } from "@/games/dice-a-million/components/index-list";
import { Roadmap } from "@/games/dice-a-million/components/roadmap";
import { Strategy } from "@/games/dice-a-million/components/strategy";
import { game } from "@/games/dice-a-million/game";
import { bestiary, meta, roadmap } from "@/games/dice-a-million/lib/data";
import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";

export const metadata = { title: `${game.name} 100% Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "roadmap", label: "Roadmap" },
  { id: "strategy", label: "Strategy" },
  { id: "bosses", label: "Bosses" },
  { id: "index", label: "Index" },
];

export default function Page() {
  return (
    <GameShell game={game} hero={<Hero />} sections={SECTIONS} sources={meta.sources}>
      <Section id="roadmap" index={1} title="Roadmap to 100%" count={roadmap.stages.length}>
        <Roadmap />
      </Section>
      <Section id="strategy" index={2} title="Strategy">
        <Strategy />
      </Section>
      <Section id="bosses" index={3} title="Bosses" count={bestiary.bosses.length}>
        <Bestiary />
      </Section>
      <Section id="index" index={4} title="Index">
        <IndexList />
      </Section>
    </GameShell>
  );
}

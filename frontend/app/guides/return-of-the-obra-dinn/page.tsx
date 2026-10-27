import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";
import { AnswerAccordion } from "@/games/return-of-the-obra-dinn/components/answer-accordion";
import { AnswerKey } from "@/games/return-of-the-obra-dinn/components/answer-key";
import { Chapters } from "@/games/return-of-the-obra-dinn/components/chapters";
import { Crew } from "@/games/return-of-the-obra-dinn/components/crew";
import { Discrepancies } from "@/games/return-of-the-obra-dinn/components/discrepancies";
import { Guide } from "@/games/return-of-the-obra-dinn/components/guide";
import { GuideSearch } from "@/games/return-of-the-obra-dinn/components/guide-search";
import { Hero } from "@/games/return-of-the-obra-dinn/components/hero";
import { Trophies } from "@/games/return-of-the-obra-dinn/components/trophies";
import { game } from "@/games/return-of-the-obra-dinn/game";
import { chapters, crew, meta, trophies } from "@/games/return-of-the-obra-dinn/lib/data";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "guide", label: "Guide" },
  {
    id: "chapters",
    label: "Chapters",
    children: chapters.chapters.map((c) => ({ id: `chapter-${c.n}`, label: `${c.roman}. ${c.title}` })),
  },
  { id: "crew", label: "Crew" },
  { id: "answers", label: "Answer key" },
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
      disclaimer="Fan-made, unofficial. Return of the Obra Dinn is © Lucas Pope / 3909 LLC. Compiled from the community guides listed in Sources; tell us and we will remove anything on request."
    >
      <Section id="guide" index={1} title="Guide">
        <Guide />
      </Section>
      <Section id="chapters" index={2} title="Chapters" count={chapters.chapters.length}>
        <Chapters />
      </Section>
      <Section id="crew" index={3} title="Crew" count={crew.length}>
        <Crew />
      </Section>
      <Section id="answers" index={4} title="Answer key" count={crew.length}>
        <div className="space-y-10">
          <AnswerAccordion>
            <AnswerKey />
          </AnswerAccordion>
          <Discrepancies />
        </div>
      </Section>
      <Section id="trophies" index={5} title="Trophies" count={trophies.trophies.length}>
        <Trophies />
      </Section>
    </GameShell>
  );
}

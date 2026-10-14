import { Court } from "@/games/blood-of-dawnwalker/components/court";
import { Hero } from "@/games/blood-of-dawnwalker/components/hero";
import { Endings } from "@/games/blood-of-dawnwalker/components/endings";
import { Overview } from "@/games/blood-of-dawnwalker/components/overview";
import { Route } from "@/games/blood-of-dawnwalker/components/route";
import { Skills } from "@/games/blood-of-dawnwalker/components/skills";
import { Tips } from "@/games/blood-of-dawnwalker/components/tips";
import { Trophies } from "@/games/blood-of-dawnwalker/components/trophies";
import { game } from "@/games/blood-of-dawnwalker/game";
import { court, endings, meta, route, skills, tips, trophies } from "@/games/blood-of-dawnwalker/lib/data";
import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "trophies", label: "Trophies" },
  { id: "route", label: "Route" },
  { id: "endings", label: "Endings" },
  { id: "court", label: "Court & Edict" },
  { id: "skills", label: "Skills" },
  { id: "tips", label: "Tips" },
];

export default function Page() {
  return (
    <GameShell
      game={game}
      hero={<Hero />}
      sections={SECTIONS}
      sources={meta.sources}
      updated={meta.updated}
      issuesUrl="https://github.com/d116626/games/issues/new"
      disclaimer="Fan-made, unofficial. The Blood of Dawnwalker is © Rebel Wolves. Compiled from community guides and wikis listed in Sources; tell us and we will remove anything on request."
    >
      <Section id="overview" index={1} title="Overview">
        <Overview facts={tips.facts} />
      </Section>
      <Section id="trophies" index={2} title="Trophies (PS5)" count={trophies.trophies.length}>
        <Trophies data={trophies} />
      </Section>
      <Section id="route" index={3} title="Route and time budget" count={route.parts.length}>
        <Route data={route} />
      </Section>
      <Section id="endings" index={4} title="Endings" count={endings.endings.length}>
        <Endings data={endings} />
      </Section>
      <Section id="court" index={5} title="Court and Edict" count={court.members.length}>
        <Court data={court} />
      </Section>
      <Section id="skills" index={6} title="Skills" count={skills.abilities.length + skills.perks.length}>
        <Skills data={skills} />
      </Section>
      <Section id="tips" index={7} title="Tips">
        <Tips data={tips} />
      </Section>
    </GameShell>
  );
}

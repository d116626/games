import { GameShell } from "@/components/game/game-shell";
import { Section } from "@/components/game/section";
import { GuideSearch } from "@/games/grand-theft-auto-vi/components/guide-search";
import { Hero } from "@/games/grand-theft-auto-vi/components/hero";
import { Trophies } from "@/games/grand-theft-auto-vi/components/trophies";
import { game } from "@/games/grand-theft-auto-vi/game";
import { meta, trophies } from "@/games/grand-theft-auto-vi/lib/data";

export const metadata = { title: `${game.name} Guide · Games Guide`, description: game.description };

// Cada seção nova (missões, mapa, colecionáveis...) entra aqui, no <Section> abaixo e em lib/search.ts.
// O índice lateral só aparece com mais de uma seção.
const SECTIONS = [{ id: "trophies", label: "Trophies" }];

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
      sections={SECTIONS.length > 1 ? SECTIONS : undefined}
      sources={meta.sources}
      updated={meta.updated}
      issuesUrl="https://github.com/d116626/games/issues/new"
      disclaimer="Fan-made, unofficial. Grand Theft Auto VI is © Rockstar Games / Take-Two Interactive. Compiled from the sources listed above; tell us and we will remove anything on request."
    >
      <Section id="trophies" index={1} title="Trophies" count={trophies.trophies.length}>
        <Trophies />
      </Section>
    </GameShell>
  );
}

import { Biomes, HouseBosses } from "@/games/mewgenics/components/biomes";
import { Thumb } from "@/games/mewgenics/components/chip";
import { Events } from "@/games/mewgenics/components/events";
import { IndexGroup } from "@/games/mewgenics/components/index-group";
import { TrophyLink } from "@/games/mewgenics/components/trophy-link";
import { biomes, events, start, trophyIcon } from "@/games/mewgenics/lib/data";

/** Mundo: chefes por bioma, chefes da casa, vizinhos e eventos. */
export function World() {
  const npcs = [...start.npcs].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-muted-foreground">The places and people: bosses by biome, the bosses that attack your house, your neighbours and random events.</p>

      <IndexGroup id="world-biomes" title="Biomes and bosses" count={biomes.biomes.length}>
        <Biomes />
      </IndexGroup>

      <IndexGroup id="world-house" title="House defence bosses" count={biomes.houseBosses.length}>
        <HouseBosses />
      </IndexGroup>

      <IndexGroup id="world-neighbours" title="Neighbours" count={npcs.length}>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {npcs.map((n, i) => (
            <li key={n.id} id={`npc-${n.id}`} className="flex scroll-mt-24 gap-4 py-3">
              <Thumb src={trophyIcon(n.trophy)} />
              <div className="min-w-0 flex-1">
              <h4 className="flex flex-wrap items-baseline gap-x-3 text-xl font-extrabold">
                <span className="font-display text-lg text-(--coral)">{i + 1}</span>
                {n.name}
                <span className="text-base font-semibold text-muted-foreground">{n.role}</span>
                <TrophyLink name={n.trophy} />
              </h4>
              <p className="mt-1">
                <span className="label mr-2">Takes</span>
                {n.takes}
              </p>
              <p>
                <span className="label mr-2">Gives</span>
                {n.gives.join("; ")}
              </p>
              <p className="text-[0.95rem] text-muted-foreground">{n.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </IndexGroup>

      <IndexGroup
        id="world-events"
        title="Events"
        count={events.groups.reduce((n, g) => n + g.events.length, 0)}
      >
        <Events />
      </IndexGroup>
    </div>
  );
}

import { Combat as CombatTopics } from "@/games/mewgenics/components/combat";
import { Debuffs } from "@/games/mewgenics/components/debuffs";
import { Hidden } from "@/games/mewgenics/components/hidden";
import { IndexGroup } from "@/games/mewgenics/components/index-group";
import { Levels } from "@/games/mewgenics/components/levels";
import { combat, debuffs, hidden } from "@/games/mewgenics/lib/data";

/** Combate: básico, níveis, debuffs e interações escondidas. */
export function CombatSection() {
  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-muted-foreground">How fights work, what levelling gives you, status effects and the tricks players found.</p>

      <IndexGroup id="combat-basics" title="Combat basics" count={combat.topics.length}>
        <CombatTopics />
      </IndexGroup>

      <IndexGroup id="combat-levels" title="Leveling" count={combat.levels.rewards.length}>
        <Levels />
      </IndexGroup>

      <IndexGroup id="combat-debuffs" title="Debuffs and status effects" count={debuffs.debuffs.length}>
        <Debuffs />
      </IndexGroup>

      <IndexGroup id="combat-hidden" title="Hidden interactions" count={hidden.groups.reduce((n, g) => n + g.tips.length, 0)}>
        <Hidden />
      </IndexGroup>
    </div>
  );
}

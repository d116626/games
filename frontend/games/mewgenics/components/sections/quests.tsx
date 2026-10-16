import { Advanced } from "@/games/mewgenics/components/advanced";
import { IndexGroup } from "@/games/mewgenics/components/index-group";
import { MainQuests, SideQuests } from "@/games/mewgenics/components/quests";
import { advanced, quests } from "@/games/mewgenics/lib/data";

/** Quests: itens de quest, side quests do Dr. Beanies e técnicas avançadas. */
export function QuestsSection() {
  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-muted-foreground">Quest items, Dr. Beanies&apos; side quests and the advanced techniques built around items and cats, like cloning and duplication.</p>

      <IndexGroup id="quests-items" title="Quest items" count={quests.mainItems.length}>
        <MainQuests />
      </IndexGroup>

      <IndexGroup id="quests-side" title="Side quests (Dr. Beanies)" count={quests.sideItems.length}>
        <SideQuests />
      </IndexGroup>

      <IndexGroup id="quests-advanced" title="Advanced techniques" count={advanced.techniques.length}>
        <Advanced />
      </IndexGroup>
    </div>
  );
}

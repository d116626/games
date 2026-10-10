import { Bosses, EnemyDice } from "@/games/dice-a-million/components/bestiary";
import { CatalogGroup } from "@/games/dice-a-million/components/catalog-group";
import { IndexGroup } from "@/games/dice-a-million/components/index-group";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import { Challenges, Odds, Powers, RunRules } from "@/games/dice-a-million/components/rules";
import { bestiary, catalog, rules, traits } from "@/games/dice-a-million/lib/data";
import type { CatalogItem } from "@/games/dice-a-million/types";

const GROUPS: { kind: CatalogItem["kind"]; title: string }[] = [
  { kind: "dice", title: "Dice" },
  { kind: "rings", title: "Rings" },
  { kind: "cards", title: "Cards" },
];

/** Índice de consulta no fim da página: cada bloco abre sozinho. Itens, encantamentos, maldições, chefes, desafios, Powers e regras da run. */
export function IndexList() {
  return (
    <div className="space-y-4">
      {GROUPS.map(({ kind, title }) => {
        const items = catalog.filter((i) => i.kind === kind);
        return (
          <IndexGroup key={kind} id={`index-${kind}`} title={title} count={items.length}>
            <CatalogGroup items={items} traits={traits} />
          </IndexGroup>
        );
      })}
      <IndexGroup id="index-enchantments" title="Enchantments" count={bestiary.enchantments.length}>
        <ul className="grid gap-4 md:grid-cols-2">
          {bestiary.enchantments.map((e) => (
            <li key={e.name}>
              <ItemRow name={e.name} tag={e.appliesTo} text={e.effect} />
            </li>
          ))}
        </ul>
      </IndexGroup>
      <IndexGroup id="index-curses" title="Curses" count={bestiary.curses.length}>
        <p className="text-sm text-muted-foreground">
          From Power III, in the Ultrahard challenge or with the Witch&apos;s Ring, every new die has a 6% chance of being cursed (dice that already got an enchantment are skipped). A
          die holds one curse at a time, and a second one replaces the first. Magic Sponge removes them.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {bestiary.curses.map((c) => (
            <li key={c.name}>
              <ItemRow name={c.name} tag="curse" text={c.effect} />
            </li>
          ))}
        </ul>
      </IndexGroup>
      <IndexGroup id="index-bosses" title="Bosses" count={bestiary.bosses.length + 1}>
        <Bosses />
        <h4 className="border-t-2 border-(--ink)/15 pt-4 text-sm font-bold">Enemy dice rolled against you</h4>
        <EnemyDice />
      </IndexGroup>
      <IndexGroup id="index-challenges" title="Challenges" count={rules.challenges.length}>
        <Challenges />
      </IndexGroup>
      <IndexGroup id="index-powers" title="Powers" count={rules.powers.length}>
        <Powers />
      </IndexGroup>
      <IndexGroup id="index-odds" title="Odds" count={rules.odds.length}>
        <Odds />
      </IndexGroup>
      <IndexGroup id="index-run" title="Run rules">
        <RunRules />
      </IndexGroup>
    </div>
  );
}

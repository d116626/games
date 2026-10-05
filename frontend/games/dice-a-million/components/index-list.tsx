import { ItemRow } from "@/games/dice-a-million/components/item-row";
import { bestiary, catalog } from "@/games/dice-a-million/lib/data";
import type { CatalogItem } from "@/games/dice-a-million/types";

const GROUPS: { kind: CatalogItem["kind"]; title: string }[] = [
  { kind: "dice", title: "Dice" },
  { kind: "rings", title: "Rings" },
  { kind: "cards", title: "Cards" },
];

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <details className="sticker group">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-2">
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        <span className="hud-tab rounded px-1.5 py-0.5 text-[10px]">{count}</span>
        <span className="ml-auto font-mono text-xs group-open:hidden">Show</span>
        <span className="ml-auto hidden font-mono text-xs group-open:inline">Hide</span>
      </summary>
      <div className="border-t-2 border-(--ink) p-4">{children}</div>
    </details>
  );
}

/** Índice de consulta no fim da página: dados, anéis, cartas e encantamentos, com efeito e como desbloquear. */
export function IndexList() {
  return (
    <div className="space-y-4">
      {GROUPS.map(({ kind, title }) => {
        const items = catalog.filter((i) => i.kind === kind);
        return (
          <Group key={kind} title={title} count={items.length}>
            <ul className="grid gap-4 md:grid-cols-2">
              {items.map((i) => (
                <li key={i.id}>
                  <ItemRow icon={i.icon} name={i.name} faces={i.faces} condition={i.condition} text={i.effect} />
                </li>
              ))}
            </ul>
          </Group>
        );
      })}
      <Group title="Curses" count={bestiary.curses.length}>
        <p className="mb-3 text-sm text-muted-foreground">
          From Power III, in the Ultrahard challenge or with the Witch&apos;s Ring, every die has a 6% chance of being cursed. A
          die holds one curse at a time, and a second one replaces the first. Magic Sponge removes them.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {bestiary.curses.map((c) => (
            <li key={c.name}>
              <ItemRow name={c.name} tag="curse" text={c.effect} />
            </li>
          ))}
        </ul>
      </Group>
      <Group title="Enchantments" count={bestiary.enchantments.length}>
        <ul className="grid gap-4 md:grid-cols-2">
          {bestiary.enchantments.map((e) => (
            <li key={e.name}>
              <ItemRow name={e.name} tag={e.appliesTo} text={e.effect} />
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}

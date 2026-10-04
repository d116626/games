import { AchievementIcon } from "@/games/dice-a-million/components/achievement-icon";
import { achievements, bestiary } from "@/games/dice-a-million/lib/data";
import type { Category } from "@/games/dice-a-million/types";

const GROUPS: { category: Category; title: string }[] = [
  { category: "dice", title: "Dice" },
  { category: "rings", title: "Rings" },
  { category: "cards", title: "Cards" },
  { category: "secrets", title: "Secrets" },
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

/** Índice de consulta no fim da página: dados, anéis, cartas, segredos e encantamentos. */
export function IndexList() {
  return (
    <div className="space-y-4">
      {GROUPS.map(({ category, title }) => {
        const items = achievements.filter((a) => a.category === category);
        return (
          <Group key={category} title={title} count={items.length}>
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <AchievementIcon src={a.icon} name={a.name} className="size-12" />
                  <div className="min-w-0">
                    <h4 className="font-bold leading-tight">{a.name}</h4>
                    <p className="text-xs text-muted-foreground">{a.how ?? "No known requirement."}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Group>
        );
      })}
      <Group title="Enchantments" count={bestiary.enchantments.length}>
        <ul className="grid gap-3 md:grid-cols-2">
          {bestiary.enchantments.map((e) => (
            <li key={e.name}>
              <h4 className="font-bold leading-tight">
                {e.name} <span className="font-mono text-[10px] uppercase text-muted-foreground">{e.appliesTo}</span>
              </h4>
              <p className="text-xs text-muted-foreground">{e.effect}</p>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}

import { Bullets } from "@/games/mewgenics/components/bullets";
import { combat } from "@/games/mewgenics/lib/data";

/** Níveis: de onde vêm, quantos cabem numa aventura e o que cada nível dá. */
export function Levels() {
  const { sources, budget, total, scenarios, rewards, mnemonic, tips } = combat.levels;
  return (
    <div className="space-y-5">
      <p className="max-w-3xl">{sources}</p>
      <div>
        <p className="label mb-1">Level budget of a 4-cat adventure</p>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {budget.map((b) => (
            <li key={b.what} className="flex items-baseline justify-between gap-4 py-2">
              <span>{b.what}</span>
              <span className="font-display text-xl">{b.levels}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 max-w-3xl font-bold">{total}</p>
      </div>
      <Bullets title="Fewer cats, higher levels" items={scenarios} />
      <div>
        <p className="label mb-1">What each level gives</p>
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {rewards.map((r) => (
            <li
              key={r.level}
              id={`level-${r.level.replace(/\s|→/g, "")}`}
              className="grid scroll-mt-24 gap-x-4 py-2 sm:grid-cols-[6rem_1fr]"
            >
              <span className="font-display text-xl">{r.level}</span>
              <p>
                <span className="font-extrabold">{r.title}.</span> {r.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <Bullets title="Easy way to remember" items={mnemonic} />
      <Bullets title="Tips" items={tips} />
    </div>
  );
}

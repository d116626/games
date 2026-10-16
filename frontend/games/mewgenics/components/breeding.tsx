import { Big, Tag } from "@/games/mewgenics/components/chip";
import { Disagreements } from "@/games/mewgenics/components/disagreements";
import { breeding as b } from "@/games/mewgenics/lib/data";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl list-disc space-y-1.5 pl-5 marker:text-(--coral)">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-2xl">{title}</h3>
      {children}
    </div>
  );
}

/** Casa, herança, quartos, regras e fases da criação. */
export function Breeding() {
  return (
    <div className="space-y-14">
      <Sub title="House stats">
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {b.houseStats.map((s) => (
            <li key={s.id} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[9rem_1fr_1fr]">
              <h4 className="font-display text-xl text-(--coral)">{s.name}</h4>
              <p>{s.effect}</p>
              <p>
                <span className="label mr-2">Aim</span>
                {s.target}
              </p>
            </li>
          ))}
        </ul>
      </Sub>

      <Sub title="What a kitten inherits">
        <Bullets items={b.inherits} />
        <ul className="divide-y divide-border border-y-2 border-foreground">
          {b.odds.map((o) => (
            <li key={o.what} className="grid items-baseline gap-x-6 gap-y-1 py-3 sm:grid-cols-[1fr_5rem_1fr]">
              <p className="font-bold">{o.what}</p>
              <Big>{o.base}</Big>
              <p>
                <span className="label mr-2">Boost</span>
                {o.boost}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Odds from Greenside&apos;s guide; the big number is at 0 stimulation.</p>
      </Sub>

      <Sub title="Room plans">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {b.plans.map((p) => (
            <article key={p.id} className="border-t-4 border-foreground pt-3">
              <h4 className="text-xl font-extrabold">{p.title}</h4>
              <p className="label mt-0.5">{p.source}</p>
              <p className="mt-2">{p.summary}</p>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {p.rooms.map((r) => (
                  <li key={r.name} className="py-2">
                    <p className="flex flex-wrap items-center gap-2 font-extrabold">
                      {r.name}
                      <Tag tone="paper">{r.stats}</Tag>
                    </p>
                    <p>{r.use}</p>
                  </li>
                ))}
              </ul>
              {p.notes.length > 0 && (
                <div className="mt-3">
                  <Bullets items={p.notes} />
                </div>
              )}
            </article>
          ))}
        </div>
      </Sub>

      <Sub title="Breeding-room rules">
        <Bullets items={b.roomRules} />
      </Sub>

      <Sub title="What to aim for, by phase">
        <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {b.phases.map((p, i) => (
            <li key={p.name} className="border-t-4 border-(--coral) pt-2">
              <p className="font-display text-xl">
                <span className="mr-2 text-(--coral)">{i + 1}</span>
                {p.name}
              </p>
              <p className="mt-1">{p.aim}</p>
            </li>
          ))}
        </ol>
      </Sub>

      <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
        <Sub title="Inbreeding">
          <Bullets items={b.inbreeding} />
        </Sub>
        <Sub title="Furniture">
          <Bullets items={b.furniture} />
        </Sub>
      </div>

      <p>
        Orientation and who can have kittens with whom: see the{" "}
        <a href="#cats-orientation" className="font-bold underline underline-offset-4">
          orientation table
        </a>{" "}
        in the Index.
      </p>

      <Disagreements items={b.discrepancies} />
    </div>
  );
}

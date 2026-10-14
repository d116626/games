import type { CourtDataset, CourtMember } from "@/games/blood-of-dawnwalker/types";

/** Os três boiardos da Corte (colunas sem caixa) e o Edict como escada de Infâmia. */
export function Court({ data }: { data: CourtDataset }) {
  return (
    <div className="space-y-14">
      <p className="max-w-3xl text-lg text-muted-foreground">{data.intro}</p>
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
        {data.members.map((m) => (
          <Member key={m.id} m={m} />
        ))}
      </div>

      <div>
        <h3 className="font-display text-4xl leading-none">Edict of Infamy</h3>
        <ul className="mt-3 max-w-3xl list-disc space-y-1 pl-5 text-muted-foreground marker:text-(--game-accent)">
          {data.edictRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <ol className="mt-6 space-y-2">
          {data.edict.map((e) => (
            <li
              key={e.level}
              className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-0.5 border-l-4 py-2 pl-4 md:grid-cols-[2.75rem_16rem_1fr]"
              style={{ borderLeftColor: `rgb(214 51 75 / ${0.15 + e.level * 0.09})` }}
            >
              <span className="font-display text-3xl leading-none text-(--game-accent)">{e.numeral}</span>
              <p>
                <b>{e.name}</b> <span className="label ml-1">{e.grade}</span>
              </p>
              <p className="col-start-2 text-muted-foreground md:col-start-auto">{e.effect}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Member({ m }: { m: CourtMember }) {
  return (
    <article className="border-t-2 border-(--game-accent) pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-4xl leading-none">{m.name}</h3>
        <span className="label">Level {m.level}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{m.where}</p>

      <dl className="mt-5 space-y-4">
        <Field label="Activities">{m.activities.join(" · ")}</Field>
        <Field label="Quests">{m.quests.join(" · ")}</Field>
        <Field label="How to trigger the fight">{m.trigger}</Field>
        <Field label="The fight">{m.fight}</Field>
      </dl>
      <ul className="mt-5 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-(--game-accent)">
        {m.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

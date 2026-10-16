import { Tag } from "@/games/mewgenics/components/chip";
import { hidden } from "@/games/mewgenics/lib/data";

/** Interações escondidas: dicas de um post da comunidade, por tema. Só leva etiqueta o que o próprio post marca. */
export function Hidden() {
  return (
    <div className="space-y-5">
      <p className="panel max-w-3xl p-4">{hidden.intro}</p>
      {hidden.groups.map((g) => (
        <section key={g.id} className="space-y-2">
          <h4 className="text-xl font-extrabold">{g.title}</h4>
          <ul className="divide-y divide-border border-y-2 border-foreground">
            {g.tips.map((t) => (
              <li key={t.id} id={`hidden-${t.id}`} className="scroll-mt-24 py-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-extrabold">{t.title}</span>
                  {t.status && <Tag tone={t.status === "confirmed" ? "teal" : "pink"}>{t.status === "confirmed" ? "Confirmed" : "Disputed"}</Tag>}
                </div>
                <p className="max-w-3xl">{t.text}</p>
                {t.note && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{t.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

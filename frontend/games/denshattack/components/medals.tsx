import { Group } from "@/games/denshattack/components/group";
import { Tag } from "@/games/denshattack/components/ui";
import { levels } from "@/games/denshattack/lib/data";

/** Pontuação da medalha de platina por nível, e as dicas do guia do Steam. */
export function Medals() {
  return (
    <div className="space-y-4">
      <Group id="medals-tips" title="Tips" defaultOpen>
        <ul className="space-y-2">
          {levels.medalTips.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-(--signal)" />
              {t}
            </li>
          ))}
        </ul>
      </Group>
      {levels.chapters.map((c) => {
        const list = levels.levels.filter((l) => l.chapter === c.n && ["level", "race", "boss"].includes(l.kind));
        return (
          <Group key={c.n} id={`medals-${c.n}`} title={`${c.n}. ${c.title}`} count={list.length}>
            <table className="w-full text-left">
              <thead>
                <tr className="label border-b border-border">
                  <th className="py-2 pr-3 font-bold">Level</th>
                  <th className="py-2 pr-3 font-bold">Name</th>
                  <th className="py-2 text-right font-bold">Platinum score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((l) => (
                  <tr key={l.code}>
                    <td className="py-2 pr-3">
                      <Tag>{l.code}</Tag>
                    </td>
                    <td className="py-2 pr-3 font-semibold">{l.name}</td>
                    <td className="py-2 text-right font-bold tabular-nums">
                      {l.platinum ? l.platinum.toLocaleString("en-US") : <span className="text-muted-foreground">No medal</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Group>
        );
      })}
    </div>
  );
}

import { Group } from "@/games/denshattack/components/group";
import { Tag } from "@/games/denshattack/components/ui";
import { levels } from "@/games/denshattack/lib/data";
import type { LevelKind } from "@/games/denshattack/types";

const GROUPS: { id: string; kind: LevelKind; title: string }[] = [
  { id: "shops-castles", kind: "castle", title: "Castle shops" },
  { id: "shops-fanzines", kind: "fanzine", title: "Fanzine H.Q." },
  { id: "shops-onsens", kind: "onsen", title: "Onsens" },
];

/** Níveis que não se joga: lojas (adesivos e trens), fanzines (zines) e onsens (só diálogo). */
export function Shops() {
  return (
    <div className="space-y-4">
      {GROUPS.map((g) => {
        const list = levels.levels.filter((l) => l.kind === g.kind);
        return (
          <Group key={g.id} id={g.id} title={g.title} count={list.length} defaultOpen={g.kind === "castle"}>
            <ul className="grid gap-3 md:grid-cols-2">
              {list.map((l) => (
                <li key={l.code} className="border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Tag>{l.code}</Tag>
                    <h4 className="font-display text-xl leading-none">{l.name}</h4>
                  </div>
                  {l.note && <p className="mt-2 text-sm">{l.note}</p>}
                </li>
              ))}
            </ul>
          </Group>
        );
      })}
    </div>
  );
}

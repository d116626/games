import { Tag } from "@/games/grand-theft-auto-vi/components/ui";
import { chapterLabel, missions, story } from "@/games/grand-theft-auto-vi/lib/data";

/** Cada capítulo em poucas linhas: o que acontece, o objetivo e o que abre. Os detalhes ficam na lista de missões. */
export function Overview() {
  return (
    <ol className="border-b border-border">
      {story.chapters.map((ch) => {
        const mains = missions.filter((m) => m.chapter === ch.n && m.kind === "main");
        const first = mains[0]?.n;
        const last = mains.at(-1)?.n;
        return (
          <li key={ch.n} className="grid gap-x-8 gap-y-3 border-t border-border py-6 md:grid-cols-[13rem_1fr]">
            <div>
              <h4 className="font-display text-2xl leading-none">{chapterLabel(ch.n)}</h4>
              <p className="label mt-2">
                {mains.length} {mains.length === 1 ? "mission" : "missions"} · {first === last ? `#${first}` : `#${first}–${last}`}
              </p>
              <a href={`#chapter-${ch.n}`} className="mt-2 inline-block text-sm font-semibold underline underline-offset-4 hover:text-(--pink)">
                See the missions
              </a>
            </div>
            <div className="min-w-0 space-y-3">
              <p>{ch.summary}</p>
              <p>
                <span className="label mr-2">Goal</span>
                {ch.goal}
              </p>
              {ch.unlocks && ch.unlocks.length > 0 && (
                <p className="flex flex-wrap items-center gap-2">
                  <span className="label mr-1">Unlocks</span>
                  {ch.unlocks.map((u) => (
                    <Tag key={u} tone="dim">
                      {u}
                    </Tag>
                  ))}
                </p>
              )}
              {ch.side && ch.side.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span className="label mr-2">Side stories</span>
                  {ch.side.join(" · ")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

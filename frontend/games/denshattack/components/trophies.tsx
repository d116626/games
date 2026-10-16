import { GameImage } from "@/components/game/game-image";
import { Tag } from "@/games/denshattack/components/ui";
import { trophies } from "@/games/denshattack/lib/data";
import type { Trophy } from "@/games/denshattack/types";

/** Onde olhar no guia para cada grupo de troféus. */
const SEE: Record<string, { href: string; label: string }[]> = {
  medals: [{ href: "#medals", label: "Medals" }],
  collect: [
    { href: "#levels", label: "Levels" },
    { href: "#shops", label: "Shops" },
  ],
  tricks: [{ href: "#medals-tips", label: "Medal tips" }],
  dares: [{ href: "#levels", label: "Levels" }],
};

const RARE = new Set(["Ultra Rare", "Very Rare"]);

function Row({ t }: { t: Trophy }) {
  return (
    <li id={`trophy-${t.id}`} className="grid scroll-mt-24 grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[3.5rem_1fr_auto]">
      <GameImage src={t.icon} alt="" width={56} height={56} className="size-14 border border-border bg-card" />
      <div>
        <h4 className="font-display text-xl leading-none">
          <a href={t.url} target="_blank" rel="noreferrer" className="hover:text-(--signal)">
            {t.name}
          </a>
        </h4>
        <p className="mt-1">
          {t.description}
          {t.goal && <span className="text-muted-foreground"> · goal {t.goal}</span>}
        </p>
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
        <Tag tone={t.grade === "platinum" ? "cyan" : t.grade === "gold" ? "signal" : t.grade === "silver" ? "silver" : "bronze"}>{t.grade}</Tag>
        <Tag tone={RARE.has(t.psnTier) ? "pink" : "dim"}>
          {t.psnRate}% {t.psnTier}
        </Tag>
      </div>
    </li>
  );
}

/** Lista de troféus da PS5, com a raridade oficial da PSN. */
export function Trophies() {
  return (
    <div className="space-y-8">
      <p className="flex flex-wrap items-center gap-2">
        <Tag tone="cyan">{trophies.counts.platinum} platinum</Tag>
        <Tag>{trophies.counts.gold} gold</Tag>
        <Tag tone="silver">{trophies.counts.silver} silver</Tag>
        <Tag tone="bronze">{trophies.counts.bronze} bronze</Tag>
        <span className="text-sm text-muted-foreground">{trophies.points} points · rarity is the official PSN rate</span>
      </p>
      {trophies.groups.map((g) => {
        const list = trophies.trophies.filter((t) => t.group === g.id);
        return (
          <div key={g.id}>
            <div className="flex flex-wrap items-baseline gap-x-4">
              <h3 className="font-display text-2xl">{g.title}</h3>
              {SEE[g.id]?.map((l) => (
                <a key={l.href} href={l.href} className="text-sm font-semibold underline underline-offset-4">
                  See {l.label}
                </a>
              ))}
            </div>
            <ul className="mt-2 divide-y divide-border border-y border-border">
              {list.map((t) => (
                <Row key={t.id} t={t} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

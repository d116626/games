import { GameImage } from "@/components/game/game-image";
import { Tag } from "@/games/return-of-the-obra-dinn/components/ui";
import { trophies } from "@/games/return-of-the-obra-dinn/lib/data";
import type { Trophy } from "@/games/return-of-the-obra-dinn/types";

const RARE = new Set(["Ultra Rare", "Very Rare", "Rare"]);

function Row({ t }: { t: Trophy }) {
  return (
    <li id={`trophy-${t.id}`} className="scroll-mt-24 grid grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[3.5rem_1fr_auto]">
      <GameImage src={t.icon} alt="" width={56} height={56} className="size-14 border-2 border-border bg-card" />
      <div>
        <h4 className="font-display text-xl leading-none">
          <a href={t.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            {t.name}
          </a>
        </h4>
        <p className="mt-1">{t.description}</p>
        {t.note && <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>}
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
        <Tag>{t.grade}</Tag>
        {t.missable && <Tag tone="warn">missable</Tag>}
        <Tag tone={RARE.has(t.psnTier) ? "outline" : "dim"}>
          {t.psnRate}% {t.psnTier}
        </Tag>
      </div>
    </li>
  );
}

/** Lista de troféus da PS5, com a raridade oficial da PSN. */
export function Trophies() {
  return (
    <div className="space-y-4">
      <p className="flex flex-wrap items-center gap-2">
        <Tag>{trophies.counts.platinum} platinum</Tag>
        <Tag>{trophies.counts.gold} gold</Tag>
        <Tag>{trophies.counts.silver} silver</Tag>
        <Tag>{trophies.counts.bronze} bronze</Tag>
        <span className="text-sm text-muted-foreground">{trophies.points} points · rarity is the official PSN rate</span>
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {trophies.trophies.map((t) => (
          <Row key={t.id} t={t} />
        ))}
      </ul>
    </div>
  );
}

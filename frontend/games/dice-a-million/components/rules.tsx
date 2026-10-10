import { Ban, Flag, Gem, Hand, KeyRound, Swords } from "lucide-react";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import { rules } from "@/games/dice-a-million/lib/data";

const fmt = (n: number) => n.toLocaleString("en-US");

function Line({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="mt-1 flex gap-1.5 text-xs">
      <span className="mt-0.5 shrink-0 [&>svg]:size-3.5">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm">
      {items.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
}

/** Os 10 desafios: regras, kit inicial, requisito e chefes que não aparecem. */
export function Challenges() {
  return (
    <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      {rules.challenges.map((c) => (
        <li key={c.name}>
          <ItemRow icon={c.icon} name={c.name} tag={c.hand} text={c.rules.join(" ")}>
            {c.kit && <Line icon={<Swords />}><b>Starts with:</b> {c.kit}</Line>}
            <Line icon={<Flag />}>Ends after Face {c.finalFace}.</Line>
            <Line icon={<KeyRound />}><b>Needs:</b> {c.requires.join(" and ")}</Line>
            {c.banned && <Line icon={<Ban />}>{c.banned}</Line>}
          </ItemRow>
        </li>
      ))}
    </ul>
  );
}

/** Powers I a VI: o que cada um muda e o dado que libera. */
export function Powers() {
  return (
    <>
      <p className="text-sm">Each Power keeps every rule of the ones below it. Beating the game on a Power or higher unlocks its gem die.</p>
      <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {rules.powers.map((p) => (
          <li key={p.level}>
            <ItemRow icon={p.gemIcon} name={`Power ${p.level}`} text={p.effect}>
              {p.alt && <Line icon={<Hand />}><b>Alternative:</b> {p.alt}</Line>}
              <Line icon={<Gem />}><b>Unlocks:</b> {p.gem} Die</Line>
            </ItemRow>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Alvo por rodada (normal e Power IV ou mais), packs de recompensa e paradas do mapa. */
export function RunRules() {
  const faces = [...new Set(rules.targets.map((t) => t.face))];
  return (
    <>
      <h4 className="text-sm font-bold">Round targets</h4>
      <Notes items={rules.targetNotes} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {faces.map((face) => (
          <li key={face} className="sticker-sm p-3">
            <h5 className="mb-1 flex items-center justify-between font-display text-xl leading-none">
              Face {face}
              <span className="text-[11px] font-bold normal-case tracking-normal">Power IV+</span>
            </h5>
            <ul className="text-sm">
              {rules.targets
                .filter((t) => t.face === face)
                .map((t) => (
                  <li key={t.round} className="flex items-baseline gap-2 border-t border-(--ink)/15 py-0.5 first:border-0">
                    <span className="w-16 shrink-0 text-xs text-muted-foreground">
                      {t.boss ? "Boss" : `Round ${t.round}`}
                    </span>
                    <span className="font-semibold tabular-nums">{fmt(t.target)}</span>
                    <span className="ml-auto tabular-nums">{fmt(t.hard)}</span>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Faces 4 and 5 list only the first round and the boss. Face 6 is the final boss round.
      </p>

      <h4 className="pt-2 text-sm font-bold">Reward packs</h4>
      <Notes items={rules.packNotes} />
      <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
        {rules.packs.map((p) => (
          <li key={p.name} className="flex items-baseline gap-3 text-sm">
            <span className="min-w-0 flex-1">
              <b>{p.name}</b>
              <span className="block text-xs text-muted-foreground">{p.effect}</span>
            </span>
            <span className="shrink-0 text-right text-xs tabular-nums">
              {p.early}% <span className="text-muted-foreground">/</span> {p.late}%
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">Chance per pack: Faces 1 to 3 / Faces 4 to 6.</p>

      <h4 className="pt-2 text-sm font-bold">Map stops</h4>
      <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
        {rules.mapStops.map((m) => (
          <li key={m.name} className="text-sm">
            <b>{m.name}</b>
            <span className="block text-xs text-muted-foreground">{m.effect}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

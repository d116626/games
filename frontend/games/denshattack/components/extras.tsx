import { GameImage } from "@/components/game/game-image";
import { Group } from "@/games/denshattack/components/group";
import { Tag } from "@/games/denshattack/components/ui";
import { extras, levels } from "@/games/denshattack/lib/data";

const ARROW: Record<string, string> = { U: "\u2191", D: "\u2193", L: "\u2190", R: "\u2192" };

/** Código de skin como setas, com as letras por baixo (para copiar e para leitor de tela). */
function Code({ code }: { code: string }) {
  return (
    <div>
      <div role="img" aria-label={code.split("").join(" ")} className="font-display text-2xl tracking-[0.15em] text-(--signal)">
        {[...code].map((c) => ARROW[c]).join("")}
      </div>
      <code className="text-xs text-muted-foreground">{code}</code>
    </div>
  );
}

const SONG_LEVELS = levels.levels.filter((l) => l.song);

/** Códigos de skin, trilha sonora e recompensas secretas. */
export function Extras() {
  return (
    <div className="space-y-4">
      <Group id="extras-skins" title="Skin codes" count={extras.skins.length} defaultOpen>
        <ul className="space-y-1">
          {extras.skinHow.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-(--signal)" />
              {t}
            </li>
          ))}
        </ul>
        <ul className="space-y-1 border-y border-border py-3">
          {extras.skinNotes.map((n) => (
            <li key={n.text}>
              <Tag tone="pink" className="mr-2">
                {n.topic}
              </Tag>
              {n.text}
            </li>
          ))}
        </ul>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {extras.skins.map((s) => (
            <li key={s.code} id={`skin-${s.code}`} className="scroll-mt-24 border border-border">
              {s.image && (
                <GameImage src={s.image} alt={`${s.name} skin`} width={400} height={250} className="aspect-[8/5] w-full object-cover" />
              )}
              <div className="space-y-2 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-xl leading-none">{s.name}</h4>
                  <Tag tone="dim">{s.includes}</Tag>
                </div>
                <Code code={s.code} />
                {s.url && (
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-semibold underline underline-offset-4">
                    Channel
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Group>

      <Group id="extras-music" title="Soundtrack" count={SONG_LEVELS.length}>
        <h4 className="label">Outside the levels</h4>
        <ul className="divide-y divide-border border-y border-border">
          {extras.tracks.map((t, i) => (
            <li key={t.where} id={`track-${i}`} className="grid scroll-mt-24 gap-x-4 py-2 sm:grid-cols-[14rem_1fr_1fr]">
              <span className="font-bold">{t.where}</span>
              <span>{t.song}</span>
              <span className="text-muted-foreground">{t.artist}</span>
            </li>
          ))}
        </ul>
        {levels.chapters.map((c) => (
          <div key={c.n}>
            <h4 className="label mt-4">
              {c.n}. {c.region}
            </h4>
            <ul className="divide-y divide-border border-y border-border">
              {SONG_LEVELS.filter((l) => l.chapter === c.n).map((l) => (
                <li key={l.code} id={`song-${l.code}`} className="grid scroll-mt-24 gap-x-4 py-2 sm:grid-cols-[4.5rem_1fr_1fr_1fr]">
                  <Tag className="w-fit">{l.code}</Tag>
                  <span className="font-semibold">{l.song}</span>
                  <span className="text-muted-foreground">{l.artist}</span>
                  <span className="text-muted-foreground">
                    {l.name}
                    {l.prefecture && ` \u00B7 ${l.prefecture}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Group>

      <Group id="extras-rewards" title="Secret rewards" count={extras.reward.length}>
        <ul className="space-y-2">
          {extras.reward.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-(--signal)" />
              {t}
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}

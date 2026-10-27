import { GameImage } from "@/components/game/game-image";
import { Tag } from "@/games/return-of-the-obra-dinn/components/ui";
import { chapters, crew, fateText } from "@/games/return-of-the-obra-dinn/lib/data";

const ROMAN = Object.fromEntries(chapters.chapters.map((ch) => [ch.n, ch.roman]));

/** Gabarito completo dos 60: retrato, nome, cargo, causa, assassino e como reconhecer. Entra na busca. */
export function AnswerKey() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        <strong className="text-foreground">Spoilers:</strong> every name, cause and killer. Use the Crew table above to
        solve on your own.
      </p>
      <table className="block w-full md:table md:table-fixed">
        <thead className="hidden md:table-header-group">
          <tr className="text-left">
            <th className="label w-12 px-3 pb-2 font-normal">#</th>
            <th className="label w-32 px-3 pb-2 font-normal">Portrait</th>
            <th className="label w-40 px-3 pb-2 font-normal">Name</th>
            <th className="label w-28 px-3 pb-2 font-normal">Quality</th>
            <th className="label w-24 px-3 pb-2 font-normal">Origin</th>
            <th className="label w-44 px-3 pb-2 font-normal">Fate</th>
            <th className="label px-3 pb-2 font-normal">How to tell</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {crew.map((c) => (
            <tr key={c.id} id={`answer-${c.id}`} className="block scroll-mt-24 border-t border-border py-3 md:table-row md:py-0">
              <td className="block px-1 py-1 md:table-cell md:px-3 md:py-2 md:align-top">
                <span className="font-display text-2xl leading-none text-foreground/70">{c.no}</span>
              </td>
              <td className="block px-1 py-2 md:table-cell md:px-3 md:align-top">
                <GameImage src={c.portrait} alt={`Portrait of ${c.name}`} className="pixel h-32 w-auto max-w-full border-2 border-foreground md:h-auto md:w-24" />
              </td>
              <td className="block px-1 py-2 md:table-cell md:px-3 md:align-top">
                <p className="font-display text-xl leading-tight">{c.name}</p>
                <Tag tone="dim" className="mt-2">
                  Chapter {ROMAN[c.chapter]}
                </Tag>
              </td>
              <td className="block px-1 py-1 md:table-cell md:px-3 md:py-2 md:align-top">
                <span className="label md:hidden">Quality </span>
                {c.role}
              </td>
              <td className="block px-1 py-1 md:table-cell md:px-3 md:py-2 md:align-top">
                <span className="label md:hidden">Origin </span>
                {c.origin}
              </td>
              <td className="block px-1 py-2 md:table-cell md:px-3 md:align-top">
                <p>{fateText(c.fate)}</p>
                {c.alsoListed && <p className="mt-1 text-sm text-muted-foreground">PSNProfiles lists: {c.alsoListed}</p>}
              </td>
              <td className="block px-1 py-2 text-sm md:table-cell md:px-3 md:align-top">{c.how}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

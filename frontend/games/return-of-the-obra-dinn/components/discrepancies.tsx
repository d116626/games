import { Tag } from "@/games/return-of-the-obra-dinn/components/ui";
import { chapters } from "@/games/return-of-the-obra-dinn/lib/data";

/** Onde as fontes divergem (grafia de nomes, título do capítulo VIII, fates aceitos). */
export function Discrepancies() {
  return (
    <div>
      <h3 className="font-display text-2xl">Where the sources disagree</h3>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {chapters.discrepancies.map((d) => (
          <li key={d.topic} className="py-3">
            <Tag tone="outline" className="mr-2">
              {d.topic}
            </Tag>
            {d.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

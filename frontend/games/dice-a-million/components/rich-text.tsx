import { ItemRef } from "@/games/dice-a-million/components/item-ref";
import { splitItems } from "@/games/dice-a-million/lib/items";

/** Texto em que os nomes de dados, anéis e cartas viram links para o cartão do item. */
export function RichText({ text }: { text: string }) {
  return splitItems(text).map((part, i) =>
    part.item ? (
      <ItemRef key={i} item={part.item} className="font-semibold underline decoration-dotted underline-offset-2">
        {part.text}
      </ItemRef>
    ) : (
      part.text
    ),
  );
}

import { GameImage } from "@/components/game/game-image";
import { guide } from "@/games/return-of-the-obra-dinn/lib/data";

/** O sketch do livro (três desenhos numa imagem): referência para achar os rostos da tabela abaixo. */
export function Sketch() {
  const { sketch } = guide;
  return (
    <figure className="max-w-md">
      <GameImage
        src={sketch.src}
        alt={sketch.alt}
        width={sketch.width}
        height={sketch.height}
        className="pixel h-auto w-full border-2 border-foreground"
      />
      <figcaption className="mt-2 text-sm text-muted-foreground">
        The book&apos;s sketches. Every face in them is one of the 60 souls. Image: {sketch.credit}.
      </figcaption>
    </figure>
  );
}

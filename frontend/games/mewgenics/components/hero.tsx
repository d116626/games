import { CatMark } from "@/games/mewgenics/components/cat-mark";

/** Cabeçalho: título grande e o gato-adesivo. */
export function Hero() {
  return (
    <div className="mt-4 grid items-center gap-8 pb-4 md:grid-cols-[1fr_17rem]">
      <div>
        <p className="label">Unofficial guide · PS5</p>
        <h1 className="mt-2 font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl">
          Mew<span className="text-(--coral)">genics</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg font-semibold">
          Breed the cats, choose the collars, clear the biomes.
        </p>
      </div>
      <CatMark className="sticker wobble mx-auto w-56 md:w-full" />
    </div>
  );
}

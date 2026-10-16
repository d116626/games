const BAND = "DENSHATTACK! \u96FB\u8ECA\u30A2\u30BF\u30C3\u30AF ";

/** Cabeçalho: título grande e o letreiro amarelo do jogo. */
export function Hero() {
  return (
    <div className="mt-4">
      <div className="pb-6">
        <p className="label">Unofficial guide · PS5</p>
        <h1 className="mt-2 font-display text-7xl leading-[0.9] sm:text-8xl md:text-9xl">
          Densha<span className="text-(--signal)">ttack!</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg font-semibold">
          Every spray can, gear and film roll, every dare and medal score, level by level.
        </p>
      </div>
      <div aria-hidden className="ticker -mx-6 text-2xl">
        <div>{BAND.repeat(16)}</div>
      </div>
    </div>
  );
}

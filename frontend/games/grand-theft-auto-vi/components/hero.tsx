/** Cabeçalho: título grande e a faixa do pôr do sol de Leonida. */
export function Hero() {
  return (
    <div className="mt-4">
      <div className="pb-6">
        <p className="label">Unofficial guide · PS5</p>
        <h1 className="mt-2 font-display text-[2.5rem] leading-[0.95] min-[420px]:text-5xl sm:text-7xl md:text-8xl">
          Grand Theft
          <br />
          Auto <span className="sunset-text">VI</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg">
          The story missions in order, tips to start and the trophy checklist. The map, side missions and collectibles will follow as Leonida gets mapped.
        </p>
      </div>
      <div aria-hidden className="sunset -mx-6 h-3" />
    </div>
  );
}

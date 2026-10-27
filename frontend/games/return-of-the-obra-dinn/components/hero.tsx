/** Cabeçalho: título grande e a faixa em xadrez do jogo. */
export function Hero() {
  return (
    <div className="mt-4">
      <div className="pb-6">
        <p className="label">Unofficial guide · PS5</p>
        <h1 className="mt-2 font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl">
          Return of the
          <br />
          Obra Dinn
        </h1>
        <p className="mt-4 max-w-xl text-lg">
          Sixty souls, one book. Hints chapter by chapter; every answer stays hidden until you ask for it.
        </p>
      </div>
      <div
        aria-hidden
        className="-mx-6 h-3 bg-[repeating-conic-gradient(var(--paper)_0_25%,var(--ink)_0_50%)] bg-size-[12px_12px]"
      />
    </div>
  );
}

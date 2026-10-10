/** Posições dos pontos (grade 3x3, 0 a 2) de cada formato de 1 a 6 lados, como nos ícones do jogo. */
const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};
const at = (n: number) => 5 + n * 3; // centro de cada célula no viewBox 16

/** Maior formato com ícone próprio; de 7 lados para cima o jogo usa a cruz. */
export const MAX_PIPS = 6;

/** Dado de uma face de valor 0 aparece com a bolinha oca. */
export const isHollow = (sides?: number, faces?: string) => sides === 1 && faces?.trim() === "0";

/** Ícone de formato do dado: 1 a 6 pontos; cruz com um ponto em cada diagonal acima de 6; bolinha oca = face de valor 0. */
export function DieShape({ sides, hollow = false, className }: { sides: number; hollow?: boolean; className?: string }) {
  const label = hollow ? "One side, value 0" : `D${sides}`;
  return (
    <svg viewBox="0 0 16 16" role="img" aria-label={label} className={className ?? "size-4"}>
      <title>{label}</title>
      <rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {hollow ? (
        <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      ) : sides <= MAX_PIPS ? (
        PIPS[sides]?.map(([x, y]) => <circle key={`${x}${y}`} cx={at(x)} cy={at(y)} r="1.3" fill="currentColor" />)
      ) : (
        <>
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1" />
          {[[5.2, 5.2], [10.8, 5.2], [5.2, 10.8], [10.8, 10.8]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />
          ))}
        </>
      )}
    </svg>
  );
}

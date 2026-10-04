import type { Game } from "@/games/types";
import { game as diceAMillion } from "@/games/dice-a-million/game";
// @games:imports

/** Jogos exibidos no hub. `just new-game <id> "<Nome>"` adiciona as linhas marcadas com @games. */
export const GAMES: Game[] = [
  diceAMillion,
  // @games:list
];

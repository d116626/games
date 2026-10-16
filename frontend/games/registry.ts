import type { Game } from "@/games/types";
import { game as diceAMillion } from "@/games/dice-a-million/game";
import { game as bloodOfDawnwalker } from "@/games/blood-of-dawnwalker/game";
import { game as mewgenics } from "@/games/mewgenics/game";
// @games:imports

/** Jogos exibidos no hub. `just new-game <id> "<Nome>"` adiciona as linhas marcadas com @games. */
export const GAMES: Game[] = [
  diceAMillion,
  bloodOfDawnwalker,
  mewgenics,
  // @games:list
];

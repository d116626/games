import type { Game } from "@/games/types";
import { game as diceAMillion } from "@/games/dice-a-million/game";
import { game as bloodOfDawnwalker } from "@/games/blood-of-dawnwalker/game";
import { game as mewgenics } from "@/games/mewgenics/game";
import { game as denshattack } from "@/games/denshattack/game";
// @games:imports

/** Jogos exibidos no hub. `just new-game <id> "<Nome>"` adiciona as linhas marcadas com @games. */
export const GAMES: Game[] = [
  diceAMillion,
  bloodOfDawnwalker,
  mewgenics,
  denshattack,
  // @games:list
];

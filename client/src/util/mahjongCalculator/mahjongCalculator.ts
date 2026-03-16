import { Wind } from "@/util/mahjongCalculator/tile.ts";
import { baseScore, multipliers } from "@/util/mahjongCalculator/score.ts";
import { PlayerResult } from "@/util/mahjongCalculator/hand.ts";

export function playerScore(
  roundWind: Wind,
  playerResult: PlayerResult,
): number {
  const tmp1 = baseScore(roundWind, playerResult);
  const tmp2 = multipliers(roundWind, playerResult);

  return tmp1 * tmp2;
}

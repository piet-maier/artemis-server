import {
  GameResult,
  PlayerResult,
  TileOrigin,
  Wind,
  playerScore,
  mahjongScore,
} from "@/util/mahjongCalculator";
import { expect, test } from "vitest";

function makeRandomPlayerResult(): PlayerResult {
  // TODO: randomize
  return new PlayerResult(Wind.East, TileOrigin.Wall, false, false, true);
}

test("sanityCheck", () => {
  const prevailingWind = Wind.East;
  const playerResult = makeRandomPlayerResult();

  expect(() => playerScore(prevailingWind, playerResult)).not.toThrow();
});

test("mahjongScoreSanityCheck", () => {
  const prevailingWind = Wind.East;
  const player1Result = makeRandomPlayerResult();
  const player2Result = makeRandomPlayerResult();
  const player3Result = makeRandomPlayerResult();
  const player4Result = makeRandomPlayerResult();
  const gameResult = new GameResult(prevailingWind, [
    player1Result,
    player2Result,
    player3Result,
    player4Result,
  ]);

  expect(mahjongScore(gameResult)).toStrictEqual([
    playerScore(prevailingWind, player1Result),
    playerScore(prevailingWind, player2Result),
    playerScore(prevailingWind, player3Result),
    playerScore(prevailingWind, player4Result),
  ]);
});

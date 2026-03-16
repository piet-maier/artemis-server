import {
  PlayerResult,
  TileOrigin,
  Wind,
  playerScore,
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

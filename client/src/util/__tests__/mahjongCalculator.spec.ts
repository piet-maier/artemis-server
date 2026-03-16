import { playerScore } from "@/util/mahjongCalculator/mahjongCalculator.ts";
import { Dragon, Suite, Wind } from "@/util/mahjongCalculator/tile.ts";
import { Chow, Kong, Pung, WinningEye } from "@/util/mahjongCalculator/meld.ts";
import {
  Hand,
  PlayerResult,
  TileOrigin,
  MahjongCallInfo,
} from "@/util/mahjongCalculator/hand.ts";

import { expect, test } from "vitest";

function makeRandomPlayerResult(): PlayerResult {
  // TODO: randomize
  const seatWind = Wind.East;
  const winConditions = new MahjongCallInfo(
    TileOrigin.OtherPlayer,
    false,
    false,
    false,
    false,
    false,
    false,
  );
  const hand = new Hand(
    [
      new Kong(Suite.Bamboo, true, true),
      new Chow(Suite.Bamboo, true, true),
      new Chow(Suite.Bamboo, true, true),
      new Pung(Dragon.Red, false, false),
    ],
    new WinningEye(Wind.East, false),
  );

  return new PlayerResult(seatWind, winConditions, hand);
}

test("sanityCheck", () => {
  const roundWind = Wind.East;
  const playerResult = makeRandomPlayerResult();

  expect(() => playerScore(roundWind, playerResult)).not.toThrow();
});

test("exampleHand1", () => {
  /*
    1-2-3 Bamboo
    1-2-3 Bamboo
    1-2-3 Bamboo
    Red Dragon Pung
    Pair 5 Bamboo
   */

  const roundWind = Wind.South;
  const seatWind = Wind.West;
  const winConditions = new MahjongCallInfo(
    TileOrigin.Wall,
    false,
    false,
    false,
    false,
    false,
    false,
  );
  const hand = new Hand(
    [
      new Chow(Suite.Bamboo, true, true),
      new Chow(Suite.Bamboo, true, true),
      new Chow(Suite.Bamboo, true, true),
      new Pung(Dragon.Red, false, false),
    ],
    new WinningEye(Suite.Bamboo, false),
  );

  const playerResult = new PlayerResult(seatWind, winConditions, hand);

  expect(playerScore(roundWind, playerResult)).toBe(104);
});

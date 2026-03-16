import { Wind } from "@/util/mahjongCalculator/tile.ts";
import { PlayerResult, TileOrigin } from "@/util/mahjongCalculator/hand.ts";
import {
  isAllTilesHidden,
  hiddenPungCount,
  isBigThreeDragons,
  isFourWinds,
  isSmallThreeDragons,
  isSmallWinds,
  meldScore,
  isNoChows,
  isNonScoringHand,
  pungOrKongOfDragonCount,
  pungOrKongOfWindCount,
  allTilesOfOneColor,
  allTilesHonourTiles,
  allTilesHonourOrTerminal,
  allTilesHonour,
} from "@/util/mahjongCalculator/patterns.ts";

export function baseScore(roundWind: Wind, playerResult: PlayerResult): number {
  const tileScore = playerResult.hand.melds.reduce(
    (score: number, meld): number => {
      return score + meldScore(meld, roundWind, playerResult.seatWind);
    },
    0,
  );

  let finishingScore = 0;
  if (playerResult.mahjongCall !== null) {
    finishingScore += 20;
    if (playerResult.mahjongCall.lastTileCompletesMinor) {
      finishingScore += 2;
    }
    if (playerResult.mahjongCall.lastTileOrigin == TileOrigin.Wall) {
      finishingScore += 2;
    }
    if (playerResult.mahjongCall.lastTileWasFinalTile) {
      finishingScore += 2;
    }
    if (playerResult.mahjongCall.lastTileCompletesPairOfTerminalOrHonor) {
      finishingScore += 4;
    }
  }

  return tileScore + finishingScore;
}

export function multipliers(
  roundWind: Wind,
  playerResult: PlayerResult,
): number {
  let doubleCount = 0;

  // TODO: bonus / season / flower tiles

  doubleCount += pungOrKongOfDragonCount(playerResult.hand.melds);
  doubleCount += pungOrKongOfWindCount(playerResult.hand.melds, roundWind);
  doubleCount += pungOrKongOfWindCount(
    playerResult.hand.melds,
    playerResult.seatWind,
  );
  doubleCount += hiddenPungCount(playerResult.hand.melds);
  if (isSmallThreeDragons(playerResult.hand)) {
    doubleCount += 1;
  }
  if (isBigThreeDragons(playerResult.hand.melds)) {
    doubleCount += 2;
  }
  if (isSmallWinds(playerResult.hand)) {
    doubleCount += 1;
  }
  if (isFourWinds(playerResult.hand)) {
    doubleCount += 2;
  }

  if (playerResult.mahjongCall !== null) {
    if (isNonScoringHand(playerResult.hand)) {
      doubleCount += 1;
    }
    if (isNoChows(playerResult.hand.melds)) {
      doubleCount += 1;
    }
    if (isAllTilesHidden(playerResult.hand)) {
      doubleCount += 1;
    }
    if (allTilesOfOneColor(playerResult.hand)) {
      doubleCount += 3;
    }
    if (
      allTilesOfOneColor(playerResult.hand) &&
      allTilesHonourTiles(playerResult.hand)
    ) {
      doubleCount += 1;
    }
    if (allTilesHonourOrTerminal(playerResult.hand)) {
      doubleCount += 1;
    }
    if (allTilesHonour(playerResult.hand)) {
      doubleCount += 2;
    }

    if (playerResult.mahjongCall.lastTileOrigin === TileOrigin.DeadWall) {
      doubleCount += 1;
    }

    if (playerResult.mahjongCall.lastTileWasFinalTile) {
      doubleCount += 1;
    }
    if (
      playerResult.mahjongCall.lastTileOrigin ==
      TileOrigin.OtherPlayerAndEmptyWall
    ) {
      doubleCount += 1;
    }
    if (playerResult.mahjongCall.robbedCong) {
      doubleCount += 1;
    }
    if (playerResult.mahjongCall.originalCall) {
      doubleCount += 1;
    }
  }

  return 2 ** doubleCount;
}

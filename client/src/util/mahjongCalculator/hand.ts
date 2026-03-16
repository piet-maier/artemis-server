import { Meld, WinningEye } from "@/util/mahjongCalculator/meld.ts";
import { Wind } from "@/util/mahjongCalculator/tile.ts";

export enum TileOrigin {
  Wall,
  DeadWall,
  OtherPlayer,
  OtherPlayerAndEmptyWall,
}

export class Hand {
  melds: Meld[];
  winningEye: WinningEye | null;

  constructor(melds: Meld[], winningEye: WinningEye | null) {
    if (melds.length > 4) {
      throw new Error("There can not be more than 4 melds");
    }
    this.melds = melds;
    this.winningEye = winningEye;
  }
}

export class MahjongCallInfo {
  lastTileOrigin: TileOrigin;
  lastTileWasFinalTile: boolean;
  lastTileCompletesMinor: boolean;
  lastTileCompletesPairOfMinor: boolean;
  lastTileCompletesPairOfTerminalOrHonor: boolean;
  robbedCong: boolean;
  originalCall: boolean;

  constructor(
    lastTileOrigin: TileOrigin,
    lastTileWasFinalTile: boolean,
    lastTileCompletesMinor: boolean,
    lastTileCompletesPairOfMinor: boolean,
    lastTileCompletesPairOfTerminalOrHonor: boolean,
    robbedCong: boolean,
    originalCall: boolean,
  ) {
    this.lastTileOrigin = lastTileOrigin;
    this.lastTileWasFinalTile = lastTileWasFinalTile;
    this.lastTileCompletesMinor = lastTileCompletesMinor;
    this.lastTileCompletesPairOfMinor = lastTileCompletesPairOfMinor;
    this.lastTileCompletesPairOfTerminalOrHonor =
      lastTileCompletesPairOfTerminalOrHonor;
    this.robbedCong = robbedCong;
    this.originalCall = originalCall;
  }
}

export class PlayerResult {
  seatWind: Wind;
  mahjongCall: MahjongCallInfo | null;
  hand: Hand;

  get calledOutMahjong(): boolean {
    return this.mahjongCall !== null;
  }

  constructor(seatWind: Wind, mahjongCall: MahjongCallInfo | null, hand: Hand) {
    this.seatWind = seatWind;
    this.mahjongCall = mahjongCall;
    this.hand = hand;
  }
}

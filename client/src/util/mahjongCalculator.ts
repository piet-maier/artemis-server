export enum Suite {
  Dots,
  Bamboo,
  Character,
}

export enum Wind {
  East,
  South,
  West,
  North,
}

export enum Dragon {
  Red,
  Green,
  Blue,
}

export enum TileOrigin {
  Wall,
  DeadWall,
  OtherPlayer,
}

abstract class Meld {
  suite: Suite;
  isConcealed: boolean;
}

/// Three identical tiles
export class Pung extends Meld {}

/// Four identical tiles
export class Kong extends Meld {}

/// Sequence of three tiles
export class Chow extends Meld {}

/// The final pair required to win
export class WinningEye extends Meld {}

export class PlayerResult {
  playerWind: Wind;
  lastTileOrigin: TileOrigin;
  lastTileWasFinalTile: boolean;
  lastTileCompletesWinningEye: boolean;
  calledOutMahjong: boolean;

  constructor(
    playerWind: Wind,
    lastTileOrigin: TileOrigin,
    lastTileWasFinalTile: boolean,
    lastTileCompletesWinningEye: boolean,
    calledOutMahjong: boolean,
  ) {
    this.playerWind = playerWind;
    this.lastTileOrigin = lastTileOrigin;
    this.lastTileWasFinalTile = lastTileWasFinalTile;
    this.lastTileCompletesWinningEye = lastTileCompletesWinningEye;
    this.calledOutMahjong = calledOutMahjong;
  }
}

export class GameResult {
  prevailingWind: Wind;
  playerResults: [PlayerResult, PlayerResult, PlayerResult, PlayerResult];

  constructor(
    prevailingWind: Wind,
    playerResults: [PlayerResult, PlayerResult, PlayerResult, PlayerResult],
  ) {
    this.prevailingWind = prevailingWind;
    this.playerResults = playerResults;
  }
}

export function mahjongScore(
  gameResult: GameResult,
): [number, number, number, number] {
  return gameResult.playerResults.map((playerResult) =>
    playerScore(gameResult.prevailingWind, playerResult),
  ) as [number, number, number, number];
}

export function playerScore(
  prevailingWind: Wind,
  playerResult: PlayerResult,
): number {
  throw "TODO: playerScore";
  // return 0;
}

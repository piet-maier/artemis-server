import {
  Dragon,
  Suite,
  type TileType,
  type HonourTile,
  Wind,
} from "@/util/mahjongCalculator/tile.ts";

export abstract class Meld {
  isConcealed: boolean;

  protected constructor(isConcealed: boolean) {
    this.isConcealed = isConcealed;
  }
}

export class Pair extends Meld {
  tile: HonourTile;

  constructor(isConcealed: boolean, tile: HonourTile) {
    super(isConcealed);
    this.tile = tile;
  }
}

/// Three identical tiles
export class Pung extends Meld {
  tileType: TileType;
  isTerminal: boolean;

  constructor(
    tile: Suite | Wind | Dragon,
    isTerminal: boolean, // TODO: honour tiles cannot be terminal
    isConcealed: boolean,
  ) {
    super(isConcealed);
    this.isTerminal = isTerminal;
    this.tileType = tile;
  }
}

/// Four identical tiles
export class Kong extends Meld {
  tileType: TileType;
  isTerminal: boolean;

  constructor(
    tile: Suite | Wind | Dragon,
    isTerminal: boolean, // TODO: honour tiles cannot be terminal
    isConcealed: boolean,
  ) {
    super(isConcealed);
    this.tileType = tile;
    this.isTerminal = isTerminal;
  }
}

/// Sequence of three tiles
export class Chow extends Meld {
  suite: Suite;
  isTerminal: boolean;

  constructor(suite: Suite, isTerminal: boolean, isConcealed: boolean) {
    super(isConcealed);
    this.suite = suite;
    this.isTerminal = isTerminal;
  }
}

/// The final pair required to win
export class WinningEye {
  tileType: TileType;
  isTerminal: boolean;

  constructor(tileType: TileType, isTerminal: boolean) {
    this.tileType = tileType;
    this.isTerminal = isTerminal;
  }
}

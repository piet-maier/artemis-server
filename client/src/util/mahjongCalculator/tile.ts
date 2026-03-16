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

export type HonourTile = Wind | Dragon;
export type TileType = Suite | HonourTile;

export function isHonour(tile: TileType): boolean {
  return tile in Dragon || tile in Wind;
}

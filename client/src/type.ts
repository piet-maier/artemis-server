export interface Data {
  head: number[];
  body: Record<number, number>[];
  foot: Record<number, number>;
}

export interface Change {
  player: number;
  number: number;
  cell: string;
}

export interface Player {
  id: number;
  name: string;
  //emoji: string;
}

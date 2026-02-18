export interface Data {
  head: string[];
  body: Record<string, number>[];
  foot: Record<string, number>;
}

export interface Change {
  name: string;
  number: number;
  cell: string;
}

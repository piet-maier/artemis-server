import type { Data } from "@/type";

export function magic({ body, foot }: Data, ordering: string[]): number {
  const premiumFoot = ordering.filter((name) => foot[name] !== null);
  let highlightedColumn = -1;
  for (const item of body) {
    highlightedColumn++;
    while (
      item[premiumFoot[highlightedColumn]!] === null &&
      highlightedColumn < Object.keys(item).length
    )
      highlightedColumn++;
    if (highlightedColumn > Object.keys(item).length) highlightedColumn = 0;
  }

  return highlightedColumn;
}

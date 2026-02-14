import type { Data } from "@/type";

export function magic(
  { body, foot }: Data,
  ordering: string[],
  visibility: string[],
): number {
  const premiumFoot = ordering.filter((name) => foot[name] !== null);
  let highlightedColumn = 0;
  for (const item of body.slice(0, -1)) {
    console.log("Vor while: " + item[premiumFoot[highlightedColumn]!]);
    while (
      item[premiumFoot[highlightedColumn]!] === undefined &&
      highlightedColumn < premiumFoot.length
    ) {
      console.log(
        "Hier wurde gesooßt: " +
          highlightedColumn +
          " " +
          item[premiumFoot[highlightedColumn]! + " " + premiumFoot.length],
      );
      highlightedColumn++;
    }
    highlightedColumn++;
    console.log(
      "aktuelles Collum " +
        highlightedColumn +
        " OnlyFeet: " +
        premiumFoot.length +
        " visible: " +
        visibility.length,
    );
    if (highlightedColumn >= premiumFoot.length) highlightedColumn = 0;
  }
  if (body.length >= 2) {
    const missingPlayers = premiumFoot.filter(
      (name) => !(name in body[body.length - 2]!),
    );
    const returningPlayers = missingPlayers.filter((name) =>
      visibility.includes(name),
    );
    for (const name of returningPlayers) {
      if (premiumFoot.indexOf(name) <= highlightedColumn) highlightedColumn++;
    }
  }
  console.log("return: " + highlightedColumn);
  return highlightedColumn >= visibility.length ? 0 : highlightedColumn;
}

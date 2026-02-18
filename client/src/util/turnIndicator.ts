import type { Data } from "@/type";
import { isEmpty } from "lodash";

/**
 * Finds the Index of the player whos next up in the order of all visible players.
 * @param ordering Ordered array of all existing players
 * @param visibility Array of all visible players
 */
export function turnIndicator(
  { body, foot }: Data,
  ordering: string[],
  visibility: string[],
): number {
  // Ordered Array of all playing players
  const premiumFoot = ordering.filter((name) => foot[name] !== null);
  let playerIndex = -1;
  for (const row of body.slice(0, -1)) {
    if (isEmpty(row)) continue;
    while (true) {
      playerIndex = (playerIndex + 1) % premiumFoot.length;
      // if that player took part in the round, we're done and can continue with the next round
      if (premiumFoot[playerIndex]! in row) break;
    }
  }

  const previousPlayer = ordering.indexOf(premiumFoot[playerIndex]!);
  const computedHead = ordering.filter((name) => visibility.includes(name));
  // here we can't loop just over premiumFoot because a new player could join in the next round
  for (let i = 1; i <= ordering.length; i++) {
    const nextPlayer = (previousPlayer + i) % ordering.length;
    if (visibility.includes(ordering[nextPlayer]!)) {
      return computedHead.indexOf(ordering[nextPlayer]!);
    }
  }
  return -1;
}

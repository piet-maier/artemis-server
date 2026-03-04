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
  if (ordering.length === 0 || visibility.length === 0)
    throw new Error("Ordering or Visibility Empty!");
  const computedHead = ordering.filter((name) => visibility.includes(name));
  if (body.length === 1) return 0;
  if (body.length === 2) return computedHead.length > 1 ? 1 : 0;
  // Ordered Array of all playing players
  const premiumFoot = ordering.filter((name) => foot[name] !== null);
  let playerIndex = -1;
  for (const row of body.slice(0, -2)) {
    if (isEmpty(row)) continue;
    while (true) {
      playerIndex = (playerIndex + 1) % premiumFoot.length;
      // if that player took part in the round, we're done and can continue with the next round
      if (premiumFoot[playerIndex]! in row) break;
    }
  }

  const lastRound = body[body.length - 3];
  const activePlayers = ordering.filter((name) =>
    Object.keys(lastRound!).includes(name),
  );
  const lastPlayer = activePlayers.indexOf(premiumFoot[playerIndex]!);
  const nextPlayer = activePlayers[(lastPlayer + 2) % activePlayers.length];
  const nextPlayerResult = computedHead.indexOf(nextPlayer!);
  if (nextPlayerResult === -1) throw new Error("Returning non visible Player.");
  return nextPlayerResult;
}

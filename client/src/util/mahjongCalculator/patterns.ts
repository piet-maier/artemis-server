import {
  Dragon,
  isHonour,
  Wind,
} from "@/util/mahjongCalculator/tile.ts";
import {
  Chow,
  Kong,
  type Meld,
  Pair,
  Pung,
} from "@/util/mahjongCalculator/meld.ts";
import type { Hand } from "@/util/mahjongCalculator/hand.ts";

export function meldScore(meld: Meld, roundWind: Wind, seatWind: Wind) {
  if (meld instanceof Pung) {
    return pungScore(meld);
  }
  if (meld instanceof Kong) {
    return kongScore(meld);
  }
  if (meld instanceof Pair) {
    return pairScore(meld, roundWind, seatWind);
  }

  return 0;
}

function pungScore(pung: Pung) {
  if (pung.isTerminal || isHonour(pung.tileType)) {
    // Major pung
    return pung.isConcealed ? 8 : 4;
  } else {
    // Minor pung
    return pung.isConcealed ? 4 : 2;
  }
}

function kongScore(kong: Kong) {
  if (kong.isTerminal || isHonour(kong.tileType)) {
    // Major Kong
    return kong.isConcealed ? 32 : 16;
  } else {
    // Minor Kong
    return kong.isConcealed ? 16 : 8;
  }
}

function pairScore(pair: Pair, roundWind: Wind, seatWind: Wind) {
  if (typeof pair.tile === typeof Dragon) {
    return 2;
  }

  const wind = pair.tile as Wind;
  if (wind == roundWind || wind == seatWind) {
    return 2;
  }

  return 0;
}

export function pungOrKongOfDragonCount(melds: Meld[]): number {
  return melds.filter(
    (meld) =>
      (meld instanceof Pung || meld instanceof Kong) && meld.tileType in Dragon,
  ).length;
}

export function pungOrKongOfWindCount(
  melds: Meld[],
  wind: Wind | null = null,
): number {
  return melds.filter(
    (meld) =>
      (meld instanceof Pung || meld instanceof Kong) &&
      meld.tileType === (wind ?? meld.tileType),
  ).length;
}

export function hiddenPungCount(melds: Meld[]): number {
  return melds.filter((meld) => meld.isConcealed && meld instanceof Pung)
    .length;
}

export function isSmallThreeDragons(hand: Hand): boolean {
  return (
    pungOrKongOfDragonCount(hand.melds) == 2 &&
    ((hand.winningEye !== null && hand.winningEye.tileType in Dragon) ||
      hand.melds.find((meld) => meld instanceof Pair && meld.tile in Dragon) !==
        null)
  );
}

export function isBigThreeDragons(melds: Meld[]): boolean {
  return pungOrKongOfDragonCount(melds) === 3;
}

export function isNoChows(melds: Meld[]): boolean {
  return melds.find((meld) => meld instanceof Chow) === null;
}

export function isNonScoringHand(hand: Hand) {
  return (
    hand.melds.find((meld) => !(meld instanceof Chow)) === null &&
    hand.winningEye !== null
  );
}

export function isAllTilesHidden(hand: Hand): boolean {
  return (
    hand.melds.find((meld) => !meld.isConcealed) === null &&
    hand.winningEye !== null
  );
}

export function isSmallWinds(hand: Hand) {
  return (
    pungOrKongOfWindCount(hand.melds) === 3 &&
    (hand.melds.find((meld) => meld instanceof Pair) ||
      hand.winningEye !== null)
  );
}

export function isFourWinds(hand: Hand) {
  return pungOrKongOfWindCount(hand.melds) === 4;
}

export function allTilesOfOneColor(hand: Hand): boolean {
  if (hand.winningEye === null) {
    return false;
  }

  const commonColor = hand.winningEye.tileType;
  for (const meld of hand.melds) {
    if (meld instanceof Pair && meld.tile !== commonColor) {
      return false;
    } else if (
      (meld instanceof Pung || meld instanceof Kong) &&
      meld.tileType !== commonColor
    ) {
      return false;
    } else if (meld instanceof Chow && meld.suite !== commonColor) {
      return false;
    }
  }

  return true;
}

export function allTilesHonourTiles(hand: Hand): boolean {
  if (hand.winningEye !== null && !isHonour(hand.winningEye.tileType)) {
    return false;
  }

  for (const meld of hand.melds) {
    if (
      (meld instanceof Pung || meld instanceof Kong) &&
      !isHonour(meld.tileType)
    ) {
      return false;
    } else if (meld instanceof Chow && !isHonour(meld.suite)) {
      return false;
    }
  }

  return true;
}

export function allTilesHonourOrTerminal(hand: Hand): boolean {
  if (
    hand.winningEye !== null &&
    !(hand.winningEye.isTerminal || isHonour(hand.winningEye.tileType))
  ) {
    return false;
  }

  for (const meld of hand.melds) {
    if (
      (meld instanceof Pung || meld instanceof Kong) &&
      !(meld.isTerminal || isHonour(meld.tileType))
    ) {
    } else if (meld instanceof Chow && !meld.isTerminal) {
      return false;
    }
  }

  return true;
}

export function allTilesHonour(hand: Hand): boolean {
  if (
    hand.winningEye !== null &&
    !(hand.winningEye.isTerminal || isHonour(hand.winningEye.tileType))
  ) {
    return false;
  }

  for (const meld of hand.melds) {
    if (
      (meld instanceof Pung || meld instanceof Kong) &&
      !isHonour(meld.tileType)
    ) {
    } else if (meld instanceof Chow) {
      return false;
    }
  }

  return true;
}

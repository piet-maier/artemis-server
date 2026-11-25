function getScoreEmoji(score: number): string | undefined {
  switch (score) {
    case 4:
      return "4️⃣";
    case 7:
      return "🍀";
    case 67:
      return "⁶🤷‍♂️⁷";
    case 69:
      return "😏";
    case 420:
      return "🥦";
    case 666:
      return "😈";
    case 1337:
      return "🤓";
    case 10000:
      return "🎲";
    default:
      return undefined;
  }
}

function getFirstPlaceEmoji(name: string): string {
  switch (name) {
    case "Fax":
      return "✈️";
    case "Tobienchen":
      return "🌚";
    case "Nikman":
      return "🧜🏿‍♀️";
    case "Pert":
      return "🕴🏻";
    case "Schmelzofen":
      return "🗿";
    case "Herni":
      return "🪤";
    case "Hoctor Dirsch":
      return "🦌";
    case "Rilo":
      return "🐳";
    case "Prophet":
      return "👙";
    case "Chirs":
      return "🥵";
    default:
      return "👑";
  }
}

function getPositionEmoji(placement: number, playerCount: number): string {
  if (placement === playerCount - 1) return "📉";
  if (placement === playerCount - 2) return "🐟";

  switch (placement) {
    case 1:
      return "🧙‍♀️";
    case 2:
      return "🫃";
    case 3:
      return "🤕";
    case 4:
      return "😤";
    case 5:
      return "😭";
    default:
      return "";
  }
}

export function getPlayerEmoji(
  placement: number,
  score: number,
  name: string,
  playerCount: number,
): string {
  const scoreEmoji = getScoreEmoji(score);
  if (scoreEmoji) return scoreEmoji;

  if (placement === 0) {
    return getFirstPlaceEmoji(name);
  }

  return getPositionEmoji(placement, playerCount);
}

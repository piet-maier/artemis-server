export function fuseNames(names: string[]): string {
  const cleanedNames = names
    .map((name) => name.trim().replace(/\s+/g, ""))
    .filter(Boolean);

  if (cleanedNames.length === 0) return "";
  if (cleanedNames.length === 1) return cleanedNames[0];

  return cleanedNames
    .map((name, index) => {
      const characters = Array.from(name);
      const splitAt = Math.ceil(characters.length / 2);

      return index === 0
        ? characters.slice(0, splitAt).join("")
        : characters.slice(splitAt).join("") || characters.at(-1) || "";
    })
    .join("");
}

export function createSeededRandom(seed: string | number): () => number {
  const seedText = String(seed);
  let state = 2166136261;

  for (let index = 0; index < seedText.length; index++) {
    state ^= seedText.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string | number): T[] {
  const shuffled = [...items];
  const random = createSeededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

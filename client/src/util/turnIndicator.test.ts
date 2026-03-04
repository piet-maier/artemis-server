import type { Data } from "@/type";
import { turnIndicator } from "@/util/turnIndicator";
import { expect, test } from "vitest";

test("empty", () => {
  const table: Data = {
    head: [],
    body: [{}],
    foot: {},
  };

  const ordering: string[] = [];

  expect(() => turnIndicator(table, ordering, [])).toThrowError(
    "Ordering or Visibility Empty!",
  );
});

test("happypath", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [{ niklas: 1, piet: 2, henri: 3, tobias: 4 }, {}],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(1);
});

test("longer happypath", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(2);
});

test("happy wrap-around", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(0);
});

test("lonly test😭", () => {
  const table: Data = {
    head: ["niklas"],
    body: [{ niklas: 1 }, {}],
    foot: { niklas: 1 },
  };

  const ordering: string[] = ["niklas"];

  expect(turnIndicator(table, ordering, ["niklas"])).toBe(0);
});

test("henri weg", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, tobias: 4 },
      { niklas: 1, piet: 2, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(turnIndicator(table, ordering, ["niklas", "piet", "tobias"])).toBe(1);
});

test("henri kacken💩", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(1);
});

test("mehrmaliger wrap-around", () => {
  const table: Data = {
    head: ["niklas", "rike", "henri"],
    body: [
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      { niklas: 1, rike: 2, henri: 3 },
      {},
    ],
    foot: { niklas: 1, rike: 2, henri: 3 },
  };

  const ordering: string[] = ["niklas", "rike", "henri"];

  expect(turnIndicator(table, ordering, ["niklas", "rike", "henri"])).toBe(2);
});

test("last player gone", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(() =>
    turnIndicator(table, ordering, ["niklas", "piet", "henri"]),
  ).toThrowError("Returning non visible Player.");
});

test("last two players gone", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(() => turnIndicator(table, ordering, ["niklas", "piet"])).toThrowError(
    "Returning non visible Player.",
  );
});

test("piet kackt und kommt zurück", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(2);
});

test("piet kackt und kommt nicht zurück", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(turnIndicator(table, ordering, ["niklas", "henri", "tobias"])).toBe(1);
});

test("piet kackt und kommt zurück 2 Electric Boogaloo", () => {
  const table: Data = {
    head: ["niklas", "piet", "henri", "tobias"],
    body: [
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      { niklas: 1, henri: 3, tobias: 4 },
      { niklas: 1, piet: 2, henri: 3, tobias: 4 },
      {},
    ],
    foot: { niklas: 1, piet: 2, henri: 3, tobias: 4 },
  };

  const ordering: string[] = ["niklas", "piet", "henri", "tobias"];

  expect(
    turnIndicator(table, ordering, ["niklas", "piet", "henri", "tobias"]),
  ).toBe(0);
});

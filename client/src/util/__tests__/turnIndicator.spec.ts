import type { Data } from "@/type";
import { turnIndicator } from "@/util/turnIndicator";
import { expect, test } from "vitest";

test("empty", () => {
  const table: Data = {
    head: [],
    body: [{}],
    foot: {},
  };

  const ordering: number[] = [];

  expect(() => turnIndicator(table, ordering, [])).toThrow(
    "Ordering or Visibility Empty!",
  );
});

test("happypath", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [{ 1: 1, 2: 2, 3: 3, 4: 4 }, {}],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(2);
});

test("longer happypath", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [{ 1: 1, 2: 2, 3: 3, 4: 4 }, { 1: 1, 2: 2, 3: 3, 4: 4 }, {}],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(2);
});

test("happy wrap-around", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(0);
});

test("lonly test😭", () => {
  const table: Data = {
    head: [1],
    body: [{ 1: 1 }, {}],
    foot: { 1: 1 },
  };

  const ordering = [1];

  expect(turnIndicator(table, ordering, [1])).toBe(0);
});

test("henri weg", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 4: 4 },
      { 1: 1, 2: 2, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 4])).toBe(1);
});

test("henri kacken💩", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(1);
});

test("mehrmaliger wrap-around", () => {
  const table: Data = {
    head: [1, 2, 3],
    body: [
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      { 1: 1, 2: 2, 3: 3 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3 },
  };

  const ordering = [1, 2, 3];

  expect(turnIndicator(table, ordering, [1, 2, 3])).toBe(2);
});

test("last player gone", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(() => turnIndicator(table, ordering, [1, 2, 3])).toThrow(
    "Returning non visible Player.",
  );
});

test("last two players gone", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(() => turnIndicator(table, ordering, [1, 2])).toThrow(
    "Returning non visible Player.",
  );
});

test("piet kackt und kommt zurück", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [{ 1: 1, 2: 2, 3: 3, 4: 4 }, { 1: 1, 3: 3, 4: 4 }, {}],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(2);
});

test("piet kackt und kommt nicht zurück", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [{ 1: 1, 2: 2, 3: 3, 4: 4 }, { 1: 1, 3: 3, 4: 4 }, {}],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 3, 4])).toBe(1);
});

test("piet kackt und kommt zurück 2 Electric Boogaloo", () => {
  const table: Data = {
    head: [1, 2, 3, 4],
    body: [
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      { 1: 1, 3: 3, 4: 4 },
      { 1: 1, 2: 2, 3: 3, 4: 4 },
      {},
    ],
    foot: { 1: 1, 2: 2, 3: 3, 4: 4 },
  };

  const ordering = [1, 2, 3, 4];

  expect(turnIndicator(table, ordering, [1, 2, 3, 4])).toBe(0);
});

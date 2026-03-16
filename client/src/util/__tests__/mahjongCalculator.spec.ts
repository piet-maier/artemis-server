import {mahjongScore} from "@/util/mahjongCalculator";
import {expect, test} from "vitest"

test("testSuite", () => {
  expect(mahjongScore).not.toThrow();
});
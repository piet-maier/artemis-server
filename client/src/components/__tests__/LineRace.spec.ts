import LineRace from "@/components/LineRace.vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

const data = [
  { x: 1, y: 400, z: "uv" },
  { x: 2, y: 300, z: "uv" },
  { x: 3, y: 300, z: "uv" },
  { x: 4, y: 200, z: "uv" },
  { x: 5, y: 278, z: "uv" },
  { x: 6, y: 189, z: "uv" },
  { x: 1, y: 240, z: "pv" },
  { x: 2, y: 456, z: "pv" },
  { x: 3, y: 139, z: "pv" },
  { x: 4, y: 980, z: "pv" },
  { x: 5, y: 390, z: "pv" },
  { x: 6, y: 480, z: "pv" },
];

const lineSelector = "path";
const textSelector = "g.stroke-background-default text";

test("No Data", () => {
  const lineRace = mount(LineRace, { props: { data: [] } });

  expect(lineRace.findAll(lineSelector)).toHaveLength(0);

  expect(lineRace.findAll(textSelector)).toHaveLength(0);
});

test("Sample Data", () => {
  const lineRace = mount(LineRace, { props: { data } });

  expect(lineRace.findAll(lineSelector)).toHaveLength(2);

  expect(lineRace.findAll(textSelector).map((item) => item.text())).toEqual([
    "uv",
    "pv",
  ]);
});

test("Changing Data", async () => {
  const lineRace = mount(LineRace, { props: { data } });

  await lineRace.setProps({
    data: [
      { x: 1, y: 2400, z: "amt" },
      { x: 2, y: 2210, z: "amt" },
      { x: 3, y: 2290, z: "amt" },
      { x: 4, y: 2000, z: "amt" },
      { x: 5, y: 2181, z: "amt" },
      { x: 6, y: 2500, z: "amt" },
      { x: 7, y: 2100, z: "amt" },
    ],
  });

  expect(lineRace.findAll(lineSelector)).toHaveLength(1);

  expect(lineRace.findAll(textSelector).map((item) => item.text())).toEqual([
    "amt",
  ]);
});

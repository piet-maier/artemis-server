import LineRace from "@/components/LineRace.vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

const data = [
  { x: 1, y: 400, id: 1, name: "uv" },
  { x: 2, y: 300, id: 1, name: "uv" },
  { x: 3, y: 300, id: 1, name: "uv" },
  { x: 4, y: 200, id: 1, name: "uv" },
  { x: 5, y: 278, id: 1, name: "uv" },
  { x: 6, y: 189, id: 1, name: "uv" },
  { x: 1, y: 240, id: 2, name: "pv" },
  { x: 2, y: 456, id: 2, name: "pv" },
  { x: 3, y: 139, id: 2, name: "pv" },
  { x: 4, y: 980, id: 2, name: "pv" },
  { x: 5, y: 390, id: 2, name: "pv" },
  { x: 6, y: 480, id: 2, name: "pv" },
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
      { x: 1, y: 2400, id: 3, name: "amt" },
      { x: 2, y: 2210, id: 3, name: "amt" },
      { x: 3, y: 2290, id: 3, name: "amt" },
      { x: 4, y: 2000, id: 3, name: "amt" },
      { x: 5, y: 2181, id: 3, name: "amt" },
      { x: 6, y: 2500, id: 3, name: "amt" },
      { x: 7, y: 2100, id: 3, name: "amt" },
    ],
  });

  expect(lineRace.findAll(lineSelector)).toHaveLength(1);

  expect(lineRace.findAll(textSelector).map((item) => item.text())).toEqual([
    "amt",
  ]);
});

test("Text Position", () => {
  const lineRace = mount(LineRace, {
    props: {
      // Remove some values so that the "uv" line ends above and to the right of the "pv" line.
      data: data.map((item, number) =>
        number < 9 ? item : { ...item, y: Number.NaN },
      ),
    },
  });

  const text = lineRace.findAll(textSelector);

  const uv = text.find((item) => item.text() === "uv");
  const pv = text.find((item) => item.text() === "pv");

  expect(Number(uv!.attributes("x"))).toBeGreaterThan(
    Number(pv!.attributes("x")),
  );

  // The point of origin of the SVG coordinate system is the top left corner.
  expect(Number(uv!.attributes("y"))).toBeLessThan(Number(pv!.attributes("y")));
});

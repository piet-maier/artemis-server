import GridView from "@/views/GridView.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import type { StateTree } from "pinia";
import { io } from "socket.io-client";
import { expect, test, vi } from "vitest";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({ params: { type: "Type", grid: 0 }, query: {} })),
  useRouter: vi.fn(),
}));

vi.mock("socket.io-client");

const mockSocket = io();

function render(initialState?: StateTree, stub = true) {
  return mount(GridView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState,
          stubActions: stub,
        }),
      ],
    },
  });
}

test("Display Grid Type & Date", () => {
  const date = new Date(0);
  const gridView = render({ grid: { date } });

  expect(gridView.get("h2").text()).toBe("Type");

  expect(gridView.get("p").text()).toBe(
    date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
});

test("Emit grid:read WS Event", () => {
  render(undefined, false);

  expect(mockSocket.emit).toHaveBeenCalledWith(
    "grid:read",
    0,
    expect.any(Function),
  );
});

test("Emit grid:update WS Event", async () => {
  const gridView = render({
    player: { visibility: [0], ordering: [0] },
    grid: { data: { head: [0], body: [{}], foot: {} } },
  });

  await gridView.get("input").setValue("0");

  expect(mockSocket.emit).toHaveBeenCalledWith(
    "grid:update",
    0,
    { player: 0, number: 0, cell: "0" },
    expect.any(Function),
  );
});

import HomeView from "@/views/HomeView.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { io } from "socket.io-client";
import { expect, test, vi } from "vitest";

vi.mock("socket.io-client");

const mockSocket = io();

test("Emit grid:create WS Event", async () => {
  const homeView = mount(HomeView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            connection: { navigation: { Type: [] }, plot: { x: 0 } },
          },
          stubActions: false,
        }),
      ],
    },
  });

  await homeView.get("input").setValue("Type");

  await homeView
    .findAll("button")
    .find((button) => button.text() === "Create")!
    .trigger("click");

  expect(mockSocket.emit).toHaveBeenCalledWith(
    "grid:create",
    "Type",
    expect.any(Function),
  );
});

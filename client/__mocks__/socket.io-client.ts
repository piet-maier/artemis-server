import { vi } from "vitest";

const mockSocket = {
  io: {
    on: vi.fn(),
  },

  emit: vi.fn(),
  on: vi.fn(),
};

export const io = vi.fn(() => mockSocket);

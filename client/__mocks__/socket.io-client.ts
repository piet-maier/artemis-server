import { vi } from "vitest";

const mockSocket = {
  emit: vi.fn(),
};

export const io = vi.fn(() => mockSocket);

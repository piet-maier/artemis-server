import { vi } from "vitest";

const IntersectionObserverMock = vi.fn(
  class {
    observe = vi.fn();
  },
);

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

Element.prototype.scrollTo = vi.fn();

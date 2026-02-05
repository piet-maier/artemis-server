import { io, type Socket } from "socket.io-client";

export interface Data {
  head: string[];
  body: Record<string, number>[];
  foot: Record<string, number>;
}

export interface Change {
  name: string;
  number: number;
  cell: string;
}

interface ServerToClientEvents {
  "grid:create": (type: string, grid: number) => void;
  "grid:update": (
    type: string,
    grid: string,
    change: Change,
    foot: number,
  ) => void;
}

interface ClientToServerEvents {
  navigation: (callback: (record: Record<string, number[]>) => void) => void;
  "grid:create": (type: string, callback: (grid: number) => void) => void;
  "grid:read": (
    type: string,
    grid: string,
    callback: (data: Data) => void,
  ) => void;
  "grid:update": (type: string, grid: string, change: Change) => void;
  plot: (callback: (data: Record<string, number>) => void) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.PROD
    ? undefined
    : "ws://" + window.location.hostname + ":5000",
  {
    autoConnect: false,
  },
);

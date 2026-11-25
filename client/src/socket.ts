import type { Change, Data, Player } from "@/type";
import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  "grid:create": (type: string, id: number, unixTime: number) => void;
  "grid:update": (id: number, change: Change, foot: number) => void;
  "grid:latest": (game: { type: string; id: number; unixTime: number }) => void;
  "player:create": (player: Player) => void;
  "player:update": (player: Player) => void;
  "player:delete": (id: number) => void;
}

interface ClientToServerEvents {
  navigation: (
    callback: (
      record: Record<string, { id: number; unixTime: number }[]>,
    ) => void,
  ) => void;
  "grid:create": (
    type: string,
    callback: (id: number, unixTime: number) => void,
  ) => void;
  "grid:read": (
    id: number,
    callback: (unixTime: number, data: Data) => void,
  ) => void;
  "grid:update": (
    id: number,
    change: Change,
    callback: (foot: number) => void,
  ) => void;
  "grid:latest:read": (
    callback: (
      game: {
        type: string;
        id: number;
        unixTime: number;
      } | null,
    ) => void,
  ) => void;
  plot: (callback: (data: Record<string, number>) => void) => void;
  "player:create": (name: string) => void;
  "player:read": (callback: (players: Player[]) => void) => void;
  "player:update": (player: Player) => void;
  "player:delete": (id: number) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.PROD
    ? undefined
    : "ws://" + window.location.hostname + ":5000",
  {
    autoConnect: false,
  },
);

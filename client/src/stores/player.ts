import { socket } from "@/socket.ts";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const usePlayerStore = defineStore("player", () => {
  const players = reactive([
    {
      name: "NikmanganzlangerNamederdasGesamteTexfeldausfühltundüberdenButtongehtname",
      id: 1,
    },
    { name: "Fax", id: 2 },
    { name: "PietySD", id: 3 },
  ]);

  function readPlayers() {
    socket.emit("player:read", (playersResponse) => {});
  }

  return { players };
});

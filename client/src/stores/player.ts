import { socket } from "@/socket.ts";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
  const players = ref([
    {
      name: "NikmanganzlangerNamederdasGesamteTexfeldausfühltundüberdenButtongehtname",
      id: 1,
    },
    { name: "Fax", id: 2 },
    { name: "PietySD", id: 3 },
  ]);

  function createPlayer(name: string) {
    socket.emit("player:create", name);
  }

  function readPlayers() {
    socket.emit("player:read", (playersResponse) => {
      players.value = playersResponse;
    });
  }

  function deletePlayer(id: number) {
    socket.emit("player:delete", id);
  }

  function subscribe() {
    socket.on("player:create", (player) => {
      players.value.push(player);
    });
    socket.on("player:delete", (id) => {
      players.value.splice(
        players.value.findIndex((player) => player.id === id),
        1,
      );
    });
  }

  return { players, createPlayer, readPlayers, deletePlayer, subscribe };
});

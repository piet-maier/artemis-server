import { socket } from "@/socket.ts";
import type { Player } from "@/type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
  const players = ref<Player[]>([]);
  const tempPlayers = ref<Player[]>([]);

  function createPlayer(name: string) {
    socket.emit("player:create", name);
  }

  function readPlayers() {
    socket.emit("player:read", (playersResponse) => {
      players.value = playersResponse;
      tempPlayers.value = structuredClone(playersResponse);
    });
  }

  function updatePlayer(player: Player) {
    socket.emit("player:update", player);
  }

  function deletePlayer(id: number) {
    socket.emit("player:delete", id);
  }

  /* TODO archivePlayer to remove player from list without deleting data */

  function subscribe() {
    socket.on("player:create", (player) => {
      players.value.push(player);
      tempPlayers.value.push(player);
    });
    socket.on("player:update", (newPlayer) => {
      const newPlayerIndex = players.value.findIndex(
        (player) => player.id === newPlayer.id,
      );
      const newtempPlayerIndex = tempPlayers.value.findIndex(
        (player) => player.id === newPlayer.id,
      );
      if (
        players.value[newPlayerIndex].name ===
        tempPlayers.value[newtempPlayerIndex].name
      )
        tempPlayers.value[newtempPlayerIndex].name = newPlayer.name;
      players.value[newPlayerIndex].name = newPlayer.name;
    });
    socket.on("player:delete", (id) => {
      players.value.splice(
        players.value.findIndex((player) => player.id === id),
        1,
      );
    });
  }

  return {
    players,
    tempPlayers,
    createPlayer,
    readPlayers,
    updatePlayer,
    deletePlayer,
    subscribe,
  };
});

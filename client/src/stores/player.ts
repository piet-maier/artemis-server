import { useStorage } from "@/composables/useStorage";
import { socket } from "@/socket.ts";
import type { Player } from "@/type";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
  const players = ref<Player[]>([]);
  const tempPlayers = ref<Player[]>([]);

  const visibility = useStorage("visibility") as Ref<number[]>;
  const ordering = useStorage("ordering") as Ref<number[]>;

  function playerNameByID(id: number) {
    return players.value.find((player) => player.id === id)?.name;
  }

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

      ordering.value.push(player.id);
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

  function maybeInitializeStorage(head: number[]) {
    if (visibility.value === null) visibility.value = [...head];

    if (ordering.value === null) ordering.value = [...head];
  }

  return {
    players,
    tempPlayers,
    visibility,
    ordering,
    playerNameByID,
    createPlayer,
    readPlayers,
    updatePlayer,
    deletePlayer,
    subscribe,
    maybeInitializeStorage,
  };
});

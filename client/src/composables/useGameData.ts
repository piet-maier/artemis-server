import { onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { socket } from "@/socket";
import { useGridStore } from "@/stores/grid";
import type { Change } from "@/type";
import { storeToRefs } from "pinia";

interface LatestGame {
  type: string;
  id: number;
  unixTime: number;
}

export function useGameData() {
  const route = useRoute();
  const grid = useGridStore();
  const { data, date } = storeToRefs(grid);
  const { readGrid, changeData } = grid;

  const latestGame = ref<LatestGame | null>(null);

  function isLatestRoute() {
    return route.name === "grid-latest" || route.name === "chart-latest";
  }

  function getGridId(): number | null {
    if (!isLatestRoute()) {
      const param = route.params.grid;

      if (typeof param === "string") {
        const id = Number(param);
        return Number.isInteger(id) && id > 0 ? id : null;
      }

      return null;
    }

    return latestGame.value?.id ?? null;
  }

  function applyLatestGame(game: LatestGame | null) {
    if (!game || !isLatestRoute()) return;

    const current = latestGame.value;

    if (
      current &&
      (game.unixTime < current.unixTime ||
        (game.unixTime === current.unixTime && game.id <= current.id))
    ) {
      return;
    }

    latestGame.value = game;
    void readGrid(game.id);
  }

  function requestLatestGame() {
    socket.emit("grid:latest:read", (game) => {
      applyLatestGame(game);
    });
  }

  async function loadGame() {
    if (isLatestRoute()) {
      latestGame.value = null;
      requestLatestGame();
      return;
    }

    const router = useRouter();

    const id = getGridId();

    if (id === null) {
      await router.replace({ name: "NotFound" });
      return;
    }

    const found = await readGrid(id);

    if (!found) {
      await router.replace({ name: "NotFound" });
    }
  }

  function handleLatestGame(game: LatestGame) {
    applyLatestGame(game);
  }

  function handleGridUpdate(id: number, change: Change, foot: number) {
    if (id === getGridId()) {
      changeData(change, foot);
    }
  }

  function handleReconnect() {
    if (isLatestRoute()) {
      latestGame.value = null;
      requestLatestGame();
    } else {
      void loadGame();
    }
  }

  watch(() => [route.name, route.params.grid], loadGame, { immediate: true });

  socket.on("grid:update", handleGridUpdate);
  socket.on("grid:latest", handleLatestGame);
  socket.io.on("reconnect", handleReconnect);

  onUnmounted(() => {
    socket.off("grid:update", handleGridUpdate);
    socket.off("grid:latest", handleLatestGame);
    socket.io.off("reconnect", handleReconnect);
  });

  return {
    data,
    date,
    grid,
    gameId: getGridId,
    gameType: () =>
      latestGame.value?.type ??
      (typeof route.params.type === "string" ? route.params.type : ""),
  };
}

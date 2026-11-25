<script lang="ts" setup>
import LineRace from "@/components/LineRace.vue";
import { useGridStore } from "@/stores/grid";
import { usePlayerStore } from "@/stores/player";
import { computed, onUnmounted, watch } from "vue";
import { socket } from "@/socket";
import { useRoute } from "vue-router";

const location = useRoute();

const { playerNameByID } = usePlayerStore();
const grid = useGridStore();

const { data } = grid;

const { readGrid, changeData } = grid;

const computedData = computed(() => {
  const filteredHead = data.head.filter((id) => data.foot[id] !== null);

  const runningTotal: Record<number, number> = {};

  const result = filteredHead.map((id) => ({
    x: 0,
    y: 0,
    z: playerNameByID(id)!,
  }));

  for (const z of filteredHead) {
    for (let x = 1; x < data.body.length; x++) {
      const record = data.body[x - 1];

      let y = Number.NaN;

      if (z in record) {
        runningTotal[z] = (runningTotal[z] ?? 0) + record[z];

        y = runningTotal[z];
      }

      result.push({
        x,
        y,
        z: playerNameByID(z)!,
      });
    }
  }

  return result;
});

watch(
  () => location.params.grid,
  (grid) => {
    readGrid(+(grid as string));
  },
  { immediate: true },
);

socket.on("grid:update", (grid, change, foot) => {
  if (grid.toString() === location.params.grid) {
    changeData(change, foot);
  }
});

socket.io.on("reconnect", () => {
  readGrid(+(location.params.grid as string));
});

onUnmounted(() => {
  socket.off("grid:update");
  socket.io.off("reconnect");
});
</script>

<template>
  <main class="container py-4 sm:py-8">
    <LineRace v-if="data.head.length > 0" class="w-full" :data="computedData" />
  </main>
</template>

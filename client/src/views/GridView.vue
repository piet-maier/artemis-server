<script lang="ts" setup>
import DataGrid from "@/components/DataGrid.vue";
import IconButton from "@/components/IconButton.vue";
import LineRace from "@/components/LineRace.vue";
import LocaleDate from "@/components/LocaleDate.vue";
import { socket } from "@/socket";
import { useGridStore } from "@/stores/grid";
import { ChartBarIcon, TableIcon } from "@lucide/vue";
import { computed, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const location = useRoute();
const router = useRouter();

const { data, readGrid, changeData } = useGridStore();

const computedData = computed(() => {
  const filteredHead = data.head.filter((name) => data.foot[name] !== null);

  const runningTotal: Record<string, number> = {};

  const result = filteredHead.map((name) => ({ x: 0, y: 0, z: name }));

  for (const z of filteredHead) {
    for (let x = 1; x < data.body.length; x++) {
      const record = data.body[x - 1];

      let y = Number.NaN;

      if (z in record) {
        runningTotal[z] = (runningTotal[z] ?? 0) + record[z];

        y = runningTotal[z];
      }

      result.push({ x, y, z });
    }
  }

  return result;
});

const showGrid = computed(() => location.query.mode !== "chart");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emoji = (index: number, score: number, name: string) => {
  switch (score) {
    case 4:
      return "4️⃣";
    case 7:
      return "🍀";
    case 67:
      return " ⁶🤷‍♂️⁷";
    case 69:
      return "😏";
    case 420:
      return "🥦";
    case 666:
      return "😈";
    case 1337:
      return "🤓";
    case 10000:
      return "🎲";
  }
  switch (index) {
    case 0: {
      switch (name) {
        case "Fax":
          return "✈️";
        case "Tobienchen":
          return "🌚";
        case "Nikman":
          return "🧜🏿‍♀️";
        case "Pert":
          return "🕴🏻";
        case "Schmelzofen":
          return "🗿";
        case "Herni":
          return "🪤";
        case "Hoctor Dirsch":
          return "🦌";
        case "Rilo":
          return "🐳";
        case "Prophet":
          return "👙";
        case "Chirs":
          return "🥵";
        default:
          return "👑";
      }
    }
    case activePlayers.value.length - 1:
      return "📉";
    case activePlayers.value.length - 2:
      return "🐟";
    case 1:
      return "🧙‍♀️";
    case 2:
      return "🫃";
    case 3:
      return "🤕";
    case 4:
      return "😤";
    case 5:
      return "😭";
    default:
      return "";
  }
};

const activePlayers = computed(() =>
  data.head.filter((name) => data.foot[name] !== null),
);

watch(
  () => [location.params.type, location.params.grid],
  ([type, grid]) => {
    readGrid(type as string, grid as string);
  },
  { immediate: true },
);

function onChange(name: string, number: number, cell: string) {
  socket.emit(
    "grid:update",
    location.params.type as string,
    location.params.grid as string,
    { name, number, cell },
  );
}

socket.on("grid:update", (type, grid, change, foot) => {
  if (type === location.params.type && grid === location.params.grid) {
    changeData(change, foot);
  }
});

socket.io.on("reconnect", () => {
  readGrid(location.params.type as string, location.params.grid as string);
});

onUnmounted(() => {
  socket.off("grid:update");

  socket.io.off("reconnect");
});
</script>

<template>
  <main class="container py-4 sm:py-8">
    <IconButton
      class="ml-auto"
      @click="router.replace({ query: { mode: showGrid ? 'chart' : 'grid' } })"
    >
      <ChartBarIcon v-if="showGrid" />
      <TableIcon v-else />
    </IconButton>

    <div v-if="showGrid">
      <div class="mb-8 space-y-2">
        <h2 class="text-4xl font-bold tracking-tight">
          {{ location.params.type }}
        </h2>
        <p class="text-lg text-foreground-muted">
          <LocaleDate :date="new Date(+location.params.grid)" />
        </p>
      </div>

      <DataGrid v-if="data.head.length > 0" v-bind="data" @change="onChange" />
    </div>

    <LineRace
      v-else-if="data.head.length > 0"
      class="w-full"
      :data="computedData"
    />
  </main>
</template>

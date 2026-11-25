<script lang="ts" setup>
import DataGrid from "@/components/DataGrid.vue";
import IconButton from "@/components/IconButton.vue";
import LocaleDate from "@/components/LocaleDate.vue";
import { useGameData } from "@/composables/useGameData";
import { useGameNavigation } from "@/composables/useGameNavigation";
import { socket } from "@/socket";
import type { Change } from "@/type";
import { ChartBarIcon } from "@lucide/vue";

const { data, date, gameId, grid, gameType } = useGameData();
const { toggleView } = useGameNavigation();

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

function onChange(player: number, number: number, cell: string) {
  const id = gameId();

  if (id === null) return;

  const change: Change = { player, number, cell };

  socket.emit("grid:update", id, change, (foot: number) => {
    grid.changeData(change, foot);
  });
}
</script>

<template>
  <main class="container py-4 sm:py-8">
    <IconButton class="ml-auto" @click="toggleView">
      <ChartBarIcon />
    </IconButton>

    <div class="mb-8 space-y-2">
      <h2 class="text-4xl font-bold tracking-tight">
        {{ gameType() }}
      </h2>
      <p v-if="date" class="text-lg text-foreground-muted">
        <LocaleDate :date="date" />
      </p>
    </div>

    <DataGrid v-if="data.head.length > 0" v-bind="data" @change="onChange" />
  </main>
</template>

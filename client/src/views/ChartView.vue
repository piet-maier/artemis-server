<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import LineRace from "@/components/LineRace.vue";
import { useGameData } from "@/composables/useGameData";
import { useGameNavigation } from "@/composables/useGameNavigation";
import { usePlayerStore } from "@/stores/player";
import { computed } from "vue";
import { TableIcon } from "@lucide/vue";

const { data } = useGameData();
const { toggleView } = useGameNavigation();

const { playerNameByID } = usePlayerStore();

const computedData = computed(() => {
  const gridData = data.value;

  const filteredHead = gridData.head.filter((id) => gridData.foot[id] !== null);

  const runningTotal: Record<number, number> = {};

  const result = filteredHead.map((id) => ({
    x: 0,
    y: 0,
    z: playerNameByID(id)!,
  }));

  for (const z of filteredHead) {
    for (let x = 1; x < gridData.body.length; x++) {
      const record = gridData.body[x - 1];

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
</script>

<template>
  <main class="container py-4 sm:py-8">
    <IconButton class="ml-auto" @click="toggleView">
      <TableIcon />
    </IconButton>

    <LineRace v-if="data.head.length > 0" class="w-full" :data="computedData" />
  </main>
</template>

<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import LineRace from "@/components/LineRace.vue";
import { useGameData } from "@/composables/useGameData";
import { useGameNavigation } from "@/composables/useGameNavigation";
import { usePlayerStore } from "@/stores/player";
import { computed } from "vue";
import { getPlayerEmoji } from "@/util/emoji";
import { TableIcon } from "@lucide/vue";

const { data } = useGameData();
const { toggleView } = useGameNavigation();

const { playerNameByID } = usePlayerStore();

const computedData = computed(() => {
  const gridData = data.value;

  const filteredHead = gridData.head.filter((id) => gridData.foot[id] !== null);

  const runningTotal: Record<number, number> = {};
  const result = [];

  for (let x = 0; x < gridData.body.length; x++) {
    const record = x === 0 ? {} : gridData.body[x - 1];

    const roundScores = filteredHead.map((id, originalOrder) => {
      if (id in record) {
        runningTotal[id] = (runningTotal[id] ?? 0) + record[id];
      }

      return {
        id,
        originalOrder,
        name: playerNameByID(id)!,
        score: x === 0 || id in record ? (runningTotal[id] ?? 0) : Number.NaN,
        rankingScore: runningTotal[id] ?? 0,
      };
    });

    const rankedPlayers = [...roundScores].sort(
      (a, b) =>
        b.rankingScore - a.rankingScore || a.originalOrder - b.originalOrder,
    );

    const placementById = new Map(
      rankedPlayers.map((player, placement) => [player.id, placement]),
    );

    for (const player of roundScores) {
      const placement = placementById.get(player.id);
      result.push({
        x,
        y: player.score,
        z: player.name,
        emoji:
          placement === undefined
            ? ""
            : getPlayerEmoji(
                placement,
                player.score,
                player.name,
                filteredHead.length,
              ),
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

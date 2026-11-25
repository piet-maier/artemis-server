<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import LineRace from "@/components/LineRace.vue";
import { useGameData } from "@/composables/useGameData";
import { useGameNavigation } from "@/composables/useGameNavigation";
import { usePlayerStore } from "@/stores/player";
import { computed } from "vue";
import { getPlayerEmoji } from "@/util/emoji";
import { fuseNames, seededShuffle } from "@/util/sharedName";
import { TableIcon } from "@lucide/vue";

const { data, gameId } = useGameData();
const { targetRoute } = useGameNavigation();

const { playerNameByID } = usePlayerStore();

const computedData = computed(() => {
  const gridData = data.value;
  const currentGameId = gameId();
  const filteredHead = gridData.head.filter((id) => gridData.foot[id] !== null);

  const runningTotal: Record<number, number> = {};
  const result: {
    x: number;
    y: number;
    id: number;
    name: string;
    emoji: string;
  }[] = [];

  for (let x = 0; x < gridData.body.length; x++) {
    const record = x === 0 ? {} : gridData.body[x - 1];

    const roundScores = filteredHead.map((id) => {
      if (id in record) {
        runningTotal[id] = (runningTotal[id] ?? 0) + record[id];
      }

      return {
        id,
        name: playerNameByID(id) ?? "",
        score: x === 0 || id in record ? (runningTotal[id] ?? 0) : Number.NaN,
        rankingScore: runningTotal[id] ?? 0,
      };
    });

    const playersByScore = new Map<number, (typeof roundScores)[number][]>();

    for (const player of roundScores) {
      const players = playersByScore.get(player.rankingScore) ?? [];
      players.push(player);
      playersByScore.set(player.rankingScore, players);
    }

    const orderedPlayersByScore = new Map<
      number,
      (typeof roundScores)[number][]
    >();

    for (const [score, players] of playersByScore) {
      if (players.length === 1) {
        orderedPlayersByScore.set(score, players);
        continue;
      }

      const playerIds = players
        .map(({ id }) => id)
        .sort((a, b) => a - b)
        .join(",");

      const seed = `game:${currentGameId ?? "unknown"}:round:${x}:score:${score}:players:${playerIds}`;

      orderedPlayersByScore.set(score, seededShuffle(players, seed));
    }

    const rankedPlayers = [...orderedPlayersByScore.entries()]
      .sort(([scoreA], [scoreB]) => scoreB - scoreA)
      .flatMap(([, players]) => players);

    const placementById = new Map(
      rankedPlayers.map((player, placement) => [player.id, placement]),
    );

    const displayNameById = new Map<number, string>();
    const emojiById = new Map<number, string>();

    for (const players of orderedPlayersByScore.values()) {
      if (players.length === 1) {
        const player = players[0];
        displayNameById.set(player.id, player.name);
        continue;
      }

      const sharedName = fuseNames(players.map(({ name }) => name));
      const firstPlayer = players[0];

      displayNameById.set(firstPlayer.id, sharedName);

      for (const player of players.slice(1)) {
        displayNameById.set(player.id, "");
      }

      const placement = placementById.get(firstPlayer.id);

      if (placement !== undefined) {
        emojiById.set(
          firstPlayer.id,
          getPlayerEmoji(
            placement,
            firstPlayer.score,
            firstPlayer.name,
            filteredHead.length,
          ),
        );
      }
    }

    for (const player of roundScores) {
      if (playersByScore.get(player.rankingScore)?.length !== 1) continue;

      const placement = placementById.get(player.id);

      if (placement !== undefined) {
        emojiById.set(
          player.id,
          getPlayerEmoji(
            placement,
            player.score,
            player.name,
            filteredHead.length,
          ),
        );
      }
    }

    for (const player of roundScores) {
      result.push({
        x,
        y: player.score,
        id: player.id,
        name: displayNameById.get(player.id) ?? player.name,
        emoji: emojiById.get(player.id) ?? "",
      });
    }
  }

  return result;
});
</script>

<template>
  <main class="container py-4 sm:py-8">
    <RouterLink class="ml-auto flex w-10" :to="targetRoute">
      <IconButton>
        <TableIcon />
      </IconButton>
    </RouterLink>

    <LineRace v-if="data.head.length > 0" class="w-full" :data="computedData" />
  </main>
</template>

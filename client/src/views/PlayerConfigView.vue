<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import TextInput from "@/components/TextInput.vue";
import { usePlayerStore } from "@/stores/player";
import {
  ChevronDownIcon,
  SmilePlusIcon,
  UserRoundPenIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
} from "@lucide/vue";
import { ref } from "vue";

const changedPlayerIds = ref<number[]>([]);
const expandedPlayerId = ref<number | null>(null);
const inputValue = ref("");
const playerStore = usePlayerStore();

playerStore.readPlayers();

function togglePlayer(id: number) {
  expandedPlayerId.value = expandedPlayerId.value === id ? null : id;
}

function createPlayer() {
  /* TODO Add Validation */
  playerStore.createPlayer(inputValue.value);
  inputValue.value = "";
}

function updatePlayer(index: number) {
  playerStore.updatePlayer(playerStore.tempPlayers[index]);
}

function deletePlayer(playerId: number) {
  playerStore.deletePlayer(playerId);
}

function updateChangedPlayerIds(id: number) {
  const player = playerStore.players.find((player) => player.id === id);
  const tempPlayer = playerStore.tempPlayers.find(
    (tempPlayer) => tempPlayer.id === id,
  );
  if (player?.name === tempPlayer?.name)
    changedPlayerIds.value.splice(changedPlayerIds.value.indexOf(id), 1);
  else if (changedPlayerIds.value.indexOf(id) === -1)
    changedPlayerIds.value.push(id);
}
</script>

<template>
  <main class="container py-4 sm:py-8">
    <div class="mb-2 flex gap-2">
      <input
        v-model="inputValue"
        class="rounded-md border border-border-default pr-2 pl-2 focus-ring sm:pr-4 sm:pl-4"
        type="text"
      />
      <button
        class="flex cursor-pointer items-center rounded-md bg-background-accent px-4 py-2 text-sm font-medium text-foreground-accent focus-ring hover:bg-background-accent-hover"
        type="button"
        @click="createPlayer"
      >
        <UserRoundPlusIcon class="mr-2" /> Create Player
      </button>
    </div>
    <!-- TODO smoth out the expansion of the border of the div -->
    <TransitionGroup
      class="rounded-md border border-border-default"
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-8 scale-y-0"
      leave-active-class="transition duration-300 absolute"
      leave-to-class="opacity-0 -translate-y-8 scale-y-0"
      move-class="transition duration-300"
      tag="div"
    >
      <template
        v-for="(player, index) in playerStore.tempPlayers.filter((player) =>
          player.name.toLowerCase().includes(inputValue.toLowerCase()),
        )"
        :key="player.id"
      >
        <div class="flex cursor-pointer items-center justify-between p-2">
          <TextInput
            v-model="player.name"
            class="m-2 flex-1 p-2"
            @focus="expandedPlayerId = player.id"
            @update:model-value="updateChangedPlayerIds(player.id)"
          />

          <IconButton class="focus-ring" @click="togglePlayer(player.id)">
            <ChevronDownIcon
              :class="[
                'transition-transform duration-300',
                { 'rotate-180': expandedPlayerId === player.id },
              ]"
            />
          </IconButton>
        </div>

        <!-- TODO Make it possible expand multiple Rows at the same time (maybe even close them upon clicking the update button) -->
        <div v-if="expandedPlayerId === player.id">
          <div class="mx-2 flex gap-16 lg:gap-32">
            <div class="flex">
              <IconButton
                class="m-2"
                :disabled="!changedPlayerIds.includes(player.id)"
                variant="accent"
                @click="updatePlayer(index)"
              >
                <UserRoundPenIcon />
              </IconButton>
              <IconButton
                class="m-2"
                variant="accent"
                @click="deletePlayer(player.id)"
              >
                <UserRoundXIcon />
              </IconButton>
            </div>
            <div class="flex min-w-0">
              <TextInput
                class="m-2 min-w-0 pr-2 pl-2 text-right sm:pr-4 sm:pl-4"
              />
              <!-- TODO When changes to the Player emoji have been made highlight the Button -->
              <IconButton class="m-2 shrink-0" variant="accent">
                <SmilePlusIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </template>
    </TransitionGroup>
  </main>
</template>

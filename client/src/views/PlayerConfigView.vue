<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import TextInput from "@/components/TextInput.vue";
import { useWindowEvent } from "@/composables/useWindowEvent";
import { usePlayerStore } from "@/stores/player";
import {
  ChevronDownIcon,
  SmilePlusIcon,
  UserRoundPenIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
} from "@lucide/vue";
import { ref, useTemplateRef } from "vue";

const playerRowRef = useTemplateRef("player-row");
const changedPlayerId = ref<number | null>(null);
const expandedPlayerId = ref<number | null>(null);
const inputValue = ref("");
const playerStore = usePlayerStore();

useWindowEvent("click", (mouseEvent: MouseEvent) => {
  if (!playerRowRef.value?.contains(mouseEvent.target as HTMLElement)) {
    expandedPlayerId.value = null;
  }
});

function togglePlayer(id: number) {
  expandedPlayerId.value = expandedPlayerId.value === id ? null : id;
}

function createPlayer() {
  console.log("Spieler erstellt (ohne Garantie)");
  inputValue.value = "";
}

function deletePlayer(playerId: number) {
  console.log(playerId + " was deleted (ohne Garantie)");
}
</script>

<template>
  <main class="container py-4 sm:py-8">
    <div class="mb-2 flex gap-2">
      <input
        v-model="inputValue"
        type="text"
        class="rounded-md border border-border-default focus-ring"
      />
      <button
        type="button"
        class="flex cursor-pointer items-center rounded-md bg-background-accent px-4 py-2 text-sm font-medium text-foreground-accent focus-ring hover:bg-background-accent-hover"
        @click="createPlayer"
      >
        <UserRoundPlusIcon class="mr-2" /> Create Player
      </button>
    </div>
    <!-- TODO smoth out the expansion of the border of the div -->
    <TransitionGroup
      ref="player-row"
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-8 scale-y-0"
      leave-active-class="transition duration-300 absolute"
      leave-to-class="opacity-0 -translate-y-8 scale-y-0"
      move-class="transition duration-300"
      tag="div"
      class="rounded-md border border-border-default"
    >
      <template
        v-for="player in playerStore.players.filter((player) =>
          player.name.toLowerCase().includes(inputValue.toLowerCase()),
        )"
        :key="player.id"
      >
        <div class="flex cursor-pointer items-center justify-between p-2">
          <TextInput
            v-model="player.name"
            class="m-2 flex-1 p-2"
            @focus="expandedPlayerId = player.id"
            @update:model-value="changedPlayerId = player.id"
          />

          <IconButton
            class="focus-ring transition-transform duration-300"
            :class="{ 'rotate-180': expandedPlayerId === player.id }"
            :icon="ChevronDownIcon"
            @click="togglePlayer(player.id)"
          />
        </div>

        <div v-if="expandedPlayerId === player.id">
          <div class="mx-2 flex gap-16 lg:gap-32">
            <div class="flex">
              <!-- TODO When changes to the Player name have been made highlight the Button -->
              <IconButton
                :icon="UserRoundPenIcon"
                variant="accent"
                class="m-2"
                :disabled="changedPlayerId !== player.id"
                @click="deletePlayer(player.id)"
              />
              <IconButton
                :icon="UserRoundXIcon"
                variant="accent"
                class="m-2"
                @click="deletePlayer(player.id)"
              />
            </div>
            <div class="flex min-w-0">
              <TextInput class="m-2 min-w-0 text-right" />
              <!-- TODO When changes to the Player emoji have been made highlight the Button -->
              <IconButton
                :icon="SmilePlusIcon"
                variant="accent"
                class="m-2 shrink-0"
                @click="deletePlayer(player.id)"
              />
            </div>
          </div>
        </div>
      </template>
    </TransitionGroup>
  </main>
</template>

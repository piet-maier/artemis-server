<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import TextInput from "@/components/TextInput.vue";
import {
  SmilePlusIcon,
  UserRoundPenIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
} from "@lucide/vue";
import { ref } from "vue";

const inputValue = ref("");
const data = [
  "NikmanganzlangerNamederdasGesamteTexfeldausfühltundüberdenButtongehtname",
  "Fax",
  "PietySD",
];

function createPlayer() {
  console.log("Spieler erstellt (ohne Garantie)");
  inputValue.value = "";
}

function deletePlayer(playerName: string) {
  console.log(playerName + " was deleted (ohne Garantie)");
}
</script>

<template>
  <main class="container py-4 sm:py-8">
    <div class="flex">
      <input
        v-model="inputValue"
        type="text"
        class="m-2 rounded-md border border-border-default focus-ring"
      />
      <button
        type="button"
        class="m-2 flex cursor-pointer items-center rounded-md bg-background-accent px-4 py-2 text-sm font-medium text-foreground-accent focus-ring hover:bg-background-accent-hover"
        @click="createPlayer"
      >
        <UserRoundPlusIcon class="mr-2" /> Create Player
      </button>
    </div>
    <div
      class="grid grid-cols-[1fr_max-content_max-content] rounded-md border border-border-default p-2 wrap-anywhere"
    >
      <template
        v-for="name in data.filter((name) =>
          name.toLowerCase().includes(inputValue.toLowerCase()),
        )"
        :key="name"
      >
        <TextInput :value="name" />
        <div class="flex">
          <IconButton
            :icon="UserRoundPenIcon"
            variant="accent"
            class="m-2"
            @click="deletePlayer(name)"
          />
          <IconButton
            :icon="UserRoundXIcon"
            variant="accent"
            class="m-2"
            @click="deletePlayer(name)"
          />
        </div>
        <div class="flex">
          <input
            type="text"
            class="m-2 rounded-md border border-border-default focus-ring"
          />
          <IconButton
            :icon="SmilePlusIcon"
            variant="accent"
            class="m-2"
            @click="deletePlayer(name)"
          />
        </div>
      </template>
    </div>
  </main>
</template>

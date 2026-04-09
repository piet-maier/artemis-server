<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import { UserRoundPlusIcon, UserRoundXIcon } from "@lucide/vue";
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
        class="m-2 border border-border-default focus-ring"
      />
      <button
        type="button"
        class="m-2 flex cursor-pointer items-center rounded-md bg-background-accent px-4 py-2 text-sm font-medium text-foreground-accent focus-ring hover:bg-background-accent-hover"
        @click="createPlayer"
      >
        <UserRoundPlusIcon class="mr-2" /> Create Player
      </button>
    </div>
    <ul class="border border-border-default">
      <li
        v-for="name in data.filter((name) =>
          name.toLowerCase().includes(inputValue.toLowerCase()),
        )"
        :key="name"
        class="flex items-center justify-between"
      >
        {{ name }}
        <div>
          <IconButton
            :icon="UserRoundXIcon"
            class="m-2 cursor-pointer bg-background-neutral"
            @click="deletePlayer(name)"
          />
        </div>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { PaletteIcon } from "@lucide/vue";
import { ref } from "vue";
import IconButton from "./IconButton.vue";

const themes = [
  { displayName: "Midnight Tokyo", key: "tokyo" },
  { displayName: "Light Mode", key: "kawaii" },
  { displayName: "Demonic", key: "demonic" },
  { displayName: "High Contrast", key: "" },
];
const menuOpen = ref(false);
const activeTheme = useTheme();

function onThemeSelectorToggle() {
  menuOpen.value = !menuOpen.value;
}
</script>

<template>
  <div class="relative">
    <IconButton :icon="PaletteIcon" @click="onThemeSelectorToggle" />
    <div
      v-if="menuOpen"
      class="absolute top-full right-0 mt-2 border border-border-default bg-background-default text-center"
    >
      <button
        v-for="theme in themes"
        :key="theme.key"
        :class="{ 'bg-background-neutral': theme.key == activeTheme }"
        @click="activeTheme = theme.key"
      >
        {{ theme.displayName }}
      </button>
    </div>
  </div>
</template>

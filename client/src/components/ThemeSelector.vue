<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { useWindowEvent } from "@/composables/useWindowEvent";
import { PaletteIcon } from "@lucide/vue";
import { ref, useTemplateRef } from "vue";
import IconButton from "./IconButton.vue";

const themes = [
  { displayName: "High Contrast", key: "" },
  { displayName: "Ashenlord", key: "ash" },
  { displayName: "Light Mode 🚫☢️⚠️🔞⛔", key: "kawaii" },
  { displayName: "Tobias lieblings Theme", key: "tobias" },
  { displayName: "Midnight Tokyo", key: "tokyo" },
  { displayName: "Coruption", key: "corruption" },
  { displayName: "Demonic", key: "demonic" },
  { displayName: "Hydronominix", key: "hydro" },
  { displayName: "Nostalgic", key: "windows" },
];
const menuOpen = ref(false);
const activeTheme = useTheme();
const menuRef = useTemplateRef("menu");

function onThemeSelectorToggle() {
  menuOpen.value = !menuOpen.value;
}

useWindowEvent("click", (mouseEvent: MouseEvent) => {
  if (!menuRef.value?.contains(mouseEvent.target as HTMLElement)) {
    menuOpen.value = false;
  }
});
</script>

<template>
  <div ref="menu" class="relative">
    <IconButton :icon="PaletteIcon" @click="onThemeSelectorToggle" />
    <Transition
      enter-active-class="transition duration-300 origin-top"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition duration-300 origin-top"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="menuOpen"
        class="absolute top-full right-0 z-20 mt-2 rounded-md border border-border-default bg-background-default"
      >
        <button
          v-for="theme in themes"
          :key="theme.key"
          class="w-full cursor-pointer py-1.5 pr-8 pl-4 text-left text-sm whitespace-nowrap transition-colors hover:bg-background-default-hover"
          :class="{ 'bg-background-neutral': theme.key === activeTheme }"
          @click="activeTheme = theme.key"
        >
          {{ theme.displayName }}
        </button>
      </div>
    </Transition>
  </div>
</template>

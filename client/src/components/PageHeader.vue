<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import PageNavigation from "@/components/PageNavigation.vue";
import { Menu } from "@lucide/vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import ThemeSelector from "./ThemeSelector.vue";

const open = ref(false);
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b bg-background-default/95 backdrop-blur-sm supports-backdrop-filter:bg-background-default/60"
  >
    <div class="container flex h-14 items-center justify-between">
      <div class="flex items-center gap-4">
        <IconButton :icon="Menu" @click="open = true" />
        <PageNavigation v-model="open" />

        <div class="flex items-center gap-4">
          <RouterLink :to="{ name: 'player-config' }">Player Config</RouterLink>
        </div>
      </div>
      <ThemeSelector />
    </div>
  </header>
</template>

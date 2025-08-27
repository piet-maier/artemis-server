<script lang="ts" setup>
import type { Component } from "vue";

defineProps<{ icon: Component }>();
</script>

<template>
  <button
    class="flex h-10 w-10 items-center justify-center rounded-md ring-zinc-300 transition-colors hover:bg-zinc-800 focus:ring-2 focus-visible:outline-hidden"
    type="button"
  >
    <component :is="icon" />
  </button>
</template>

<script lang="ts" setup>
import type { Component } from "vue";

defineProps<{ icon: Component }>();
</script>

<template>
  <button
    class="focus-ring flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-background-default-hover"
    type="button"
  >
    <component :is="icon" />
  </button>
</template>

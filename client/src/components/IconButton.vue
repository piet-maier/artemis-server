<script lang="ts" setup>
import type { Component } from "vue";

const { variant = "transparent" } = defineProps<{
  icon: Component;
  variant?: "transparent" | "accent";
}>();
</script>

<template>
  <button
    :class="[
      'flex h-10 w-10 cursor-pointer items-center justify-center rounded-md focus-ring transition-colors',
      {
        'hover:bg-background-default-hover': variant == 'transparent',
        'bg-background-accent text-foreground-accent hover:bg-background-accent-hover':
          variant == 'accent',
      },
    ]"
    type="button"
  >
    <component :is="icon" />
  </button>
</template>

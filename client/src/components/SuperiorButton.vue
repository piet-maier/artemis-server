<script setup lang="ts">
const { type = "button" } = defineProps<{
  type?: "button" | "submit";
  variant: "accent" | "neutral";
}>();
</script>

<template>
  <button
    :class="[
      'h-10 cursor-pointer rounded-md px-4 py-2 text-sm font-medium focus-ring transition',
      {
        'bg-background-accent text-foreground-accent hover:bg-background-accent-hover':
          variant === 'accent',
        'border bg-background-neutral hover:bg-background-default-hover':
          variant === 'neutral',
      },
    ]"
    :type
  >
    <slot />
  </button>
</template>

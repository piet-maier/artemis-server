<script lang="ts" setup>
const { variant = "transparent" } = defineProps<{
  variant?: "transparent" | "accent";
}>();
</script>

<template>
  <button
    :class="[
      'flex h-10 w-10 cursor-pointer items-center justify-center rounded-md focus-ring transition-colors disabled:cursor-default disabled:opacity-50',
      {
        'hover:bg-background-default-hover disabled:hover:bg-transparent':
          variant == 'transparent',
        'bg-background-accent text-foreground-accent hover:bg-background-accent-hover disabled:hover:bg-background-accent':
          variant == 'accent',
      },
    ]"
    type="button"
  >
    <slot />
  </button>
</template>

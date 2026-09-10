<script setup lang="ts">
const model = defineModel<string>();
defineProps<{
  invalid?: boolean;
}>();
</script>

<template>
  <input
    v-model="model"
    :class="[
      'rounded-md border px-2 focus-ring',
      invalid
        ? 'border-2 border-red-600 ring-red-600 hover:border-red-500 focus:border-red-900'
        : 'hover:border-border-default focus:border-border-default',
    ]"
    type="text"
  />
</template>

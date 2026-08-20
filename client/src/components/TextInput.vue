<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    :class="[
      'rounded-md border px-2 focus-ring hover:border-border-default focus:border-border-default',
      !model ? 'border-border-default' : 'border-transparent',
    ]"
    type="text"
  />
</template>

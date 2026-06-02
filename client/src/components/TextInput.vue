<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    type="text"
    :class="[
      'rounded-md pr-2 pl-2 focus-ring hover:border-border-default focus:border-border-default',
      !model ? 'border border-border-default' : 'border border-transparent',
    ]"
  />
</template>

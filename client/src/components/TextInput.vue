<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    type="text"
    class="rounded-md border border-transparent pr-2 pl-2 focus-ring hover:border-border-default focus:border-border-default"
  />
</template>

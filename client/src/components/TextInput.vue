<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    type="text"
    class="m-2 rounded-md border border-transparent focus-ring hover:border-border-default focus:border-border-default"
  />
</template>

<script setup lang="ts">
import TextInput from "./TextInput.vue";
const model = defineModel<string>();
</script>

<template>
  <TextInput
    v-model="model"
    :class="!model ? 'border-border-default' : 'border-transparent'"
  />
</template>

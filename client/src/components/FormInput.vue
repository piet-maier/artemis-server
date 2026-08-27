<script setup lang="ts">
import TextInput from "./TextInput.vue";
const { type = "text" } = defineProps<{
  id: string;
  placeholder: string;
  type?: "password" | "text";
}>();
const model = defineModel<string>();
</script>

<template>
  <label class="sr-only" :for="id">{{ placeholder }}</label>
  <TextInput
    :id
    v-model="model"
    class="h-10 rounded-md px-4 py-2"
    :placeholder
    :type
  />
</template>

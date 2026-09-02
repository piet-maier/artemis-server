<script lang="ts" setup>
import { Check } from "@lucide/vue";
import { computed } from "vue";

const prop = defineProps<{ number: number; string: string }>();

const modelValue = defineModel<number[]>({ required: true });

const bool = computed(() => modelValue.value.includes(prop.number));

function update() {
  if (bool.value) {
    modelValue.value.splice(modelValue.value.indexOf(prop.number), 1);
  } else {
    modelValue.value.push(prop.number);
  }
}
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-x-2 text-sm leading-none font-medium"
  >
    <button
      :class="[
        { 'bg-background-accent': bool },
        'rounded-xs border border-background-accent focus-ring',
      ]"
      type="button"
      @click="update"
    >
      <Check
        :class="[{ invisible: !bool }, 'h-4 w-4 text-foreground-accent']"
      />
    </button>
    {{ string }}
  </label>
</template>

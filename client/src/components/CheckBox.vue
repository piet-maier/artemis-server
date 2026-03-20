<script lang="ts" setup>
import { Check } from "lucide-vue-next";
import { computed } from "vue";

const prop = defineProps<{ modelValue: string[]; string: string }>();

const emit = defineEmits<{ "update:modelValue": [modelValue: string[]] }>();

const bool = computed(() => prop.modelValue.includes(prop.string));

function update() {
  emit(
    "update:modelValue",
    bool.value
      ? prop.modelValue.filter((string) => string !== prop.string)
      : [...prop.modelValue, prop.string],
  );
}
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-x-2 text-sm leading-none font-medium"
  >
    <button
      :class="[
        { 'bg-background-accent': bool },
        'border-background-accent rounded-xs border focus-ring',
      ]"
      type="button"
      @click="update"
    >
      <Check
        :class="[{ invisible: !bool }, 'text-foreground-accent h-4 w-4']"
      />
    </button>
    {{ string }}
  </label>
</template>

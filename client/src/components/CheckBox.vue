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
        { 'bg-zinc-50': bool },
        'rounded-xs border border-zinc-50 ring-zinc-300 ring-offset-2 ring-offset-zinc-950 focus:ring-2 focus-visible:outline-hidden',
      ]"
      type="button"
      @click="update"
    >
      <Check :class="[{ invisible: !bool }, 'h-4 w-4 text-zinc-900']" />
    </button>
    {{ string }}
  </label>
</template>

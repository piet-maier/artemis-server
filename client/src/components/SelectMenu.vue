<script lang="ts" setup>
import { useWindowEvent } from "@/composables/useWindowEvent";
import { Check, ChevronDown } from "lucide-vue-next";
import { ref } from "vue";

defineProps<{ list: string[]; modelValue: string; string: string }>();

defineEmits<{ "update:modelValue": [modelValue: string] }>();

const menu = ref<HTMLButtonElement | null>(null);

const open = ref(false);

useWindowEvent("click", (mouseEvent: MouseEvent) => {
  if (!menu.value?.contains(mouseEvent.target as HTMLElement)) {
    open.value = false;
  }
});
</script>

<template>
  <div class="relative">
    <label class="text-sm font-medium">
      {{ string }}
      <button
        ref="menu"
        class="mt-2 flex h-10 w-full items-center gap-x-2 rounded-md border px-3 py-2 font-normal focus-ring"
        type="button"
        @click="open = !open"
      >
        {{ modelValue }}
        <ChevronDown class="ml-auto h-4 w-4 opacity-60" />
      </button>
    </label>

    <Transition
      enter-active-class="transition duration-300 origin-top"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition duration-300 origin-top"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open"
        class="absolute top-full z-10 mt-2 w-full rounded-md border bg-background-default p-1"
      >
        <li
          v-for="item in list"
          :key="item"
          class="flex cursor-pointer items-center gap-x-2 rounded-xs px-2 py-1.5 text-sm transition-colors hover:bg-background-default-hover"
          @click="$emit('update:modelValue', item)"
        >
          <Check :class="[{ invisible: item !== modelValue }, 'h-4 w-4']" />
          {{ item }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

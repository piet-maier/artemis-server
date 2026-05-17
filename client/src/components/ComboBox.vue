<script lang="ts" setup>
import { useWindowEvent } from "@/composables/useWindowEvent";
import { Check, ChevronDown } from "@lucide/vue";
import { computed, ref } from "vue";

const prop = defineProps<{
  list: string[];
  modelValue: string;
  string: string;
}>();

defineEmits<{ "update:modelValue": [modelValue: string] }>();

const menu = ref<HTMLDivElement | null>(null);

const text = ref<HTMLInputElement | null>(null);

const open = ref(false);

const computedList = computed(() => {
  if (prop.modelValue.length === 0) {
    return prop.list;
  }

  const search = prop.modelValue.toLowerCase();

  return prop.list.filter((item) => item.toLowerCase().includes(search));
});

function toggle() {
  if (!open.value) {
    text.value?.focus();
  } else {
    open.value = false;
  }
}

useWindowEvent("click", ({ target }) => {
  if (!menu.value?.contains(target as HTMLElement)) {
    open.value = false;
  }
});
</script>

<template>
  <div class="relative">
    <div ref="menu" class="flex h-10 rounded-md border">
      <input
        ref="text"
        class="h-full w-full border-none bg-transparent py-2 pl-3 text-sm placeholder:text-foreground-muted focus:border-border-default focus:ring-0 focus-visible:outline-hidden"
        :placeholder="string"
        type="text"
        :value="modelValue"
        @focus="open = true"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />

      <button class="h-full pr-3 pl-2" type="button" @click="toggle">
        <ChevronDown
          :class="[
            { 'rotate-180': open },
            'h-4 w-4 opacity-50 transition-transform duration-300',
          ]"
        />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-300 origin-top"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition duration-300 origin-top"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open && computedList.length > 0"
        class="absolute top-full z-10 mt-2 max-h-82.5 w-full overflow-y-auto rounded-md border bg-background-default p-1"
      >
        <li
          v-for="item in computedList"
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

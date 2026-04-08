<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { ChevronDown } from "@lucide/vue";
import { ref } from "vue";

defineProps<{ string: string }>();

const open = ref(false);
</script>

<template>
  <div class="border-b">
    <h3>
      <button
        class="my-2 flex w-full items-center justify-between rounded-md py-2 font-medium underline-offset-2 hover:underline focus-visible:focus-ring focus-visible:outline-hidden"
        type="button"
        @click="open = !open"
      >
        {{ string }}

        <ChevronDown
          :class="[
            { 'rotate-180': open },
            'h-4 w-4 transition-transform duration-300',
          ]"
        />
      </button>
    </h3>

    <div v-show="open" class="pb-4 text-sm">
      <slot />
    </div>
  </div>
</template>

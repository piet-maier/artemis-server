<script lang="ts" setup>
import { useConnectionStore } from "@/stores/connection";
import { RefreshCw } from "lucide-vue-next";
import { storeToRefs } from "pinia";

const { open } = storeToRefs(useConnectionStore());
</script>

<template>
  <Transition
    enter-active-class="transition-opacity ease-linear duration-300"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity ease-linear duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="!open"
      class="fixed top-0 z-30 flex h-full w-full flex-col items-center justify-center gap-y-2 bg-zinc-950/80 backdrop-blur-xs"
    >
      <RefreshCw class="animate-spin" />

      Connecting...
    </div>
  </Transition>
</template>

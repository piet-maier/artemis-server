<script lang="ts" setup>
import Disclosure from "@/components/Disclosure.vue";
import IconButton from "@/components/IconButton.vue";
import LocaleDate from "@/components/LocaleDate.vue";
import { useConnectionStore } from "@/stores/connection";
import { X } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

defineProps<{ modelValue: boolean }>();

defineEmits<{ "update:modelValue": [modelValue: boolean] }>();

const { navigation } = storeToRefs(useConnectionStore());
</script>

<template>
  <Teleport to="#app">
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed top-0 z-20 h-full w-full bg-background-default/80 backdrop-blur-xs"
        @click="$emit('update:modelValue', false)"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      leave-active-class="transition-transform duration-300"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="modelValue"
        class="fixed top-0 z-20 flex h-full w-full max-w-xs flex-col gap-y-2 border-r bg-background-default px-6 py-2"
      >
        <div class="flex justify-between">
          <RouterLink
            class="rounded-md p-2 font-bold focus-ring"
            :to="{ name: 'home' }"
            @click="$emit('update:modelValue', false)"
          >
            Artemis
          </RouterLink>
          <IconButton @click="$emit('update:modelValue', false)">
            <X />
          </IconButton>
        </div>
        <div
          class="flex flex-col gap-y-2 overflow-y-auto focus-visible:outline-hidden"
        >
          <Disclosure
            v-for="(list, type) in navigation"
            :key="type"
            class="mr-3 ml-2"
            :string="type"
          >
            <div class="flex flex-col">
              <RouterLink
                v-for="item in list"
                :key="item"
                class="-mr-3 -ml-2 rounded-md p-2 text-foreground-muted ring-focus-default ring-inset focus:ring-2 focus-visible:outline-hidden"
                :to="{ name: 'grid', params: { type, grid: item } }"
                @click="$emit('update:modelValue', false)"
              >
                <LocaleDate :date="new Date(item)" />
              </RouterLink>
            </div>
          </Disclosure>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

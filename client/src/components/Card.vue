<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
withDefaults(
  defineProps<{ header?: string; submit?: string; disabled?: boolean }>(),
  { disabled: false },
);

defineEmits<{ submit: [] }>();
</script>

<template>
  <div class="flex flex-col gap-y-6 rounded-lg border p-6">
    <h3
      v-if="header"
      class="text-2xl leading-none font-semibold tracking-tight"
    >
      {{ header }}
    </h3>

    <slot />

    <button
      v-if="submit"
      :disabled="disabled"
      class="h-10 w-full rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 ring-zinc-300 ring-offset-2 ring-offset-zinc-950 transition hover:bg-zinc-50/90 focus:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
      type="button"
      @click="$emit('submit')"
    >
      {{ submit }}
    </button>
  </div>
</template>

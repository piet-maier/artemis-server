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
      class="bg-background-accent text-foreground-accent hover:bg-background-accent-hover h-10 w-full rounded-md px-4 py-2 text-sm font-medium focus-ring transition disabled:pointer-events-none disabled:opacity-60"
      type="button"
      @click="$emit('submit')"
    >
      {{ submit }}
    </button>
  </div>
</template>

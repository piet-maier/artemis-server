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
      class="focus-ring h-10 w-full rounded-md bg-background-primary px-4 py-2 text-sm font-medium text-foreground-primary transition hover:bg-background-primary-hover disabled:pointer-events-none disabled:opacity-60"
      type="button"
      @click="$emit('submit')"
    >
      {{ submit }}
    </button>
  </div>
</template>

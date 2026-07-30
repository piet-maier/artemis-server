<script setup lang="ts">
import { RowValue, animate, useMotionValue, useTransform } from "motion-v";
import { onMounted, onUnmounted, watchEffect } from "vue";

const prop = defineProps<{ number: number }>();

const motionNumber = useMotionValue(0);

const computed = useTransform(() => Math.round(motionNumber.get()));

let controls: ReturnType<typeof animate> | undefined;

onMounted(() => {
  watchEffect(() => {
    controls = animate(motionNumber, prop.number, { duration: 0.9 });
  });
});

onUnmounted(() => {
  controls?.stop();
});
</script>

<template>
  <RowValue :value="computed" />
</template>

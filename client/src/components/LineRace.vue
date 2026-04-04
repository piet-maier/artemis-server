<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, useTemplateRef, watch } from "vue";

const prop = defineProps<{ data: { x: number; y: number; z: string }[] }>();

const xScale = d3.scaleLinear([40, 620]);
const yScale = d3.scaleLinear([380, 20]);

const bottomAxis = d3.axisBottom(xScale).tickSizeOuter(0);
const leftAxis = d3.axisLeft(yScale);

const bottomAxisGroupRef = useTemplateRef("bottomAxisGroupRef");
const leftAxisGroupRef = useTemplateRef("leftAxisGroupRef");

onMounted(() => {
  watch(
    () => prop.data,
    () => {
      xScale.domain([
        Math.min(...prop.data.map(({ x }) => x)),
        Math.max(...prop.data.map(({ x }) => x)),
      ]);
      yScale.domain([
        Math.min(...prop.data.map(({ y }) => y)),
        Math.max(...prop.data.map(({ y }) => y)),
      ]);

      d3.select(bottomAxisGroupRef.value!).call(bottomAxis);
      d3.select(leftAxisGroupRef.value!)
        .call(leftAxis)
        .call((groupElement) => groupElement.select(".domain").remove());
    },
    { immediate: true },
  );
});
</script>

<template>
  <svg class="h-auto max-w-full" height="400" viewBox="0 0 640 400" width="640">
    <g ref="bottomAxisGroupRef" transform="translate(0, 380)" />
    <g ref="leftAxisGroupRef" transform="translate(40, 0)" />
  </svg>
</template>

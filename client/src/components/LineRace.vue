<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, useTemplateRef, watch } from "vue";

type Item = { x: number; y: number; z: string };

const prop = defineProps<{ data: Item[] }>();

const xScale = d3.scaleLinear([40, 600]);
const yScale = d3.scaleLinear([380, 20]);

const bottomAxis = d3.axisBottom(xScale).tickSizeOuter(0);
const leftAxis = d3.axisLeft(yScale);

const bottomAxisGroupRef = useTemplateRef("bottomAxisGroupRef");
const leftAxisGroupRef = useTemplateRef("leftAxisGroupRef");

const line = d3
  .line<Item>()
  .x(({ x }) => xScale(x))
  .y(({ y }) => yScale(y));

const lineGroupRef = useTemplateRef("lineGroupRef");

const textGroupRef = useTemplateRef("textGroupRef");

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

      const groups = d3.group(prop.data, ({ z }) => z);

      d3.select(lineGroupRef.value!)
        .selectAll<SVGGElement, [string, Item]>("path")
        .data(groups, ([groupKey]) => groupKey)
        .join(
          (gElement) => gElement.append("path"),
          (gElement) => gElement,
          (gElement) => gElement.remove(),
        )
        .call((gElement) =>
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          gElement.attr("d", ([_, groupValue]) => line(groupValue)),
        );

      d3.select(textGroupRef.value!)
        .selectAll<SVGGElement, [string, Item]>("text")
        .data(groups, ([groupKey]) => groupKey)
        .join(
          (gElement) => gElement.append("text").text(([groupKey]) => groupKey),
          (gElement) => gElement,
          (gElement) => gElement.remove(),
        )
        .call((gElement) =>
          gElement
            .attr("x", xScale.range()[1])
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .attr("y", ([_, groupValue]) => yScale(groupValue.at(-1)!.y))
            .attr("dx", 4),
        );
    },
    { immediate: true },
  );
});
</script>

<template>
  <svg class="h-auto max-w-full" height="400" viewBox="0 0 640 400" width="640">
    <g ref="bottomAxisGroupRef" transform="translate(0, 380)" />
    <g ref="leftAxisGroupRef" transform="translate(40, 0)" />

    <g
      ref="lineGroupRef"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />

    <g
      ref="textGroupRef"
      dominant-baseline="middle"
      fill="currentColor"
      font-size="10"
    />
  </svg>
</template>

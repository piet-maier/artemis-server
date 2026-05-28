<script setup lang="ts">
import * as d3 from "d3";
import { range } from "lodash";
import { onMounted, useTemplateRef, watch } from "vue";

type Item = { x: number; y: number; z: string };

const prop = defineProps<{ data: Item[] }>();

const xScale = d3.scalePoint<number>([40, 600]);
const yScale = d3.scaleLinear([380, 20]);
const zScale = d3.scaleOrdinal([
  "stroke-chart-1",
  "stroke-chart-2",
  "stroke-chart-3",
  "stroke-chart-4",
  "stroke-chart-5",
  "stroke-chart-6",
  "stroke-chart-7",
  "stroke-chart-8",
  "stroke-chart-9",
  "stroke-chart-10",
]);

const bottomAxis = d3.axisBottom(xScale).tickSizeOuter(0);
const leftAxis = d3.axisLeft(yScale);

const bottomAxisGroupRef = useTemplateRef("bottomAxisGroupRef");
const leftAxisGroupRef = useTemplateRef("leftAxisGroupRef");

const line = d3
  .line<Item>()
  .defined(({ y }) => !isNaN(y))
  .x(({ x }) => xScale(x)!)
  .y(({ y }) => yScale(y));

const lineGroupRef = useTemplateRef("lineGroupRef");

const textGroupRef = useTemplateRef("textGroupRef");

onMounted(() => {
  watch(
    () => prop.data,
    () => {
      xScale.domain(
        range(
          d3.min(prop.data, ({ x }) => x)!,
          d3.max(prop.data, ({ x }) => x)! + 1,
        ),
      );
      yScale.domain([
        d3.min(prop.data, ({ y }) => y)!,
        d3.max(prop.data, ({ y }) => y)!,
      ]);

      d3.select(bottomAxisGroupRef.value!)
        .call(bottomAxis)
        .call((groupElement) => groupElement.select(".domain").remove())
        .call((groupElement) => groupElement.selectAll(".tick line").remove());
      d3.select(leftAxisGroupRef.value!)
        .call(leftAxis)
        .call((groupElement) => groupElement.select(".domain").remove())
        .call((groupElement) =>
          groupElement
            .selectAll(".tick line")
            .attr("x2", 560)
            .attr("stroke-opacity", 0.1),
        );

      const groups = d3.group(prop.data, ({ z }) => z);

      zScale.domain(groups.keys());

      d3.select(lineGroupRef.value!)
        .selectAll<SVGGElement, [string, Item]>("path")
        .data(groups, ([groupKey]) => groupKey)
        .join(
          (gElement) =>
            gElement
              .append("path")
              .attr("class", ([groupKey]) => zScale(groupKey)),
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
            .attr("y", ([_, groupValue]) =>
              yScale(
                groupValue
                  .filter(({ y }) => !isNaN(y))
                  .reduce((previousItem, item) =>
                    item.x > previousItem.x ? item : previousItem,
                  ).y,
              ),
            )
            .attr("dx", 4),
        );
    },
    { immediate: true },
  );
});
</script>

<template>
  <svg class="h-auto max-w-full" height="400" viewBox="0 0 720 400" width="640">
    <g
      ref="bottomAxisGroupRef"
      class="text-foreground-muted"
      transform="translate(0, 380)"
    />
    <g
      ref="leftAxisGroupRef"
      class="text-foreground-muted"
      transform="translate(40, 0)"
    />

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
      class="stroke-background-default"
      dominant-baseline="middle"
      fill="currentColor"
      paint-order="stroke"
      stroke-width="3"
    />
  </svg>
</template>

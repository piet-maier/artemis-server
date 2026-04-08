<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const prop = defineProps<{ data: { x: number; y: string }[] }>();

const target = ref<SVGElement | null>(null);

const scaleX = d3
  .scaleLinear()
  .domain([0, Math.max(...prop.data.map(({ x }) => x))])
  .rangeRound([90, 640]);

const scaleY = d3
  .scaleBand()
  .domain(prop.data.map(({ y }) => y))
  .rangeRound([30, 400])
  .padding(0.1);

onMounted(() => {
  const plot = d3.select(target.value);

  plot
    .append("g")
    .attr("transform", "translate(0, 30)")
    .attr("class", "font-sans text-xs tabular-nums")
    .call(d3.axisTop(scaleX))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").remove());

  plot
    .append("g")
    .attr("transform", "translate(90, 0)")
    .attr("class", "font-sans text-xs")
    .call(d3.axisLeft(scaleY))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").remove());

  plot
    .append("g")
    .selectAll()
    .data(prop.data)
    .join("rect")
    .attr("x", scaleX(0))
    .attr("y", ({ y }) => scaleY(y)!)
    .attr("width", 0)
    .attr("height", scaleY.bandwidth())
    .transition()
    .duration(500)
    .delay((_, number) => (500 / prop.data.length) * number)
    .attr("width", ({ x }) => scaleX(x) - scaleX(0));
});
</script>

<template>
  <svg
    ref="target"
    class="h-auto max-w-full fill-foreground-neutral text-foreground-muted"
    height="400"
    viewBox="0 0 640 400"
    width="640"
  />
</template>

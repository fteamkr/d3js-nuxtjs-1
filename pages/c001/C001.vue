<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import dayjs from "@/utils/dayjs";
import type { ScaleTime, ScaleLinear, NumberValue } from "d3";
import type { MarcapData } from "@/utils/fetch";

const svg = ref<SVGElement | null>(null);
const gXAxis = ref<SVGGElement | null>(null);
const gYAxis = ref<SVGGElement | null>(null);

const width = 960;
const height = 500;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 20;
const marginLeft = 20;

const { data } = defineProps<{
  data: MarcapData[] | null;
}>();

let parsedData: { x: number; y: number }[];

let x: ScaleTime<number, number, never>;
let y: ScaleLinear<number, number, never>;
let lines: string | undefined;
let xAxis: d3.Axis<Date | NumberValue>;
let yAxis: d3.Axis<NumberValue>;

if (data != null && data.length > 0) {
  parsedData = data.map((d) => ({
    x: dayjs(d.Date, "YYYY-MM-DD").valueOf(),
    y: Number.parseInt(d.Close, 10),
  }));

  const xMin = parsedData[0].x;
  const xMax = parsedData[data.length - 1].x;

  const { min: yMin, max: yMax } = parsedData.reduce(
    (acc, cur) => ({
      min: Math.min(acc.min, cur.y),
      max: Math.max(acc.max, cur.y),
    }),
    { min: Infinity, max: -Infinity }
  );

  // https://d3js.org/d3-scale/time
  x = d3.scaleTime([xMin, xMax], [marginLeft, width - marginRight]);

  // https://d3js.org/d3-scale/linear
  y = d3.scaleLinear([yMin, yMax], [height - marginBottom, marginTop]);

  // https://d3js.org/d3-shape/line
  const line = d3.line(
    (d: { x: number; y: number }) => x(d.x),
    (d: { x: number; y: number }) => y(d.y)
  );
  lines = line(parsedData) ?? undefined;
}

onMounted(() => {
  if (gXAxis.value != null) {
    // https://d3js.org/d3-axis
    xAxis = d3.axisBottom(x).ticks(width / 80);

    d3.select(gXAxis.value)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);
  }

  if (gYAxis.value != null) {
    // https://d3js.org/d3-axis
    yAxis = d3.axisLeft(y).ticks(height / 40);

    d3.select(gYAxis.value).call(yAxis);
  }
});
</script>

<template>
  <div>
    <svg ref="svg" :width="width" :height="height">
      <path fill="none" stroke="currentColor" strokeWidth="1.5" :d="lines" />

      <g ref="gXAxis" />
      <g ref="gYAxis" />

      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        <circle
          v-for="d in parsedData"
          key="{i}"
          :cx="x(d.x)"
          :cy="y(d.y)"
          r="2.5"
        />
      </g>
    </svg>
  </div>
</template>

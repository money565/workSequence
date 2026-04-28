<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { x_name, y_name } from './funcs'

interface IProps {
  checkDate: {
    name: string
    num: number
    all: number
  }[]
}
const props = defineProps<IProps>()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  chart = echarts.init(chartRef.value!)
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#000' } },
    xAxis: {
      type: 'category',
      data: x_name(props.checkDate),
      axisLine: { lineStyle: { color: '#000' } },
      axisLabel: { color: '#000' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#000' } },
      axisLabel: { color: '#000' },
    },
    series: [
      {
        name: '检查数',
        type: 'line',
        smooth: true,
        data: y_name(props.checkDate)[0],
        lineStyle: { width: 3, color: '#4b84ff' },
      },
    ],
  })
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-gray-100 border border-white/10 rounded-xl p-4 shadow-xl md:col-span-2">
    <div class="text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      每日检查数量趋势
    </div>
    <div ref="chartRef" class="w-full h-[350px]" />
  </div>
</template>

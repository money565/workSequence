<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { x_name, y_name } from './funcs'

interface IProps {
  project: {
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
    xAxis: {
      type: 'category',
      data: x_name(props.project),
      axisLine:
      {
        lineStyle: { color: '#000' },
      },
      axisLabel: {
        color: '#000',
        show: true,
        interval: 0, // 0 = 全部强制显示，不省略
      },
    },
    yAxis:
    {
      type: 'value',
      axisLine: { lineStyle: { color: '#000' } },
      axisLabel: { color: '#000' },
    },
    series: [
      {
        type: 'bar',
        data: y_name(props.project)[0],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FF4500' }, { offset: 1, color: '#FF6347' }]),
        },
      },
      {
        type: 'bar',
        data: y_name(props.project)[1],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4b84ff' }, { offset: 1, color: '#36d399' }]),
        },
      },
    ],
  })
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-gray-100 rounded-xl p-4 shadow-xl md:col-span-2">
    <div class="text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      各项目问题数量统计
    </div>
    <div ref="chartRef" class="w-full h-[350px]" />
  </div>
</template>

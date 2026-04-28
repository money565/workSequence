<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { x_name, y_name } from './funcs'

interface IProps {
  posit: {
    name: string
    num: number
    all: number
  }[]
}

const props = defineProps<IProps>()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function init() {
  if (chart === null)
    chart = echarts.init(chartRef.value!)
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', axisLine: { lineStyle: { color: '#000' } }, axisLabel: { color: '#000' } },
    yAxis: {
      type: 'category',
      data: x_name(props.posit),
      axisLine:
      {
        lineStyle: { color: '#000' },
      },
      axisLabel:
      { color: '#000',

      },
    },
    series: [
      {
        type: 'bar',
        data: y_name(props.posit)[0],
        stack: 'total',
        itemStyle:
        {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#ffcf57' }, { offset: 1, color: '#ff6b6b' }]),
        },
      },
      {
        type: 'bar',
        data: y_name(props.posit)[1],
        stack: 'total',
        itemStyle:
        {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#43CD80' }, { offset: 1, color: '#54FF9F' }]),
        },
        label: {
          show: true,
          position: 'right', // 靠右
          formatter: (params: any) => {
            if (params.value === 0) {
              return '无流程'
            }
            const pct = (y_name(props.posit)[0][params.dataIndex] / params.value * 100).toFixed(0)
            return `${pct}%`
          },
        },
      },
    ],
  })
}

onMounted(() => {
  init()
})

watch(() => props.posit, () => {
  init()
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-gray-100 border border-white/10 rounded-xl p-4 shadow-xl">
    <div class="text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      问题最多位置 TOP6
    </div>
    <div ref="chartRef" class="w-full h-[320px]" />
  </div>
</template>

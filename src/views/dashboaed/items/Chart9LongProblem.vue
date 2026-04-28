<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { x_name, y_name } from './funcs'

interface IProps {
  ins: {
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
      data: x_name(props.ins),
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
        data: y_name(props.ins)[0],
        stack: 'total',
        itemStyle:
        {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#ffcf57' }, { offset: 1, color: '#ff6b6b' }]),
        },
      },
    ],
  })
}

onMounted(() => {
  init()
})

watch(() => props.ins, () => {
  init()
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-gray-100 border border-white/10 rounded-xl p-4 shadow-xl">
    <div class="text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      问题最多检查类型 TOP6
    </div>
    <div ref="chartRef" class="w-full h-[320px]" />
  </div>
</template>

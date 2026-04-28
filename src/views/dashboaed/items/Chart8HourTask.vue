<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  chart = echarts.init(chartRef.value!)
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'], axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    series: [{ type: 'bar', data: [30, 55, 75, 60, 45, 80, 95, 110, 120, 100, 85, 70, 50, 35], itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#36d399' }, { offset: 1, color: '#4b84ff' }]) } }],
  })
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl md:col-span-2">
    <div class="text-white text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      9:00-22:00 每小时任务数量
    </div>
    <div ref="chartRef" class="w-full h-[350px]" />
  </div>
</template>

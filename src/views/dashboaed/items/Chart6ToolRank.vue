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
    xAxis: { type: 'value', axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'category', data: ['拖把', '扫帚', '吸尘器', '抹布', '清洁剂', '刮水器', '垃圾桶'], axisLine: { lineStyle: { color: '#fff' } }, axisLabel: { color: '#fff' } },
    series: [{ type: 'bar', data: [200, 180, 150, 130, 100, 90, 70], itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#4b84ff' }, { offset: 1, color: '#36d399' }]) } }],
  })
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
    <div class="text-white text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      工具使用次数排行榜
    </div>
    <div ref="chartRef" class="w-full h-[320px]" />
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  chart = echarts.init(chartRef.value!)
  chart.setOption({
    backgroundColor: 'transparent',
    radar: { radius: '70%', indicator: [{ name: '行为问题', max: 100 }, { name: '品质问题', max: 100 }, { name: '工具正确', max: 100 }, { name: '人员面貌', max: 100 }, { name: '时效性', max: 100 }], name: { textStyle: { color: '#fff' } }, axisLine: { lineStyle: { color: '#fff' } } },
    series: [{ type: 'radar', data: [[80, 75, 95, 90, 85]], areaStyle: { color: 'rgba(75,132,255,.3)' }, lineStyle: { color: '#4b84ff' } }],
  })
})

onUnmounted(() => chart?.dispose())
</script>

<template>
  <div class="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
    <div class="text-white text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      质检五维度综合评分
    </div>
    <div ref="chartRef" class="w-full h-[320px]" />
  </div>
</template>

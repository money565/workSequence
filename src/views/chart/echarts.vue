<script setup lang="ts" name="echarts">
import chinaMap from '@/utils/china'
import { BarChart, LineChart, MapChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { registerMap, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { barOptions, lineOptions, mapOptions, pieOptions, ringOptions, wordOptions } from './options'
import 'echarts-wordcloud'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  LineChart,
  PieChart,
  MapChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
])
registerMap('china', chinaMap)
</script>

<template>
  <div class="container">
    <div class="plugins-tips">
      vue-echarts：Apache ECharts™ 的 Vue.js 组件。 访问地址：
      <a href="https://github.com/ecomfe/vue-echarts" target="_blank">vue-echarts</a>
    </div>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          柱状图
        </div>
      </template>
      <VChart class="schart" :option="barOptions" />
    </el-card>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          折线图
        </div>
      </template>
      <VChart class="schart" :option="lineOptions" />
    </el-card>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          饼状图
        </div>
      </template>
      <VChart class="schart" :option="pieOptions" />
    </el-card>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          环形图
        </div>
      </template>
      <VChart class="schart" :option="ringOptions" />
    </el-card>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          词云图
        </div>
      </template>
      <VChart class="schart" :option="wordOptions" />
    </el-card>
    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="content-title">
          地图
        </div>
      </template>
      <VChart class="schart" :option="mapOptions" />
    </el-card>
  </div>
</template>

<style scoped>
.schart {
    width: 100%;
    height: 400px;
}

.content-title {
    font-weight: 400;
    font-size: 22px;
    color: #1f2f3d;
}
</style>

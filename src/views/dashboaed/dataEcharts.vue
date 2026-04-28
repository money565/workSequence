<script setup lang="ts">
import type { DATA_OPT } from './items/funcs'
import { getStatisticalData } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import Chart1Project from './items/Chart1Project.vue'
import Chart2Floor from './items/Chart2Floor.vue'
import Chart3Position from './items/Chart3Position.vue'
import Chart4CleanObj from './items/Chart4CleanObj.vue'
import Chart5DailyLine from './items/Chart5DailyLine.vue'
import Chart6ToolRank from './items/Chart6ToolRank.vue'
import Chart7QualityRadar from './items/Chart7QualityRadar.vue'
import Chart8HourTask from './items/Chart8HourTask.vue'
import Chart9LongProblem from './items/Chart9LongProblem.vue'

const date = ref(new Date())
const acs = useAppCacheStore()
const project_datas = ref<DATA_OPT[]>([])
const floor_datas = ref<DATA_OPT[]>([])
const posit_datas = ref<DATA_OPT[]>([])
const objs_datas = ref<DATA_OPT[]>([])
const ins_datas = ref<DATA_OPT[]>([])
const checkDate = ref<DATA_OPT[]>([])
function init() {
  getStatisticalData(acs.currentProject, date.value.getFullYear(), date.value.getMonth() + 1, date.value.getDate()).then(({ data: res }) => {
    project_datas.value = res.result[0]
    floor_datas.value = res.result[1]
    posit_datas.value = res.result[2]
    objs_datas.value = res.result[3]
    ins_datas.value = res.result[4]
    checkDate.value = res.result[5]
    console.log('checkDate.value', checkDate.value)
  })
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  init()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br p-4 md:p-6">
    <div class="text-center mb-8">
      <h1 class="text-[clamp(1.5rem,3vw,2.2rem)] font-bold rgb(75 74 74)">
        今日流程数据
      </h1>
      <div class="flex gap-2 text-center items-center justify-center">
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          @change="init()"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-7xl mx-auto">
      <Chart1Project v-if="project_datas.length > 0" :project="project_datas" />
      <Chart2Floor v-if="floor_datas.length > 0" :floor="floor_datas" />
      <Chart3Position v-if="posit_datas.length > 0" :posit="posit_datas" />
      <Chart4CleanObj v-if="objs_datas.length > 0" :objs="objs_datas" />
      <Chart9LongProblem v-if="ins_datas.length > 0" :ins="ins_datas" />
      <Chart5DailyLine v-if="checkDate.length > 0" :check-date="checkDate" />
      <Chart6ToolRank />
      <Chart7QualityRadar />
      <Chart8HourTask />
    </div>
  </div>
</template>

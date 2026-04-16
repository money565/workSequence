<script setup lang="ts">
import { getSequenceByProject } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'

interface POSIT_DATAS {
  [key: string]: {
    id: number
    name: string
    plant: {
      id: number
      name: string
    }[]
    tr: string
  }
}

interface FLOOR_DATAS {
  [key: string]: POSIT_DATAS[]
}
const acs = useAppCacheStore()
const seqList = ref<FLOOR_DATAS>()
const today = ref(1)
function init() {
  getSequenceByProject(acs.currentProject, today.value).then(({ data: res }) => {
    seqList.value = res.result
  })
}
watch(() => acs.currentProject, () => {
  init()
})

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div class="ml-5">
      <el-radio-group v-model="today" @change="init()">
        <el-radio :value="1">
          今日流程
        </el-radio>
        <el-radio :value="2">
          全部流程
        </el-radio>
      </el-radio-group>
    </div>
    <div v-for="(floor_datas, floor) in seqList" :key="floor">
      <div class="w-100% bg-blue-600 pt-3 pb-3 text-light-50 font-sans font-semibold text-center">
        {{ floor }}
      </div>

      <div v-for="(posit_datas, posit) in floor_datas" :key="posit">
        <div class="w-100% bg-blue-400 pt-3 pb-3 text-light-50 font-sans font-semibold">
          ----{{ posit }}----
        </div>
        <div class="bg-blue-50 pt-2 pb-2">
          <el-card v-for="(item, index) in posit_datas" :key="index" class="mt-2">
            <div class="flex gap-2">
              <div class="w-30%">
                流程名称：
              </div>
              <div class="w-70%">
                {{ item.name }}
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-30%">
                流程时间：
              </div>
              <div class="w-70%">
                {{ item.tr }}
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-30%">
                计划：
              </div>
              <div class="w-70%">
                <div v-if="today === 1">
                  <div v-if="item.plant.length <= 0">
                    今日无执行计划
                  </div>
                  <div v-else>
                    <div v-for="(plant, plant_index) in item.plant" :key="plant_index">
                      {{ plant.name }}
                    </div>
                  </div>
                </div>
                <div v-if="today === 2">
                  <div v-if="item.plant.length <= 0">
                    无计划
                  </div>
                  <div v-else>
                    <div v-for="(plant, plant_index) in item.plant" :key="plant_index" class="p-2" :class="{ ' bg-gray-200': plant_index % 2 === 0 }">
                      {{ plant.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

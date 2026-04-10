<script setup lang="ts">
import type { sequence } from '@/views/sequences/target'
import { getSequenceByTime } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { targetList } from '@/views/sequences/target'

const acs = useAppCacheStore()
const sequenceList = ref<sequence[]>([])
function getTodayMinutes(): number {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours * 60 + minutes
}
function init() {
  getSequenceByTime(acs.currentProject, getTodayMinutes()).then(({ data: res }) => {
    sequenceList.value = res.result
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
  <div class="w-100% flex items-center justify-center">
    <div>
      <div v-for="(item, index) in sequenceList" :key="`${item.name}_${index}`" class="flex w-80 mt-2">
        <el-card class="rounded-xl w-83">
          <div class="max-h-100 overflow-auto">
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="primary">
                  流程名称：
                </el-text>
              </div>
              <div class="w-59 max-h-20 overflow-auto">
                <el-text>
                  {{ item.name }}
                </el-text>
              </div>
            </div>
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="warning">
                  楼层：
                </el-text>
              </div>
              <div>
                <el-text>
                  {{ item.floor.name }}
                </el-text>
              </div>
            </div>
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="danger">
                  位置：
                </el-text>
              </div>
              <div>
                <el-text>
                  {{ item.posit.name }}
                </el-text>
              </div>
            </div>
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="danger">
                  时间：
                </el-text>
              </div>
              <div>
                <el-text>
                  {{ item.start }}至{{ item.end }}
                </el-text>
              </div>
            </div>
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="success">
                  任务：
                </el-text>
              </div>
              <div class="flex gap-2 w-59">
                <el-tag v-for="(target, nums) in targetList(item.target)" :key="nums" type="success">
                  {{ target.name }}
                </el-tag>
              </div>
            </div>
            <div class="flex mt-1">
              <div class="w-20">
                <el-text type="warning">
                  工具：
                </el-text>
              </div>
              <div class="flex gap-2 w-59 flex-wrap">
                <el-tag v-for="(tool, tool_index) in item.tools" :key="tool_index" type="warning">
                  {{ tool.name }}
                </el-tag>
              </div>
            </div>
            <div class=" mt-1">
              <el-text type="primary">
                流程对象：
              </el-text>
              <div class="max-h-50 overflow-auto">
                <el-tag v-for="(o, i) in item.objs" :key="i" class="m-1">
                  {{ o.name }}
                </el-tag>
              </div>
            </div>
          </div>

          <template #footer>
            <el-button type="success" link>
              扫码检查
            </el-button>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { getCheckResult } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'

interface CHECK_DATA {
  id: number
  title: string
  posit: {
    id: number
    name: string
  }
  plant: boolean
  issue: {
    objs: {
      id: number
      name: string
    }[]
    tools: {
      id: number
      name: string
    }[]
    targets: {
      id: number
      name: string
    }[]
  }
  result: {
    name: string
    r: string
  }[]
  cd: string
  pic: string
  tips: string
}

interface RECORD {
  [key: string]: CHECK_DATA[]
}

const currentDate = ref<Date>(new Date())
const acs = useAppCacheStore()
const currentFloor = ref('')
const checkList = ref<RECORD>({})
function init() {
  getCheckResult(acs.currentProject, currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, currentDate.value.getDate()).then(({ data: res }) => {
    console.log(res.result)
    checkList.value = res.result
  })
}

function isEmptyObject(value: unknown): value is Record<string, never> {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.keys(value).length === 0
  )
}

function floorClick(floor: string) {
  if (currentFloor.value === floor) {
    currentFloor.value = ''
  }
  else {
    currentFloor.value = floor
  }
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  init()
})
</script>

<template>
  <div>
    <div class="fixed z-999 w-100% h-10 bg-red-400 flex items-center justify-center">
      <span class="text-light-50">选择日期：</span>
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="选择日期"
        size="default"
        :editable="false"
        @change="init()"
      />
    </div>
    <div class="pt-10">
      <div v-if="isEmptyObject(checkList)">
        <el-empty description="今日无检查内容" />
      </div>
      <div v-else class="max-h-170 overflow-auto">
        <div v-for="(datas, floor) in checkList" :key="floor">
          <div class="flex w-94% bg-yellow-200 pt-3 pb-3 pl-3 border-b-solid border-gray-300 shadow-sm" @click="floorClick(String(floor))">
            <div class="mt--1">
              <span
                class="transition-transform duration-400 inline-block"
                :class="currentFloor === floor && 'rotate-90'"
              >
                ▶
              </span>
            </div>
            <div class="ml-3">
              {{ floor }}
            </div>
          </div>
          <div>
            <el-collapse-transition>
              <div v-if="currentFloor === floor" class=" mb-2">
                <div v-for="(item, index) in datas" :key="index" class="flex flex-col items-center justify-center mt-1">
                  <el-card class="w-95%">
                    <div class="flex gap-4">
                      <div class="w-28%">
                        标题：
                      </div>
                      <el-popover
                        placement="bottom"
                        title="标题："
                        :width="200"
                        trigger="click"
                      >
                        <template #reference>
                          <div class="w-68% truncate" :class="{ 'text-blue-500 font-sans font-semibold': item.plant }">
                            {{ item.title }}
                          </div>
                        </template>
                        <div class="flex gap-2">
                          <div>
                            {{ item.title }}
                          </div>
                          <div v-if="item.plant">
                            <el-tag type="primary">
                              计划
                            </el-tag>
                          </div>
                        </div>
                      </el-popover>
                    </div>
                    <div class="flex gap-4 mt-3">
                      <div class="w-28%">
                        位置：
                      </div>
                      <div>
                        {{ item.posit.name }}
                      </div>
                    </div>
                    <div class="flex gap-4 mt-3">
                      <div class="w-28%">
                        检查时间：
                      </div>
                      <div>
                        {{ item.cd }}
                      </div>
                    </div>
                    <el-popover
                      placement="bottom"
                      :width="300"
                      trigger="click"
                    >
                      <template #reference>
                        <div class="flex gap-4 mt-3">
                          <div class="w-28%">
                            检查结果：
                          </div>
                          <div v-if="item.issue.objs.length === 0 && item.issue.targets.length === 0 && item.issue.tools.length === 0" class="mt--1">
                            <div class="bg-green-600 text-light-50 p-1 pl-2 pr-2 rounded-md">
                              正常
                            </div>
                          </div>
                          <div v-else class="mt--1">
                            <div class="bg-red-600 text-light-50 p-1 pl-2 pr-2 rounded-md">
                              存在问题
                            </div>
                          </div>
                        </div>
                      </template>
                      <div class="bg-gray-200 p-3 rounded-lg">
                        <div class="flex gap-4 mt-2">
                          <div class="w-28%">
                            问题对象：
                          </div>
                          <div v-if="item.issue.objs.length > 0">
                            <el-tag v-for="(o, i) in item.issue.objs" :key="i" type="danger">
                              {{ o.name }}
                            </el-tag>
                          </div>
                          <div v-else>
                            <el-tag type="success">
                              无
                            </el-tag>
                          </div>
                        </div>
                        <div class="flex gap-4 mt-2">
                          <div class="w-28%">
                            缺少工具：
                          </div>
                          <div v-if="item.issue.tools.length > 0">
                            <el-tag v-for="(o, i) in item.issue.tools" :key="i" type="danger">
                              {{ o.name }}
                            </el-tag>
                          </div>
                          <div v-else>
                            <el-tag type="success">
                              无
                            </el-tag>
                          </div>
                        </div>
                        <div class="flex gap-4 mt-2">
                          <div class="w-28%">
                            错误动作：
                          </div>
                          <div v-if="item.issue.targets.length > 0">
                            <el-tag v-for="(o, i) in item.issue.targets" :key="i" type="danger">
                              {{ o.name }}
                            </el-tag>
                          </div>
                          <div v-else>
                            <el-tag type="success">
                              无
                            </el-tag>
                          </div>
                        </div>
                        <div v-for="(ins, ins_index) in item.result" :key="ins_index" class="flex gap-4 mt-2">
                          <div class="w-60%">
                            {{ ins.name }}：
                          </div>
                          <div>
                            <el-tag :type="ins.r === '是' ? 'primary' : 'danger'">
                              {{ ins.r }}
                            </el-tag>
                          </div>
                        </div>
                      </div>
                    </el-popover>
                    <div class="flex gap-4 mt-3">
                      <div class="w-28%">
                        说明：
                      </div>
                      <div>
                        {{ item.tips }}
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

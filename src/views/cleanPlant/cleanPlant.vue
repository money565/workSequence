<script setup lang="ts">
import type { PLANT } from './items/plant_interface'
import { deletePlant, getPlantByKind, getPlantKinds, pausePlant } from '@/axios/interfaceWorkBase'
import { imageUrl } from '@/webConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import createPlant from './items/createPlant.vue'

const createPlantDialog = ref(false)
const plantKinds = ref<{ id: number, name: string }[]>([])
const plantList = ref<PLANT[]>([])
const currentKind = ref()
const creatKindPlant = ref<{ id: number, name: string }>()
const dataState = ref(0)
function init() {
  getPlantKinds().then(({ data: res }) => {
    plantKinds.value = res.result
  })
}

function get_plant_by_kind() {
  getPlantByKind(currentKind.value).then(({ data: res }) => {
    plantList.value = res.result
    if (res.result.length <= 0) {
      dataState.value = 1
    }
  })
}

function cunrrentKindShow(id: number) {
  plantList.value = []
  dataState.value = 0
  if (currentKind.value === undefined) {
    currentKind.value = id
    get_plant_by_kind()
  }
  else {
    currentKind.value = undefined
  }
}

function pause_Plant(id: number) {
  pausePlant(id).then(() => {
    get_plant_by_kind()
  })
}

function delPlant(id: number) {
  ElMessageBox.confirm(
    '确定要删除这个计划吗？这样会删除相关数据，建议停用',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then((res) => {
      if (res === 'confirm') {
        deletePlant(id).then(() => {
          get_plant_by_kind()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div v-for="(k, i) in plantKinds" :key="i" class="w-95%" @click="cunrrentKindShow(k.id)">
      <div class="w-100% flex gap-4 bg-blue-400 p-4 shadow-[0_14px_16px_-12px_rgba(0,0,0,0.6)] mb-2 rounded-xl hover:bg-blue-600">
        <div class="flex gap-4 w-90%">
          <div class="text-light-50 font-sans font-semibold">
            {{ k.name }}
          </div>
          <div
            class="arrow w-5 h-5 text-gray-500 transition-transform duration-300"
            :class="currentKind === k.id ? 'rotate-180' : ''"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        <div class="w-10% flex items-end justify-end">
          <el-button @click.stop="creatKindPlant = { id: k.id, name: k.name }, createPlantDialog = true">
            添加计划
          </el-button>
        </div>
      </div>
      <div class="shadow-[0_14px_16px_-12px_rgba(0,0,0,0.6)] mb-2 rounded-lg ">
        <el-collapse-transition>
          <div v-show="currentKind === k.id" @click.stop>
            <div v-if="plantList.length > 0" class="flex gap-2 rounded-xl overflow-auto h-33rem">
              <div v-for="(item, index) in plantList" :key="index">
                <el-card class="rounded-xl w-18rem h-38rem">
                  <template #header>
                    <div>
                      <el-popover
                        placement="bottom"
                        width="260"
                      >
                        <template #reference>
                          <div class="flex gap-2">
                            <el-text class="w-100% truncate">
                              {{ item.name }}
                            </el-text>
                          </div>
                        </template>
                        <div class="w-50">
                          <div>{{ item.name }}</div>
                          <div class="flex gap-2 mt-4">
                            <el-button type="warning" link @click="pause_Plant(item.id!)">
                              停用
                            </el-button>
                            <el-button type="danger" link @click="delPlant(item.id!)">
                              删除
                            </el-button>
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </template>
                  <el-form label-width="auto" style="max-width: 100%">
                    <el-form-item label="计划周期：">
                      <el-text>
                        {{ item.cycle === 1 ? '每周' : '每月' }}
                      </el-text>
                    </el-form-item>
                    <el-form-item label="计划日：">
                      <el-text>
                        {{ item.ex_date }}
                      </el-text>
                    </el-form-item>
                    <el-form-item label="对象类型：">
                      <div class="flex gap-2 w-100% h-20 overflow-auto">
                        <div v-for="(type, t_index) in item.types" :key="t_index" class="w-30% h-8 items-center justify-center">
                          <div class="bg-green-100 w-8 h-4 flex items-center justify-center pt-3 ml-4 rounded-full">
                            <el-image :src="imageUrl(type.icon)" style="width:1.5rem" />
                          </div>
                          <div class="text-center">
                            <el-text class="w-100% truncate">
                              {{ type.name }}
                            </el-text>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="动作：">
                      <div class="flex gap-2 w-100% h-20 overflow-auto">
                        <div v-for="(action, a_index) in item.action" :key="a_index" class="w-30% h-8 items-center justify-center">
                          <div class="bg-green-100 w-8 h-4 flex items-center justify-center pt-3 ml-4 rounded-full">
                            <el-image :src="imageUrl(action.icon)" style="width:1.5rem" />
                          </div>
                          <div class="text-center">
                            <el-text class="w-100% truncate">
                              {{ action.name }}
                            </el-text>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="工具：">
                      <div class="flex gap-2 w-100% h-20 overflow-auto">
                        <div v-for="(tools, t_index) in item.tools" :key="t_index" class="w-30% h-8 items-center justify-center">
                          <div class="bg-green-100 w-8 h-4 flex items-center justify-center pt-3 ml-4 rounded-full">
                            <el-image :src="imageUrl(tools.icon)" style="width:1.5rem" />
                          </div>
                          <div class="text-center">
                            <el-text class="w-100% truncate">
                              {{ tools.name }}
                            </el-text>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="检查内容：">
                      <div v-for="(ins, i_index) in item.ins" :key="i_index">
                        <el-text>
                          {{ ins.name }}
                        </el-text>
                      </div>
                    </el-form-item>
                    <el-form-item label="状态：">
                      <el-tag :type="item.state ? 'success' : 'danger'">
                        {{ item.state ? '正常' : '停用' }}
                      </el-tag>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </div>
            <div v-else>
              <div v-if="dataState === 0" class="h-32rem">
                正在读取.....
              </div>
              <div v-if="dataState === 1" class="h-32rem">
                <el-empty description="暂无该类别数据" />
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <XtDialog v-model="createPlantDialog" title="增加计划" :show-cancel="false" :show-confirm="false" @cancel="createPlantDialog = false">
      <createPlant
        v-if="creatKindPlant"
        :kind-id="creatKindPlant.id"
        :kind-name="creatKindPlant.name"
        @cancel="createPlantDialog = false"
        @confirm="get_plant_by_kind(), createPlantDialog = false"
      />
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

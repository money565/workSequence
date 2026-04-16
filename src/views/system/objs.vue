<script lang="ts" setup>
import { deleteObject, getAllObjectsWithFloor } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { MakeSure } from '../public/item'
import createObject from './items/createObject.vue'

interface positOpt {
  id: number
  name: string
  posit: {
    id: number
    name: string
    objs: {
      id: number
      name: string
      type: string
    }[]
  }[]
}

const acs = useAppCacheStore()
const objectList = ref<positOpt[]>([])
const currentFloor = ref<number>()
const currentPosit = ref<number>()
const createObjectDialog = ref(false)

function init() {
  getAllObjectsWithFloor(acs.currentProject).then(({ data: res }) => {
    objectList.value = (res.result ?? []) as positOpt[]
  })
}

function currentCreateObjectTitle() {
  if (currentFloor.value !== undefined && currentPosit.value !== undefined) {
    return `添加 ${objectList.value[currentFloor.value].name} ${objectList.value[currentFloor.value].posit[currentPosit.value].name} 的巡检对象`
  }
  return ''
}

function confirmDeletObject(obj_index: number) {
  MakeSure(`确实要删除流程对象${objectList.value[currentFloor.value!].posit[currentPosit.value!].objs[obj_index].name}吗？`, '确认').then((res) => {
    if (res === 'confirm') {
      if (currentFloor.value !== undefined && currentPosit.value !== undefined) {
        const obj_id = objectList.value[currentFloor.value].posit[currentPosit.value].objs[obj_index].id
        deleteObject(obj_id).then(() => {
          init()
        })
      }
    }
  })
}

onMounted(() => {
  init()
})
watch(() => acs.currentProject, () => { init() })
</script>

<template>
  <div>
    <div v-for="(item, index) in objectList" :key="index">
      <div
        class="mt-5 h-12 rounded-t-xl border bg-blue-500 border-blue-500 shadow-md cursor-pointer flex items-center pl-8"
        @click="currentFloor === index ? currentFloor = undefined : currentFloor = index"
      >
        <div class="flex gap-2">
          <el-icon size="22">
            <svg-icon name="floor-white" />
          </el-icon>
          <div content-position="center" class="cursor-pointer text-white font-sans font-800">
            {{ item.name }}
          </div>
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="index === currentFloor" class="bg-yellow-100 max-h-150 rounded-b-xl overflow-auto">
          <div
            v-for="(posit, p_index) in item.posit"
            :key="p_index"
            @click="currentPosit === p_index ? currentPosit = undefined : currentPosit = p_index"
          >
            <div class="flex gap-2 bg-blue-400 h-12 items-center pl-16 border-b-5 border-b-blue-900 cursor-pointer">
              <div>
                <el-icon size="22">
                  <svg-icon name="posit" />
                </el-icon>
              </div>
              <div class="font-sans font-semibold text-light-50">
                {{ posit.name }}
              </div>
            </div>
            <el-collapse-transition>
              <div v-show="currentPosit === p_index">
                <div v-if="posit.objs.length === 0" class="cursor-pointer" @click.stop="createObjectDialog = true">
                  <el-empty description="该位置下暂无流程对象" />
                </div>
                <div v-else class="flex flex-wrap gap-4 p-4 items-center justify-start">
                  <div v-for="(obj, obj_index) in posit.objs" :key="obj_index">
                    <el-card class="w-25 h-30 rounded-lg" @click.stop>
                      <div>
                        <div class="flex items-center justify-center">
                          <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${obj.type}.svg`" style="width: 2.5rem; height: 2.5rem" />
                        </div>
                        <div class="flex items-center justify-center">
                          <el-text>{{ obj.name }}</el-text>
                        </div>
                        <div class="flex items-center justify-center">
                          <el-button type="danger" link @click="confirmDeletObject(obj_index)">
                            删除
                          </el-button>
                        </div>
                      </div>
                    </el-card>
                  </div>
                  <el-card class="w-25 h-30 rounded-lg flex items-center justify-center cursor-pointer" @click.stop="createObjectDialog = true">
                    <div>
                      <div class="flex items-center justify-center">
                        <el-icon size="25">
                          <SvgIcon name="add-green" />
                        </el-icon>
                      </div>
                      <el-text class="block flex text-center">
                        增加流程对象
                      </el-text>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <xt-dialog v-model="createObjectDialog" :title="currentCreateObjectTitle()" width="800" :show-cancel="false" :show-confirm="false">
      <div v-if="currentPosit !== undefined && currentFloor !== undefined">
        <createObject :pos-id="objectList[currentFloor].posit[currentPosit].id" @cancel="createObjectDialog = false" @confirm="init(), createObjectDialog = false " />
      </div>
      <div v-else>
        请先选择位置
      </div>
    </xt-dialog>
  </div>
</template>

<style scoped>
.transition-box {
  width: 200px;
  height: 100px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-color-primary);
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
}
</style>

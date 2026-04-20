<script lang="ts" setup>
import { deleteObject, getAllPositWithFloor, getObjectsByPosit } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { HWBaseURL } from '@/webConfig'
import { ElMessage } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { MakeSure } from '../public/item'
import createObject from './items/createObject.vue'
import QrCodeExport from './items/QrCodeExport.vue'

interface positOpt {
  id: number
  name: string
  type: string
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
const currentFloor = ref<number | undefined>(undefined)
const currentPosit = ref<number | undefined>(undefined)
const createObjectDialog = ref(false)
const positList = ref<{ name: string, id: number, posit: { name: string, id: number, selected: boolean }[] }[]>([])
const qrList = ref<{ url: string, name: string }[]>([])
const showCreateQrButton = ref(false)
const makeQrDialog = ref(false)
const currentQrCode = reactive({
  dialog: false,
  title: '',
  name: '',
  url: '',
})

function init() {
  getAllPositWithFloor(acs.currentProject).then(({ data: res }) => {
    positList.value = res.result || []
    for (const i in positList.value) {
      for (const p in positList.value[i].posit) {
        positList.value[i].posit[p].selected = false
      }
    }
  })
}

function showObjsByposit(pos_id: number, p_index: number) {
  getObjectsByPosit(pos_id).then(({ data: res }) => {
    objectList.value = res.result || []
    currentPosit.value === p_index ? currentPosit.value = undefined : currentPosit.value = p_index
  })
}

// ✅ 修复：全部加上可选链 ?. 防止 undefined 报错
function currentCreateObjectTitle() {
  if (currentFloor.value !== undefined && currentPosit.value !== undefined) {
    const floor = objectList.value?.[currentFloor.value]
    const posit = floor?.posit?.[currentPosit.value]
    if (floor && posit) {
      return `添加 ${floor.name} ${posit.name} 的巡检对象`
    }
  }
  return '添加巡检对象'
}

// ✅ 修复：删除前做判空校验
function confirmDeletObject(obj_index: number) {
  const obj = objectList.value[obj_index]
  if (!obj) {
    ElMessage.warning('对象不存在')
    return
  }

  MakeSure(`确实要删除流程对象${obj.name}吗？`, '确认').then((res) => {
    if (res === 'confirm') {
      deleteObject(obj.id).then(() => {
        ElMessage.success('删除成功')
        init()
        // 重置选中状态，避免报错
        currentPosit.value = undefined
      })
    }
  })
}

function viewQrcode(pos_id: number, floor: string, posit: string) {
  currentQrCode.name = `${floor}-${posit}`
  currentQrCode.title = `查看“${floor}-${posit}”的二维码`
  currentQrCode.url = `${HWBaseURL()}home/?pid=${pos_id}`
  currentQrCode.dialog = true
}

function selectPosit(floor_name: string) {
  const temp = []
  for (const i in positList.value) {
    for (const p in positList.value[i].posit) {
      if (positList.value[i].posit[p].selected === true) {
        temp.push({
          url: `${HWBaseURL()}home?pid=${positList.value[i].posit[p].id}`,
          name: `${floor_name}-${positList.value[i].posit[p].name}`,
        })
        showCreateQrButton.value = true
      }
    }
  }
  qrList.value = temp
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  // 切换项目时重置状态
  currentFloor.value = undefined
  currentPosit.value = undefined
  objectList.value = []
  init()
})
</script>

<template>
  <div>
    <div v-for="(item, index) in positList" :key="index">
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
        <div v-if="index === currentFloor" class="bg-yellow-100 max-h-150 rounded-b-xl overflow-auto">
          <div v-if="item.posit.length > 0">
            <div
              v-for="(posit, p_index) in item.posit"
              :key="p_index"
              @click="showObjsByposit(posit.id, p_index)"
            >
              <div class="flex gap-2 bg-blue-400 h-12 items-center pl-16 border-b-5 border-b-blue-900 cursor-pointer">
                <div class="w-2%">
                  <el-icon size="22">
                    <svg-icon name="posit" />
                  </el-icon>
                </div>
                <div class="font-sans font-semibold text-light-50 w-30%">
                  {{ posit.name }}
                </div>
                <div class="flex gap-2" @click.stop>
                  <el-checkbox v-model="posit.selected" label="导出二维码" size="large" :value="true" @change="selectPosit(item.name)" />
                </div>
                <div class="cursor-pointer font-sans font-semibold text-yellow-200 text-3.5" @click.stop="viewQrcode(posit.id, item.name, posit.name)">
                  查看二维码
                </div>
              </div>
              <el-collapse-transition>
                <div v-if="currentPosit === p_index">
                  <div v-if="objectList.length === 0" class="cursor-pointer" @click.stop="createObjectDialog = true">
                    <el-empty description="该位置下暂无流程对象" />
                  </div>
                  <div v-else class="flex flex-wrap gap-4 p-4 items-center justify-start">
                    <div v-for="(obj, obj_index) in objectList" :key="obj_index">
                      <el-card class="w-25 h-30 rounded-lg" @click.stop>
                        <div>
                          <div class="flex items-center justify-center">
                            <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${obj.type}.svg`" style="width: 2.5rem; height: 2.5rem" />
                          </div>
                          <div class="flex items-center justify-center">
                            <el-popover placement="bottom">
                              <template #reference>
                                <div class="120% truncate mt-2 mb-2">
                                  <el-text>{{ obj.name }}</el-text>
                                </div>
                              </template>
                              <el-text>{{ obj.name }}</el-text>
                            </el-popover>
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
                            <svg-icon name="add-green" />
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
          <div v-else>
            <el-empty description="该楼层下未设置点位" />
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mt-10">
      <el-button v-if="showCreateQrButton" type="primary" @click="makeQrDialog = true">
        批量生成二维码
      </el-button>
    </div>
    <!-- ✅ 修复：模板里也加上 ?. 可选链，彻底杜绝报错 -->
    <xt-dialog v-model="createObjectDialog" :title="currentCreateObjectTitle()" width="800" :show-cancel="false" :show-confirm="false">
      <div v-if="currentPosit !== undefined && currentFloor !== undefined">
        <createObject
          :pos-id="objectList?.[currentFloor!]?.posit?.[currentPosit!]?.id"
          @cancel="createObjectDialog = false"
          @confirm="init(); createObjectDialog = false"
        />
      </div>
      <div v-else>
        请先选择位置
      </div>
    </xt-dialog>
    <XtDialog v-model="makeQrDialog" width="1400" title="批量导出二维码">
      <QrCodeExport :qr-list="qrList" />
    </XtDialog>
    <XtDialog v-model="currentQrCode.dialog" :title="currentQrCode.title" :show-confirm="false" cancel-button-text="关闭" @cancel="currentQrCode.dialog = false">
      <div class="flex flex-col gap-4 items-center justify-center text-center">
        <QrcodeVue
          :value="currentQrCode.url"
          :size="120"
          render-as="svg"
          level="L"
        />
        <h3>
          {{ currentQrCode.name }}
        </h3>
      </div>
    </XtDialog>
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
:deep(.el-checkbox__label) {
  color: white !important;
}
/* 全局选中颜色 */
:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: rgb(247, 243, 8) !important;
}
</style>

<script setup lang="ts">
import type { sequence } from '@/views/sequences/target'
import { createCheckResult, getSequenceByTime } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/counter'
import { useMobileStore } from '@/stores/mobile'
import upLoadImage from '@/views/public/upLoadImage.vue'
import { imageUrl } from '@/webConfig'
import { ElMessageBox } from 'element-plus'
import secondTopItem from '../secondTopItem/secondTopItem.vue'

const acs = useAppCacheStore()
const mss = useMobileStore()
const user = useUserStore()
const showSequence = ref(false)
const sequenceList = ref<sequence[]>([])
const tempDialog = ref(false)
const cleanTime = ref()

const checkTitle = ref('')
const checkIndex = ref()
function openCheck(index: number) {
  checkIndex.value = index
  checkTitle.value = `“${sequenceList.value[index].name}”的流程检查`
  mss.checkDialog = true
}
function init() {
  showSequence.value = false
  getSequenceByTime(acs.currentProject, mss.timeList[mss.currentTimeNode]).then(({ data: res }) => {
    sequenceList.value = res.result
    showSequence.value = true
  })
}

function toolsClick(tool_index: number) {
  if (sequenceList.value[checkIndex.value].tools[tool_index].result === undefined || sequenceList.value[checkIndex.value].tools[tool_index].result) {
    sequenceList.value[checkIndex.value].tools[tool_index].result = false
  }
  else {
    sequenceList.value[checkIndex.value].tools[tool_index].result = true
  }
}

function objClick(obj_index: number) {
  if (sequenceList.value[checkIndex.value].objs[obj_index].result === undefined || sequenceList.value[checkIndex.value].objs[obj_index].result) {
    sequenceList.value[checkIndex.value].objs[obj_index].result = false
  }
  else {
    sequenceList.value[checkIndex.value].objs[obj_index].result = true
  }
}

function targetClick(action_index: number) {
  if (sequenceList.value[checkIndex.value].target[action_index].result === undefined || sequenceList.value[checkIndex.value].target[action_index].result) {
    sequenceList.value[checkIndex.value].target[action_index].result = false
  }
  else {
    sequenceList.value[checkIndex.value].target[action_index].result = true
  }
}

function receivePic(value: string) {
  sequenceList.value[checkIndex.value].checkPic = value
}

function upLoadChcekData() {
  const checkData = sequenceList.value[checkIndex.value]
  const Unqualified: { objs: number[], tools: number[], target: number[] } = {
    objs: [],
    tools: [],
    target: [],
  }
  const result = []
  for (const i in checkData.objs) {
    if (checkData.objs[i].result === false) {
      Unqualified.objs.push(checkData.objs[i].id)
    }
  }
  for (const t in checkData.tools) {
    if (checkData.tools[t].result === false) {
      Unqualified.tools.push(checkData.tools[t].id)
    }
  }
  for (const ta in checkData.target) {
    if (checkData.target[ta].result === false) {
      Unqualified.target.push(checkData.target[ta].id)
    }
  }
  for (const ins in checkData.ins) {
    if (checkData.ins[ins].parent !== null) {
      if ((checkData.ins[ins].result === undefined || checkData.ins[ins].result === null)) {
        ElMessageBox.alert(`完成${checkData.ins[ins].name}的检查`, '提示', {
          confirmButtonText: '确定',
        })
        return null
      }
      result.push({
        i: checkData.ins[ins].id,
        r: checkData.ins[ins].result,
      })
    }
  }
  if (!checkData.checkPic) {
    ElMessageBox.alert('需要上传图片', '提示', {
      confirmButtonText: '确定',
    })
    return null
  }
  const params = {
    checker: user.userInfo.userid,
    sid: sequenceList.value[checkIndex.value].id,
    plant: sequenceList.value[checkIndex.value].plantId,
    pic: checkData.checkPic,
    cd: { res: result, unq: Unqualified },
  }
  console.log(params)
  createCheckResult(params).then(() => {
    init()
    mss.checkDialog = false
  })
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  init()
})

watch(() => mss.currentTimeNode, () => {
  if (cleanTime.value) {
    tempDialog.value = true
    clearTimeout(cleanTime.value)
  }
  // 重新设置 1 秒
  cleanTime.value = setTimeout(() => {
    tempDialog.value = false
    init()
  }, 1000)
})
</script>

<template>
  <div>
    <div class="fixed top-12">
      <secondTopItem />
    </div>
    <div class="w-100% flex items-center justify-center mt-10">
      <div v-if="sequenceList.length > 0">
        <div v-show="showSequence">
          <div v-for="(item, index) in sequenceList" :key="`${item.name}_${index}`" class="flex w-83 mt-2">
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
                    <el-text type="primary">
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
                    <el-tag v-for="(target, nums) in item.target" :key="nums" type="success">
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
                <div v-if="item.checked">
                  该流程在
                  <el-text type="success" size="large">
                    {{ item.checked.dt }}
                  </el-text>
                  由
                  <el-text type="primary" size="large">
                    {{ item.checked.checker.name }}
                  </el-text>检查
                </div>
                <div v-else>
                  <el-button type="success" @click="openCheck(index)">
                    检查
                  </el-button>
                </div>
              </template>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tempDialog">
      <div class="fixed inset-0 bg-black/50 z-[9998]" />
      <!-- 内容 -->
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <div class="bg-white p-8 rounded-lg shadow-xl">
          {{ `${String(~~(mss.timeList[mss.currentTimeNode] / 60)).padStart(2, '0')}:${String(mss.timeList[mss.currentTimeNode] % 60).padStart(2, '0')}` }} 至
          {{ `${String(~~(mss.timeList[mss.currentTimeNode + 1] / 60)).padStart(2, '0')}:${String(mss.timeList[mss.currentTimeNode + 1] % 60).padStart(2, '0')}` }}
        </div>
      </div>
    </div>
    <XtDialog v-model="mss.checkDialog" :title="checkTitle" width="350" @cancel="mss.checkDialog = false" @confirm="upLoadChcekData">
      <div>
        <div class="w-full bg-yellow-500 flex items-center text-center justify-center pt-1 pb-1 rounded-md text-light-50 text-4.2">
          基本资料
        </div>
        <div class="flex gap-2 text-4 mt-2">
          <div>
            楼层：{{ sequenceList[checkIndex].floor.name }}
          </div>
          <div class="ml-10">
            位置：{{ sequenceList[checkIndex].posit.name }}
          </div>
        </div>
        <div class="text-4 mt-1">
          时间：{{ sequenceList[checkIndex].start }} - {{ sequenceList[checkIndex].end }}
        </div>
        <div class="w-full bg-green-500 flex items-center text-center justify-center pt-1 pb-1 rounded-md text-light-50 text-4.2 mt-2">
          流程对象
        </div>
        <div class="flex flex-wrap gap-2 mt-4 max-h-50 overflow-auto">
          <div v-for="(obj, obj_index) in sequenceList[checkIndex].objs" :key="obj_index">
            <el-tag size="large" :type="obj.result === false ? 'info' : 'success'" @click="objClick(obj_index)">
              <div class="flex">
                <el-image :src="imageUrl(obj.type)" style="width:1rem" />
                <div class="flex items-center text-center justify-center">
                  {{ obj.name }}
                </div>
              </div>
            </el-tag>
          </div>
        </div>
        <div class="w-full bg-red-400 flex items-center text-center justify-center pt-1 pb-1 rounded-md text-light-50 text-4.2 mt-2">
          工具
        </div>
        <div class="flex flex-wrap gap-2 mt-4 max-h-50 overflow-auto">
          <div v-for="(tool, tool_index) in sequenceList[checkIndex].tools" :key="tool_index">
            <el-tag size="large" :type="tool.result === false ? 'info' : 'danger'" @click="toolsClick(tool_index)">
              <div class="flex">
                <el-image :src="imageUrl(tool.icon)" style="width:1rem" />
                <div class="flex items-center text-center justify-center">
                  {{ tool.name }}
                </div>
              </div>
            </el-tag>
          </div>
        </div>
        <div class="w-full bg-yellow-500 flex items-center text-center justify-center pt-1 pb-1 rounded-md text-light-50 text-4.2 mt-2">
          任务
        </div>
        <div class="flex flex-wrap gap-2 mt-4 max-h-50 overflow-auto">
          <div v-for="(action, action_index) in sequenceList[checkIndex].target" :key="action_index">
            <el-tag size="large" :type="action.result === false ? 'info' : 'warning'" @click="targetClick(action_index)">
              <div class="flex">
                <el-image :src="imageUrl(action.icon)" style="width:1rem" />
                <div class="flex items-center text-center justify-center">
                  {{ action.name }}
                </div>
              </div>
            </el-tag>
          </div>
        </div>
        <div class="w-full bg-blue-500 flex items-center text-center justify-center pt-1 pb-1 rounded-md text-light-50 text-4.2 mt-2">
          检查
        </div>
        <div class="max-h-50 overflow-auto">
          <div v-for="(ins, ins_index) in sequenceList[checkIndex].ins" :key="ins_index">
            <div v-if="ins.parent !== null" class="mt-2 flex gap-4">
              <div class="mt-2">
                <el-text>
                  {{ ins.name }}
                </el-text>
              </div>
              <div>
                <el-radio-group v-model="ins.result!">
                  <el-radio :value="true">
                    是
                  </el-radio>
                  <el-radio :value="false">
                    否
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div>
            <upLoadImage @pic-key="receivePic" />
          </div>
        </div>
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

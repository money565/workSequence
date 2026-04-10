<script setup lang="ts">
import type { sequence } from './target'
import { deactivateSequenceBySid, deleteSequenceBySid, getSequence } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { ElMessage, ElMessageBox } from 'element-plus'
import sequenceCreate from './items/sequenceCreate.vue'
import timeSelect from './items/timeSelect.vue'

const acs = useAppCacheStore()
const timeRange = ref([-1, -1])
const currentTime = ref<number>(timeRange.value[0])
const creatSequenceDialog = ref(false)
const sequenceList = ref<sequence[]>([])
const currentSequenceList = ref<sequence[]>([])
const timeSelectRefresh = ref(0)
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

let timer: ReturnType<typeof setTimeout> | null = null
function receiveCurrentTimeChange(value: number) {
  currentTime.value = value
  if (timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(() => {
    currentSequenceList.value = sequenceList.value.filter(item => item.start_num <= value && item.end_num > value)
  }, 500)
}

function init() {
  timeRange.value = [-1, -1]
  getSequence(acs.currentProject).then(({ data: res }) => {
    const temp: sequence[] = []
    for (const i in res.result) {
      temp.push(res.result[i])
      temp[temp.length - 1].start_num = timeToMinutes(res.result[i].start)
      temp[temp.length - 1].end_num = timeToMinutes(res.result[i].end)
      if (timeRange.value[0] === -1) {
        timeRange.value[0] = temp[temp.length - 1].start_num
      }
      if (timeRange.value[1] === -1) {
        timeRange.value[1] = temp[temp.length - 1].end_num
      }
      if (temp[temp.length - 1].start_num <= timeRange.value[0]) {
        timeRange.value[0] = temp[temp.length - 1].start_num
      }
      if (temp[temp.length - 1].end_num >= timeRange.value[1]) {
        timeRange.value[1] = temp[temp.length - 1].end_num
      }
    }
    sequenceList.value = temp
    console.log('当前浏览时间', currentTime.value)
    receiveCurrentTimeChange(currentTime.value)
    timeSelectRefresh.value = new Date().getTime()
  })
}

function deleteSequence(index: number) {
  ElMessageBox.prompt('请输入“已确定要删除该流程”继续删除，该操作将删除与之对应的检查数据(基础数据不受影响)，建议使用停用功能', '请确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    inputPattern: /^已确定要删除该流程$/, // 官方正则校验
    inputErrorMessage: '请输入正确文字：已确定要删除该流程', // 官方错误提示
  })
    .then(({ value }) => {
      if (value === '已确定要删除该流程') {
        ElMessage({
          type: 'success',
          message: '流程已删除',
        })
        deleteSequenceBySid(currentSequenceList.value[index].id).then(() => {
          init()
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

function deactivateSequence(index: number) {
  ElMessageBox.confirm(
    `确定要停用名为${currentSequenceList.value[index].name}的流程吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then((res) => {
      if (res === 'confirm') {
        deactivateSequenceBySid(currentSequenceList.value[index].id).then(() => {
          init()
          ElMessage({
            type: 'success',
            message: '已停用',
          })
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消停用',
      })
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
  <div>
    <div v-if="timeRange[0] > 0 && timeRange[1] > 0">
      <timeSelect :key="timeSelectRefresh" :start="timeRange[0]" :end="timeRange[1]" @current-time="receiveCurrentTimeChange" />
    </div>
    <div class="mt-2">
      <el-card class="rounded-xl cursor-pointer" @click="creatSequenceDialog = true">
        <div class="flex gap-2">
          <div>
            创建流程
          </div>
          <div>
            <el-icon size="25">
              <SvgIcon name="add-green" />
            </el-icon>
          </div>
        </div>
      </el-card>
      <div class="flex gap-1 mt-2 max-w-100% overflow-auto">
        <TransitionGroup name="slide-fade">
          <div v-for="(item, index) in currentSequenceList" :key="`${item.name}_${index}`" class="flex w-80">
            <el-card class="rounded-xl w-83">
              <div class="h-100 overflow-auto">
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
                <el-button type="success" link>
                  编辑
                </el-button>
                <el-button type="warning" link @click="deactivateSequence(index)">
                  停用
                </el-button>
                <el-button type="danger" link @click="deleteSequence(index)">
                  删除
                </el-button>
              </template>
            </el-card>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <XtDialog v-model="creatSequenceDialog" title="添加流程节点" :show-cancel="false" :show-confirm="false" @cancel="creatSequenceDialog = false">
      <sequenceCreate
        :start="`${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`"
        @cancel="creatSequenceDialog = false"
        @confirm="init(), creatSequenceDialog = false"
      />
    </XtDialog>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>

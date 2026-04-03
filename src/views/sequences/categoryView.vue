<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'
import { getInspectionItems } from '@/axios/interfaceWorkBase'
import createInspection from './inspection/createInspection.vue'

interface inspectionOpt {
  id: number
  name: string
  teamID: number
  c_type: {
    id: number
    name: string
  }
}
interface SpanMethodProps {
  row: inspectionOpt
  column: TableColumnCtx<inspectionOpt>
  rowIndex: number
  columnIndex: number
}

const teamIdSpanArr = ref<number[]>([])
const teamNameSpanArr = ref<number[]>([])
const inspection = ref<inspectionOpt[]>([])
const createInspectionDialog = ref(false)
function init() {
  getInspectionItems().then(({ data: res }) => {
    console.log(res)
    inspection.value = res.result
    teamIdSpanArr.value = getSpanArr(inspection.value)
    teamNameSpanArr.value = getSpanArr(inspection.value)
  })
}

function getSpanArr(data: inspectionOpt[]) {
  const spanArr: number[] = []
  let pos = 0

  while (pos < data.length) {
    let count = 1
    const currentTeamId = data[pos].teamID

    // 统计相同 teamId 的数量
    for (let i = pos + 1; i < data.length; i++) {
      if (data[i].teamID === currentTeamId) {
        count++
      }
      else {
        break
      }
    }

    // 记录该团队需要合并的行数
    for (let i = 0; i < count; i++) {
      spanArr.push(i === 0 ? count : 0)
    }

    pos += count
  }

  return spanArr
}

function objectSpanMethod({
  rowIndex,
  columnIndex,
}: SpanMethodProps) {
  // 团队ID列（索引1）和团队名称列（索引2）需要合并
  if (columnIndex === 1) { // teamId 列
    const rowspan = teamIdSpanArr.value[rowIndex]
    if (rowspan > 0) {
      return {
        rowspan,
        colspan: 1,
      }
    }
    else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
  else if (columnIndex === 2) { // teamName 列
    const rowspan = teamNameSpanArr.value[rowIndex]
    if (rowspan > 0) {
      return {
        rowspan,
        colspan: 1,
      }
    }
    else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }

  // 其他列不合并
  return {
    rowspan: 1,
    colspan: 1,
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-button type="warning" @click="createInspectionDialog = true">
      增加检查内容
    </el-button>
    <el-card class="w-50% mt-5">
      <el-table
        :data="inspection"
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column prop="c_type.name" label="检查内容" width="180" />
        <el-table-column prop="name" label="标题" />
      </el-table>
    </el-card>
    <XtDialog v-model="createInspectionDialog" title="增加检查内容" :show-cancel="false" :show-confirm="false" @cancel="createInspectionDialog = false">
      <createInspection @cancel="createInspectionDialog = false" @confirm="init(), createInspectionDialog = false" />
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

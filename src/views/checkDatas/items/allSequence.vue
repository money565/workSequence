<script setup lang="ts">
import { getTodaySequencesByProject } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'

interface IProps {
  date: Date
}

interface sequenceList {
  id: number
  name: string
  posit: {
    id: number
    name: string
  }
  floor: {
    id: number
    name: string
  }
  plant: {
    id: number
    isPlant: boolean
    name: string
  } | undefined
  start: string
  end: string
}

const props = defineProps<IProps>()
const acs = useAppCacheStore()
const page = ref(1)
const total = ref(1)
const perpage = ref(20)
const sq_list = ref<sequenceList[]>([])

function viewDatas(seq_id: number, target: string) {
  console.log(seq_id, target)
}

function init() {
  getTodaySequencesByProject(acs.currentProject, props.date.getFullYear(), props.date.getMonth() + 1, props.date.getDate(), page.value, perpage.value).then(({ data: res }) => {
    sq_list.value = res.result
    total.value = res.total
  })
}

onMounted(() => {
  init()
})

watch(() => props.date, () => {
  init()
})

watch(() => acs.currentProject, () => {
  init()
})
</script>

<template>
  <div>
    <el-table :data="sq_list" style="width: 100%;" height="700">
      <el-table-column prop="name" label="序号" width="80" align="center">
        <template #default="scoped">
          <el-text>
            {{ scoped.$index + 1 + (page - 1) * perpage }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程名称" width="500" align="center" />
      <el-table-column prop="floor.name" label="计划" width="80" align="center">
        <template #default="scoped">
          <el-text :type="scoped.row.plant === undefined ? 'success' : 'primary'">
            {{ scoped.row.plant === undefined ? '否' : '是' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="posit.name" label="位置" width="180" align="center" />
      <el-table-column prop="floor.name" label="楼层" width="180" align="center" />
      <el-table-column prop="start" label="开始" width="120" align="center" />
      <el-table-column prop="end" label="结束" width="120" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scoped">
          <div class="flex gap-2">
            <el-button type="warning" link @click="viewDatas(scoped.row.id, 'tools')">
              工具
            </el-button>
            <el-button type="primary" link @click="viewDatas(scoped.row.id, 'task')">
              任务
            </el-button>
            <el-button type="success" link @click="viewDatas(scoped.row.id, 'objs')">
              流程对象
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:page-size="perpage" v-model:current-page="page" background layout="prev, pager, next" :total="total" @change="init()" />
  </div>
</template>

<style scoped>

</style>

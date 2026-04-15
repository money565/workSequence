<script setup lang="ts">
import type { TASK_OPT } from '@/views/sequences/target'
import { createPlant, getActionTargetsWithOutTypes, getInspectionItems, getObjectsTreeTypes, getToolsTree } from '@/axios/interfaceWorkBase'
import treeView from '@/views/public/treeView.vue'

interface IProps {
  kindId: number
  kindName: string
}
interface PLANT_CREATE {
  name: string
  types: number[]
  action: number[]
  tools: number[]
  cycle: number
  ex_date: number
  ins: number[]
  parent: number
}
const props = defineProps<IProps>()
const emits = defineEmits(['confirm', 'cancel'])
const form = reactive<PLANT_CREATE>({
  name: '',
  types: [],
  action: [],
  tools: [],
  cycle: 0,
  ex_date: 1,
  ins: [],
  parent: props.kindId,
})
const objsTree = ref<TASK_OPT[]>([])
const taskTargets = ref<TASK_OPT[]>([])
const tools = ref<TASK_OPT[]>([])
const insList = ref<TASK_OPT[]>([])
function init() {
  getObjectsTreeTypes().then(({ data: res }) => {
    objsTree.value = res.result
  })
  getActionTargetsWithOutTypes().then(({ data: res }) => {
    taskTargets.value = res.result
  })
  getToolsTree().then(({ data: res }) => {
    tools.value = res.result
  })
  getInspectionItems().then(({ data: res }) => {
    insList.value = res.result
  })
}

function onSubmit() {
  createPlant(form).then(() => {
    emits('confirm')
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="max-h-170 overflow-auto">
    <el-form :model="form" label-width="auto" style="max-width: 900px">
      <el-form-item label="计划类别">
        <text>{{ props.kindName }}</text>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input v-model="form.name" placeholder="请输入计划名称" />
      </el-form-item>
      <el-form-item label="计划周期">
        <el-radio-group v-model="form.cycle">
          <el-radio :value="1">
            周任务
          </el-radio>
          <el-radio :value="2">
            月任务
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执行日期">
        <div>
          <el-select v-if="form.cycle === 1" v-model="form.ex_date" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in [
                { label: '星期一', value: 1 },
                { label: '星期二', value: 2 },
                { label: '星期三', value: 3 },
                { label: '星期四', value: 4 },
                { label: '星期五', value: 5 },
                { label: '星期六', value: 6 },
                { label: '星期日', value: 7 },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="form.cycle === 2" v-model="form.ex_date" placeholder="Select" style="width: 240px">
            <el-option
              v-for="d in 31"
              :key="d"
              :label="`${d}日`"
              :value="d"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="流程对象类型">
        <div class="w-60">
          <treeView :res-list="objsTree" :expand="false" @selected="(value) => form.types = value" />
        </div>
      </el-form-item>
      <el-form-item label="流程目的">
        <div class="w-60">
          <treeView :res-list="taskTargets" :expand="false" @selected="(value) => form.action = value" />
        </div>
      </el-form-item>
      <el-form-item label="工具">
        <div class="w-60">
          <treeView :res-list="tools" :expand="false" @selected="(value) => form.tools = value" />
        </div>
      </el-form-item>
      <el-form-item label="检查内容">
        <div class="w-60">
          <treeView :res-list="insList" :expand="false" @selected="(value) => form.ins = value" />
        </div>
      </el-form-item>
      <el-form-item>
        <div class="w-100% flex items-center justify-end">
          <el-button @click="emits('cancel')">
            取消
          </el-button>
          <el-button type="primary" @click="onSubmit">
            确定
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>

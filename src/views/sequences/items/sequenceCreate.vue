<script setup lang="ts">
import type { PLANT } from '@/views/cleanPlant/items/plant_interface'
import type { FormInstance, FormRules } from 'element-plus'
import type { TASK_OPT, TASK_OPT_OBJ_EXT } from '../target'
import { createSequence, getEmpByProject, getFloor, getInspectionItems, getObjsWithPosit, getPlantTree, getPositWithFloor, getToolsTree } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import treeView from '@/views/public/treeView.vue'
import { ElMessageBox } from 'element-plus'
import targetSelect from './targetSelect.vue'

interface formOpt {
  name: string
  plant: boolean | undefined
  plantList: number[]
  floor: number | undefined
  posit: number | undefined
  objs: number[]
  start: string
  end: string
  ins: number[]
  tools_accuracy: boolean
  tools: number[]
  emp_accuracy: boolean
  emp: number[]
  target: number[]
}

const emits = defineEmits(['cancel', 'confirm'])
const acs = useAppCacheStore()
const floorList = ref<{ name: string, id: number }[]>([])
const positLit = ref<{ name: string, id: number }[]>([])
const objstLit = ref<TASK_OPT_OBJ_EXT[]>([])
const inspectionItems = ref<TASK_OPT[]>([])
const toolsList = ref<TASK_OPT[]>([])
const empList = ref<{ id: number, name: string }[]>([])
const ruleFormRef = ref<FormInstance>()
const plantList = ref<PLANT[]>([])
const plantTreeRef = ref()
const defaultProps = {
  children: 'children',
  label: 'name',
}
const form = reactive<formOpt>({
  name: '',
  plant: undefined,
  plantList: [],
  floor: undefined,
  posit: undefined,
  objs: [],
  start: '',
  end: '',
  ins: [],
  tools_accuracy: false,
  tools: [],
  emp_accuracy: false, // 人员不用精确
  emp: [],
  target: [],
})

function init() {
  getFloor(acs.currentProject).then(({ data: res }) => {
    floorList.value = res.result
  })
  getInspectionItems().then(({ data: res }) => {
    inspectionItems.value = res.result
  })
}
function getTools() {
  if (form.tools_accuracy === true) {
    getToolsTree().then(({ data: res }) => {
      toolsList.value = res.result
    })
  }
}

function getEmps() {
  if (form.emp_accuracy === true) {
    getEmpByProject(acs.currentProject).then(({ data: res }) => {
      empList.value = res.result
    })
  }
}

function getPositList() {
  form.posit = undefined
  form.objs = []
  positLit.value = []
  objstLit.value = []
  if (form.floor !== undefined) {
    getPositWithFloor(form.floor).then(({ data: res }) => {
      positLit.value = res.result
    })
  }
}

function getObjsList() {
  form.objs = []
  objstLit.value = []
  if (form.posit !== undefined) {
    getObjsWithPosit(form.posit).then(({ data: res }) => {
      objstLit.value = res.result
    })
  }
}

function reset() {
  form.name = ''
  form.plant = undefined
  form.floor = undefined
  form.posit = undefined
  form.objs = []
  form.start = ''
  form.end = ''
  form.ins = []
  form.tools_accuracy = false
  form.tools = []
  form.emp_accuracy = false// 人员不用精确
  form.emp = []
  form.target = []
  form.plantList = []
  floorList.value = []
  positLit.value = []
  objstLit.value = []
  inspectionItems.value = []
  toolsList.value = []
  empList.value = []
}

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid, fields) => {
    if (valid) {
      createSequence(form).then(() => {
        emits('confirm')
      })
    }
    else {
      ElMessageBox.alert(`上传错误请联系管理员${fields}`, '错误', {
        confirmButtonText: '确定',
      })
    }
  })
}

const rules = reactive<FormRules<formOpt>>({
  name: [
    { required: true, message: '请输入流程名称', trigger: 'blur' },
    { min: 3, max: 100, message: '请输入3到100字', trigger: 'blur' },
  ],
  floor: [
    {
      required: true,
      message: '请选择楼层',
      trigger: 'change',
    },
  ],
  plant: [{
    required: true,
    message: '选择流程类型',
    trigger: 'change',
  }],
  plantList: [{
    required: true,
    message: '选择计划',
    trigger: 'change',
  }],
  posit: [
    {
      required: true,
      message: '请选择位置',
      trigger: 'change',
    },
  ],

  target: [
    {
      type: 'array',
      required: true,
      message: '至少选择一个任务',
      trigger: 'change',
    },
  ],

  objs: [
    {
      type: 'array',
      required: true,
      message: '至少选择一个流程对象',
      trigger: 'change',
    },
  ],
  start: [
    {
      required: true,
      message: '选择开始时间',
      trigger: 'change',
    },
  ],
  end: [
    {
      required: true,
      message: '选择结束时间',
      trigger: 'change',
    },
    {
      validator: (rule, value, callback) => {
        // 没选结束时间就跳过（由必填规则处理）
        if (!value)
          return callback()

        if (value <= form.start) {
          callback(new Error('结束必大于开始时间'))
        }
        else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  ins: [
    {
      required: true,
      message: '请选择检查模板',
      trigger: 'change',
    },
  ],
  tools: [
    {
      type: 'array',
      required: true,
      message: '至少选择一个工具',
      trigger: 'change',
    },
  ],
  emp: [
    {
      type: 'array',
      required: true,
      message: '至少选择一个人员',
      trigger: 'change',
    },
  ],
})

function handleStartChange() {
  if (ruleFormRef.value) {
    ruleFormRef.value.validateField('end')
  }
}

function getObjectSelected(value: number[] | string[]) {
  const temp: number[] = []
  for (const v in value) {
    if (typeof value[v] !== 'number') {
      temp.push(Number(String(value[v]).replace('o_', '')))
    }
  }
  form.objs = temp
}

function selectedPlant() {
  const selected = plantTreeRef.value?.getCheckedNodes() || []
  const id_list = []
  for (const i in selected) {
    id_list.push(selected[i].id)
  }
  form.plantList = id_list
}

function getTargetSelect(value: number[]) {
  form.target = value
}

function plantKindChange() {
  if (form.plant) {
    getPlantTree().then(({ data: res }) => {
      plantList.value = res.result
    })
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="max-h-180 overflow-auto">
    <el-form
      ref="ruleFormRef"
      :model="form"
      label-width="auto"
      style="max-width: 600px"
      :rules="rules"
    >
      <el-form-item label="流程类型：" prop="plant">
        <el-radio-group v-model="form.plant" @change="plantKindChange">
          <!-- works when >=2.6.0, recommended ✔️ not work when <2.6.0 ❌ -->
          <el-radio :value="false">
            日常流程
          </el-radio>
          <!-- works when <2.6.0, deprecated act as value when >=3.0.0 -->
          <el-radio :value="true">
            计划清洁
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="流程名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item v-if="form.plant" label="选择计划：" prop="plantList">
        <el-tree
          ref="plantTreeRef"
          style="max-width: 600px"
          :data="plantList"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          @check="selectedPlant"
        />
      </el-form-item>
      <el-form-item v-if="!form.plant" label="流程目的：" prop="target">
        <div class="max-h-100 overflow-auto w-100%">
          <targetSelect @selected="getTargetSelect" />
        </div>
      </el-form-item>
      <el-form-item label="楼层：" prop="floor">
        <el-select v-model="form.floor" placeholder="请选择楼层" @change="getPositList">
          <el-option
            v-for="item in floorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="位置：" prop="posit">
        <el-select v-model="form.posit" placeholder="请选择楼层" @change="getObjsList">
          <el-option
            v-for="item in positLit"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!form.plant" label="流程对象：" prop="objs">
        <div v-if="objstLit.length > 0" class="w-100%">
          <treeView :expand="false" :res-list="objstLit" @selected="getObjectSelected" />
        </div>
        <div v-else-if="form.posit === undefined">
          请先选择位置
        </div>
        <div v-else>
          该位置下没有流程对象
        </div>
      </el-form-item>
      <el-form-item label="流程时间：" required class="mt-10">
        <div class="h-12 overflow-auto flex gap-2">
          <el-col :span="10">
            <el-form-item prop="start">
              <el-time-picker
                v-model="form.start"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                style="width: 10rem;"
                @change="handleStartChange"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="end">
              <el-time-picker
                v-model="form.end"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                style="width: 10rem;"
              />
            </el-form-item>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item v-if="!form.plant" label="检查模板：" prop="ins">
        <div>
          <treeView :expand="false" :res-list="inspectionItems" @selected="(value) => form.ins = value" />
        </div>
      </el-form-item>
      <el-form-item v-if="!form.plant" label="工具：">
        <div class="flex flex-col">
          <div>
            <el-radio-group v-model="form.tools_accuracy" @change="getTools">
              <el-radio :value="true">
                精确到工具
              </el-radio>
              <el-radio :value="false">
                模糊
              </el-radio>
            </el-radio-group>
          </div>

          <div>
            <el-form-item v-if="toolsList.length > 0 && form.tools_accuracy" prop="tools" class="w-150%">
              <treeView :res-list="toolsList" :expand="false" @selected="(value) => form.tools = value" />
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="人员：">
        <el-radio-group v-model="form.emp_accuracy" @change="getEmps">
          <el-radio :value="true">
            精确到人
          </el-radio>
          <el-radio :value="false">
            模糊
          </el-radio>
          <el-form-item v-if="empList.length > 0 && form.emp_accuracy" prop="emp">
            <el-checkbox-group v-model="form.emp">
              <el-checkbox v-for="(item, index) in empList" :key="index" :label="item.name" :value="item.id" />
            </el-checkbox-group>
          </el-form-item>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="w-100% flex items-end justify-end mt-10">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
          <el-button @click="reset, emits('cancel')">
            取消
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>

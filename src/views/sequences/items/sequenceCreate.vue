<script setup lang="ts">
import type { FormInstance, FormRules, TreeNode } from 'element-plus'
import { createSequence, getCurrentTools, getEmpByProject, getFloor, getInspectionItemsGroup, getObjsWithPosit, getPositWithFloor } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { flattenTree, task_target } from '../target'
import targetSelect from './targetSelect.vue'

interface formOpt {
  name: string
  floor: number | undefined
  posit: number | undefined
  objs: number[]
  start: string
  end: string
  ins: string
  tools_accuracy: boolean
  tools: number[]
  emp_accuracy: boolean
  emp: number[]
  target: number[]
}
interface IProp {
  start: string
}
const props = defineProps<IProp>()
const emits = defineEmits(['cancel', 'confirm'])
const acs = useAppCacheStore()
const floorList = ref<{ name: string, id: number }[]>([])
const positLit = ref<{ name: string, id: number }[]>([])
const objstLit = ref<{ name: string, id: number, type: string }[]>([])
const inspectionItems = ref<{ label: string, value: string, ins: number[] }[]>([])
const insChoices = ref<{ [key: number]: string }>({})
const toolsList = ref<{ id: number, name: string, specification: string, type: string }[]>([])
const empList = ref<{ id: number, name: string }[]>([])
const ruleFormRef = ref<FormInstance>()
const form = reactive<formOpt>({
  name: '',
  floor: undefined,
  posit: undefined,
  objs: [],
  start: props.start,
  end: '',
  ins: '',
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
  getInspectionItemsGroup().then(({ data: res }) => {
    console.log('检查列表', res)
    const temp = []
    for (const i in res.result) {
      temp.push({
        label: res.result[i].name,
        value: i,
        ins: res.result[i].types,
      })
    }
    inspectionItems.value = temp
    for (const j in res.choices) {
      insChoices.value[res.choices[j][0]] = res.choices[j][1]
    }
    console.log(insChoices.value)
  })
}
function getTools() {
  if (form.tools_accuracy === true) {
    getCurrentTools().then(({ data: res }) => {
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

function makeInsTips() {
  let index = -1
  let tips = ''
  for (const i in inspectionItems.value) {
    if (inspectionItems.value[i].value === form.ins) {
      index = Number(i)
    }
  }
  if (index !== -1) {
    for (const j in inspectionItems.value[index].ins) {
      tips = `${tips + insChoices.value[inspectionItems.value[index].ins[j]]}、`
    }
  }
  return tips
}

function selectAllObject() {
  for (const o in objstLit.value) {
    form.objs.push(objstLit.value[o].id)
  }
}

function reset() {
  form.name = ''
  form.floor = undefined
  form.posit = undefined
  form.objs = []
  form.start = ''
  form.end = ''
  form.ins = ''
  form.tools_accuracy = false
  form.tools = []
  form.emp_accuracy = false// 人员不用精确
  form.emp = []
  form.target = []
  floorList.value = []
  positLit.value = []
  objstLit.value = []
  inspectionItems.value = []
  insChoices.value = []
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
      console.log('error submit!', fields)
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
  posit: [
    {
      required: true,
      message: '请选择位置',
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
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  end: [
    {
      required: true,
      message: 'Please pick a time',
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

function selectedTarget(value: any) {
  const index = form.target.findIndex(item => item === value.id)
  console.log('找到index', index)
  if (index === -1) {
    form.target.push(value.id)
  }
  else {
    form.target.splice(index, 1)
  }
  console.log(form.target)
}

onMounted(() => {
  console.log(props.start)
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
      <el-form-item label="流程名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item label="流程目的：" prop="name">
        <div class="max-h-100 overflow-auto w-100%">
          <targetSelect @selected="selectedTarget" />
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
      <el-form-item prop="objs">
        <template #label>
          <div class="flex justify-center items-center max-h-100">
            <div class="mb-5">
              <div>
                流程对象：
              </div>
              <div v-if="objstLit.length > 0">
                <el-button type="primary" link @click="selectAllObject">
                  全选
                </el-button>
              </div>
            </div>
          </div>
        </template>
        <div v-if="objstLit.length > 0" class="max-h-50 overflow-auto">
          <el-checkbox-group v-model="form.objs">
            <el-checkbox v-for="(item, index) in objstLit" :key="index" :label="item.name" :value="item.id" />
          </el-checkbox-group>
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
      <el-form-item label="检查模板：" prop="ins">
        <div>
          <div class="max-h-50 overflow-auto">
            <el-select v-model="form.ins" placeholder="选择检查模板" style="width: 240px" @change="makeInsTips">
              <el-option
                v-for="item in inspectionItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-text type="info">
              {{ makeInsTips() }}
            </el-text>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="inspectionItems.find(item => item.value === form.ins)?.ins?.includes(1)" label="工具：">
        <el-radio-group v-model="form.tools_accuracy" @change="getTools">
          <el-radio :value="true">
            精确到工具
          </el-radio>
          <el-radio :value="false">
            模糊
          </el-radio>
        </el-radio-group>
        <el-form-item v-if="toolsList.length > 0 && form.tools_accuracy" prop="tools">
          <el-checkbox-group v-model="form.tools">
            <el-checkbox v-for="(item, index) in toolsList" :key="index" :label="item.name" :value="item.id" />
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="inspectionItems.find(item => item.value === form.ins)?.ins?.includes(4)" label="人员：">
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

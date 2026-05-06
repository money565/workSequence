<script setup lang="ts">
import type { TASK_OPT } from '../../target'
import { editSeq, getActionTargetsWithOutTypes, getFloor, getObjsWithPosit, getOtherPositWithPosit } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import treeView from '@/views/public/treeView.vue'

interface IProps {
  id: number
  trunOn: boolean
  title: string
  target: 'title' | 'c_time' | 'floor' | 'posit' | 'objs' | 'target' | 'tools' | 'ins' | undefined
  value: string | number | string[] | number[] | undefined
  addition?: number
}
const props = defineProps<IProps>()
const emits = defineEmits(['confirm', 'cancel'])
const turnOn = ref(false)
const editValue = ref()
const acs = useAppCacheStore()
const floorList = ref<{ id: number, name: string }[]>([])
const positList = ref<{ id: number, name: string }[]>([])
const objstLit = ref<TASK_OPT[]>([])
const objsSelect = ref<string[]>([])
const taskTargets = ref<TASK_OPT[]>([])
const taskSelect = ref<number[]>([])

function upLoadEditDatas() {
  let up_value: any
  if (props.target === 'objs') {
    up_value = []
    for (const i in objsSelect.value) {
      if (typeof objsSelect.value[i] === 'string') {
        up_value.push(Number(objsSelect.value[i].replace('o_', '')))
      }
      else {
        up_value.push(objsSelect.value[i])
      }
    }
    console.log(up_value)
  }
  else {
    up_value = editValue.value
  }
  const params = {
    t: props.target,
    sid: props.id,
    value: up_value,
  }
  editSeq(params).then(() => {
    turnOn.value = false
    emits('confirm')
  })
}

watch(() => props.trunOn, () => {
  if (props.trunOn) {
    turnOn.value = true
    editValue.value = props.value
    if (props.target === 'floor') {
      getFloor(acs.currentProject).then(({ data: res }) => {
        floorList.value = res.result
      })
    }
    if (props.target === 'posit' && typeof props.value === 'number') {
      getOtherPositWithPosit(props.value).then(({ data: res }) => {
        positList.value = res.result
      })
    }
    if (props.target === 'objs' && typeof props.addition === 'number') {
      getObjsWithPosit(props.addition).then(({ data: res }) => {
        objstLit.value = res.result
        if (Array.isArray(props.value) && props.value.every(i => typeof i === 'string')) {
          objsSelect.value = props.value
        }
      })
    }
    if (props.target === 'target' && Array.isArray(props.value) && props.value.every(item => typeof item === 'number' && !Number.isNaN(item))) {
      getActionTargetsWithOutTypes().then(({ data: res }) => {
        taskTargets.value = res.result
        taskSelect.value = props.value as number[]
      })
    }
  }
})
</script>

<template>
  <div>
    <XtDialog v-model="turnOn" :title="props.title" @cancel="turnOn = false, emits('cancel')" @confirm="upLoadEditDatas">
      {{ props }}
      <div v-if="props.target === 'title' && typeof editValue === 'string'">
        <el-input v-model="editValue" />
      </div>
      <div v-if="props.target === 'c_time' && typeof editValue[0] === 'string' && typeof editValue[1] === 'string' && editValue.length === 2">
        <div class="flex gap-4">
          <div>开始：</div>
          <el-time-picker
            v-model="editValue[0]"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间"
            style="width: 10rem;"
          />
        </div>
        <div class="flex gap-4 mt-4">
          <div>结束：</div>
          <el-time-picker
            v-model="editValue[1]"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间"
            style="width: 10rem;"
          />
        </div>
      </div>
      <div v-if="props.target === 'floor'">
        <el-select v-model="editValue" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in floorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div v-if="props.target === 'posit'">
        <el-select v-model="editValue" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in positList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div v-if="props.target === 'objs'">
        <treeView :expand="false" :res-list="objstLit" :value="editValue" @selected="(value) => objsSelect = value" />
      </div>
      <div v-if="props.target === 'target'">
        <treeView :expand="false" :res-list="taskTargets" :value="editValue" @selected="(value) => objsSelect = value" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

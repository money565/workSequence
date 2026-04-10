<script lang="ts" setup>
import type { TASK_OPT } from '../target'
import { getActionTargetsWithOutTypes } from '@/axios/interfaceWorkBase'
import treeView from '@/views/public/treeView.vue'

const emits = defineEmits(['selected'])
const taskTargets = ref<TASK_OPT[]>([])
function init() {
  getActionTargetsWithOutTypes().then(({ data: res }) => {
    console.log(res)
    taskTargets.value = res.result
  })
}
function nodeClick(value: number[]) {
  emits('selected', value)
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <treeView :res-list="taskTargets" :expand="false" @selected="nodeClick" />
  </div>
</template>

<style lang="scss">

</style>

<script lang="ts" setup>
import type { TASK_OPT } from './target'
import { getActionTargets } from '@/axios/interfaceWorkBase'
import treeViewWithEdit from '../public/treeViewWithEdit.vue'

const taskTargets = ref<TASK_OPT[]>([])
const types = ref<{ id: number, name: string, icon: string }[]>([])
function init() {
  getActionTargets().then(({ data: res }) => {
    taskTargets.value = res.result
    types.value = res.types
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <treeViewWithEdit :datas="taskTargets" :types="types" sort="action" :expand="false" @create="init()" @delete="init()" />
  </div>
</template>

<style lang="scss" scoped>

</style>

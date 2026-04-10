<script setup lang="ts">
import type { TASK_OPT } from './target'
import { getToolsTreeWithTypes } from '@/axios/interfaceWorkBase'
import treeViewWithEdit from '../public/treeViewWithEdit.vue'

const toolsList = ref<TASK_OPT[]>([])
const types = ref<{ id: number, name: string, icon: string }[]>([])
function init() {
  getToolsTreeWithTypes().then(({ data: res }) => {
    toolsList.value = res.result
    types.value = res.types
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <treeViewWithEdit :datas="toolsList" :types="types" sort="tools" :expand="false" @create="init()" />
  </div>
</template>

<style scoped>

</style>

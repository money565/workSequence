<script setup lang="ts">
import type { TASK_OPT } from './target'
import { getObjectTypesTree } from '@/axios/interfaceWorkBase'
import treeViewWithEdit from '../public/treeViewWithEdit.vue'

const objsList = ref<TASK_OPT[]>([])
function init() {
  getObjectTypesTree().then(({ data: res }) => {
    console.log(res)
    objsList.value = res.result
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <treeViewWithEdit :datas="objsList" :types="[]" sort="objs" :expand="false" @create="init()" />
  </div>
</template>

<style scoped>

</style>

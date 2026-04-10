<script setup lang="ts">
import type { TASK_OPT } from './target'
import { getInspectionItemsWithTypes } from '@/axios/interfaceWorkBase'
import treeViewWithEdit from '../public/treeViewWithEdit.vue'

const insList = ref<TASK_OPT[]>([])
const types = ref<{ id: number, name: string, icon: string }[]>([])
function init() {
  getInspectionItemsWithTypes().then(({ data: res }) => {
    insList.value = res.result
    types.value = res.types
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <treeViewWithEdit :datas="insList" :types="types" sort="ins" :expand="false" @create="init()" />
  </div>
</template>

<style scoped>

</style>

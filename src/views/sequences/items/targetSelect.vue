<script lang="ts" setup>
import type { TreeNode } from 'element-plus'
import type { TASK_OPT } from '../target'
import { getActionTargetsWithOutTypes } from '@/axios/interfaceWorkBase'

const emits = defineEmits(['selected'])
const taskTargets = ref<TASK_OPT[]>([])
function init() {
  getActionTargetsWithOutTypes().then(({ data: res }) => {
    console.log(res)
    taskTargets.value = res.result
  })
}
function nodeClick(nodes: TreeNode[]) {
  emits('selected', nodes)
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-tree
      style="max-width: 50rem"
      :data="taskTargets"
      default-expand-all
      node-key="id"
      :show-checkbox="true"
      @check="nodeClick"
    >
      <template #default="{ data }">
        <div v-if="data.id !== undefined" class="flex gap-2">
          <div class="flex items-center justify-start w-10 mt-4">
            <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${data.icon}.svg`" style="width:1rem" />
          </div>
          <div class="flex items-center justify-start w-10">
            <el-text>
              {{ data.name }}
            </el-text>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss">
/* 🔥 核心：提高 el-tree 行高 */
.el-tree-node__content {
  height: 1.5rem !important; /* 行高：默认34px → 改大即可 */
}
.el-tree-node__children {
  padding-left: 2rem !important;
}
/* 展开时旋转更顺 */
.el-tree-node__expand-icon.is-opened {
  transform: rotate(90deg) scale(1.1);
}
</style>

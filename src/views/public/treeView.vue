<script setup lang="ts">
import type { TASK_OPT } from '../sequences/target'

interface IProps {
  resList: TASK_OPT[]
  expand: boolean
}
const props = defineProps<IProps>()
const emits = defineEmits(['selected'])
const selected = ref<number[]>([])

function selectedTarget(value: any) {
  const index = selected.value.findIndex(item => item === value.id)
  if (index === -1) {
    selected.value.push(value.id)
  }
  else {
    selected.value.splice(index, 1)
  }
  emits('selected', selected.value)
}
</script>

<template>
  <div>
    <el-tree
      :data="props.resList"
      :default-expand-all="props.expand"
      node-key="id"
      :show-checkbox="true"
      @check="selectedTarget"
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
  padding-left: 1rem !important;
}
/* 展开时旋转更顺 */
.el-tree-node__expand-icon.is-opened {
  transform: rotate(90deg) scale(1.1);
}
</style>

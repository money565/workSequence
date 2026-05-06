<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils/index.mjs'

interface IProps {
  title: string
  type: EpPropMergeType<StringConstructor, 'success' | 'warning' | 'info' | 'primary' | 'danger', unknown> | undefined
  items: {
    id: number
    name: string
  }[]
}
const props = defineProps<IProps>()

function getString(objs: { id: number, name: string }[]) {
  let strs = ''
  for (const i in objs) {
    strs = `${strs + objs[i].name}、`
    if (strs.length > 15) {
      const lastChar = strs.charAt(strs.length - 1)
      // 判断是否是 、 或 ，
      if (lastChar === '、' || lastChar === '，') {
        return strs.slice(0, -1) // 删除最后一个字符
      }
      return strs
    }
  }
  return strs.slice(0, -1)
}
</script>

<template>
  <div>
    <div class="cursor-pointer">
      <el-popover
        :title="props.title"
        placement="bottom"
        width="350"
        :show-after="512"
      >
        <template #reference>
          <el-text class="flex gap-2" :type="props.type">
            <div class="w-70% truncate">
              {{ getString(props.items) }}
            </div>
            <div class="w-30%">
              ({{ props.items.length }}个)
            </div>
          </el-text>
        </template>
        <div class="flex flex-wrap gap-2">
          <el-tag v-for="(item, index) in props.items" :key="index" :type="props.type">
            {{ item.name }}
          </el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>

</style>

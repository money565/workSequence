<script setup lang="ts">
import { getProjectList } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const props = defineProps<{ width: number }>()
const width = computed(() => {
  if (props.width === undefined) {
    return 10
  }
  else {
    return props.width
  }
})
const acs = useAppCacheStore()
onMounted(() => {
  if (acs.projectList.length === 0) {
    getProjectList().then(({ data: res }) => {
      if (res.result.length > 0) {
        acs.projectList = res.result
        acs.currentProject = res.result[0].value
      }
    })
  }
})
</script>

<template>
  <div>
    <el-select
      v-model="acs.currentProject"
      placeholder="选择项目"
      size="default"
      :style="{ width: `${width}rem` }"
    >
      <el-option
        v-for="item in acs.projectList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>

</style>

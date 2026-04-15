<script setup lang="ts">
import { createPlantKinds, getPlantKinds } from '@/axios/interfaceWorkBase'

const plantKind_list = ref<{ id: number, name: string }[]>([])
const currentName = ref('')
function init() {
  getPlantKinds().then(({ data: res }) => {
    plantKind_list.value = res.result
  })
}

function createPlantKind() {
  const param = {
    name: currentName.value,
  }
  createPlantKinds(param).then(() => {
    currentName.value = ''
    init()
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div v-for="(item, index) in plantKind_list" :key="index">
      <el-card>
        <div class="flex gap-2">
          <div>
            <el-icon size="25">
              <SvgIcon name="kind" />
            </el-icon>
          </div>
          <div>
            <text size="large">
              {{ item.name }}
            </text>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <el-card>
        <div class="flex gap-2 w-30%">
          <el-input v-model="currentName" placeholder="请输入计划类型的名称" />
          <el-button type="primary" :disabled="currentName === ''" @click="createPlantKind">
            新建类型
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>

</style>

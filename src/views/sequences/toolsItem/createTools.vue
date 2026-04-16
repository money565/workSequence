<script setup lang="ts">
import { createTools, getToolsTypes } from '@/axios/interfaceWorkBase'
import { MesgBox } from '@/views/public/item'

interface toolListOpt {
  name: string
  specification: string
  type: string
}
const emits = defineEmits(['cancel', 'confirm'])
const toolsType = ref<{ name: string, id: number, icon: string }[]>([])
const currentToolType = ref(-1)
const loading = ref(false)
const currentTools = reactive<toolListOpt>({
  name: '',
  specification: '',
  type: '',
})

function resetTool() {
  currentTools.name = ''
  currentTools.specification = ''
  currentTools.type = ''
}

function onSubmit() {
  loading.value = true
  if (currentTools.name === '') {
    MesgBox('请输入工具名称', '提示')
    loading.value = false
    return null
  }
  if (currentTools.specification === '') {
    MesgBox('请输入工具规格型号', '提示')
    loading.value = false
    return null
  }
  if (currentToolType.value === -1) {
    MesgBox('请选择工具类型', '提示')
    loading.value = false
    return null
  }
  const param = {
    name: currentTools.name,
    specification: currentTools.specification,
    type: currentToolType.value,
  }
  createTools(param).then(({ data: res }) => {
    if (res.result === 'ok') {
      loading.value = false
      emits('confirm')
    }
    if (res.result === 'repeat') {
      MesgBox('工具名和规格重复', '提示')
      loading.value = false
      return null
    }
    if (res.result === 'fail') {
      MesgBox('服务器错误', '错误')
      loading.value = false
      return null
    }
  })
}
onMounted(() => {
  resetTool()
  getToolsTypes().then(({ data: res }) => {
    const temp = []
    for (const i in res.result) {
      temp.push({
        icon: `https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${res.result[i].icon}.svg`,
        id: res.result[i].id,
        name: res.result[i].name,
      })
    }
    toolsType.value = temp
  })
})
</script>

<template>
  <div>
    <el-form :model="currentTools" label-width="auto" style="max-width: 600px">
      <el-form-item label="工具名称：">
        <el-input v-model="currentTools.name" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="currentTools.specification" />
      </el-form-item>
      <el-form-item label="图标">
        <div class="flex flex-wrap max-h-100 overflow-auto">
          <div
            v-for="(item, index) in toolsType"
            :key="index"
            class="border-dark-600 border-solid border-1"
            :class="{ 'bg-blue-400': currentToolType === item.id }"
          >
            <div @click="currentToolType = item.id">
              <el-image :src="item.icon" style="width: 4rem; height: 4rem; padding: 0.5rem;" />
              <div class="text-center">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="w-100% flex justify-end items-end mt-10">
          <el-button type="primary" :loading="loading" @click="onSubmit">
            确定
          </el-button>
          <el-button @click="emits('cancel')">
            取消
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>

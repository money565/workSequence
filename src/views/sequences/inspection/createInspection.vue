<script setup lang="ts">
import { createInspection, getInspectionChoices } from '@/axios/interfaceWorkBase'

const emits = defineEmits(['cancel', 'confirm'])

const form = reactive({
  name: '',
  inspection: [],
})

const checkOpts = ref()
function init() {
  getInspectionChoices().then(({ data: res }) => {
    checkOpts.value = res.result
  })
}

function onSubmit() {
  const param = {
    name: form.name,
    ins: form.inspection,
  }
  console.log(param)
  createInspection(param).then(() => {
    emits('confirm')
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="标题">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="checkOpts !== undefined" label="检查内容">
        <el-checkbox-group v-model="form.inspection">
          <el-checkbox v-for="(item, index) in checkOpts" :key="index" :label="item" :value="index" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary" @click="onSubmit">
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

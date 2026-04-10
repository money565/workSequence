<script setup lang="ts">
import { createObject, getObjectsTypes } from '@/axios/interfaceWorkBase'
import { MesgBox } from '@/views/public/item'

interface IProps {
  posId: number
}
interface formOpt {
  name: string
  num: number
  type: number
  feq: number
}
const props = defineProps<IProps>()
const emits = defineEmits(['cancel', 'confirm'])
const loading = ref(false)
const form = reactive<formOpt>({
  name: '',
  num: 0,
  type: -1,
  feq: 1,
})
const iconList = ref<{ id: number, name: string, icon: string }[]>([])
function init() {
  getObjectsTypes().then(({ data: res }) => {
    console.log(res)
    const temp = []
    for (const i in res.result) {
      temp.push({
        id: res.result[i].id,
        name: res.result[i].name,
        icon: `https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${res.result[i].icon}.svg`,
      })
    }
    iconList.value = temp
  })
}

function confirmCreateObject() {
  loading.value = true
  if (form.name === '') {
    MesgBox('请输入流程对象名称', '缺少信息')
    loading.value = false
    return null
  }
  if (form.num === 0) {
    MesgBox('请输入流程对象的数量', '缺少信息')
    loading.value = false
    return null
  }
  if (form.type === -1) {
    MesgBox('请选择类型', '缺少信息')
    loading.value = false
    return null
  }
  const param = {
    pos_id: props.posId,
    name: form.name,
    num: form.num,
    type: form.type,
  }
  createObject(param).then(() => {
    loading.value = false
    emits('confirm')
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 800px">
      <el-form-item label="流程对象名称：">
        <el-input v-model="form.name" placeholder="请输入对象名称" />
      </el-form-item>
      <el-form-item label="数量：">
        <el-input-number v-model="form.num" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="维护周期：">
        <el-radio-group v-model="form.feq">
          <el-radio :value="1">
            日常
          </el-radio>
          <el-radio :value="2">
            计划
          </el-radio>
          <el-radio :value="3">
            日常+计划
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型：">
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in iconList"
            :key="index"
            class="border border-solid p-2 cursor-pointer w-15 h-20 flex items-center justify-center"
            :class="{ 'bg-blue-300 border-blue-600': form.type === item.id }"
            @click="form.type = item.id"
          >
            <div>
              <div>
                <el-image style="width: 40px; height: 40px" :src="item.icon" :alt="item.name" />
              </div>
              <div class="text-3">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="w-100% flex justify-end items-end mt-5">
          <el-button @click="emits('cancel')">
            取消
          </el-button>
          <el-button type="primary" :loading="loading" @click="confirmCreateObject">
            确定
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { createTypeIcon, getAllIcons } from '@/axios/interfaceWorkBase'
import { ElMessageBox } from 'element-plus'
import upLoadIcon from './upLoadIcon.vue'

interface ICON_OPT {
  id: number
  name: string
  icon: string
  category: number
}
const objs_icons = ref<ICON_OPT[]>([])
const tools_icons = ref<ICON_OPT[]>([])
const createToolsIconDialog = ref(false)
const createObjsIconDialog = ref(false)
const types = reactive({
  name: '',
  icon: '',
  category: 0,
})
function init() {
  getAllIcons().then(({ data: res }) => {
    const objs_temp: ICON_OPT[] = []
    const tools_temp: ICON_OPT[] = []
    for (const i in res.result) {
      if (res.result[i].category === 1) {
        objs_temp.push(res.result[i])
      }
      if (res.result[i].category === 2) {
        tools_temp.push(res.result[i])
      }
    }
    objs_icons.value = objs_temp
    tools_icons.value = tools_temp
  })
}

function upLoadType() {
  console.log('上传信息', types)
  if (types.name === '') {
    ElMessageBox.alert(`请输入名称`, '缺少信息', {
      type: 'warning',
      confirmButtonText: '确定',
    })
    return null
  }
  if (types.icon === '') {
    ElMessageBox.alert(`请上传svg标志`, '缺少信息', {
      type: 'warning',
      confirmButtonText: '确定',
    })
    return null
  }
  createTypeIcon(types).then(({ data: res }) => {
    if (res.result === 'repeat') {
      ElMessageBox.alert(`重复的名称设置`, '重复', {
        type: 'warning',
        confirmButtonText: '确定',
      })
    }
    if (res.result === 'fail') {
      ElMessageBox.alert(`上传失败`, '失败', {
        type: 'warning',
        confirmButtonText: '确定',
      })
    }
    createObjsIconDialog.value = false
    createToolsIconDialog.value = false
    init()
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div>
      <el-divider content-position="center">
        流程对象类
      </el-divider>
      <div class="flex flex-wrap gap-2 w-100% overflow-auto">
        <div v-for="(item, index) in objs_icons" :key="index">
          <el-card class="w-30 h-35 rounded-xl">
            <div class=" flex items-center justify-center">
              <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${item.icon}.svg`" style="width: 4rem; height: 4rem;" />
            </div>
            <div class=" flex items-center justify-center mt-2">
              {{ item.name }}
            </div>
          </el-card>
        </div>
        <el-card class="w-30 h-35 rounded-xl cursor-pointer" @click="types.name = '', types.icon = '', types.category = 1, createObjsIconDialog = true">
          <div class="flex items-center justify-center">
            <el-icon size="35">
              <svg-icon name="add-green" />
            </el-icon>
          </div>
          <div class="flex items-center justify-center">
            添加对象类型
          </div>
        </el-card>
      </div>
    </div>
    <div>
      <div>
        <el-divider content-position="center">
          工具类
        </el-divider>
        <div class="flex flex-wrap gap-2 w-100% overflow-auto">
          <div v-for="(item, index) in tools_icons" :key="index">
            <el-card class="w-30 h-35 rounded-xl">
              <div class=" flex items-center justify-center">
                <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${item.icon}.svg`" style="width: 4rem; height: 4rem;" />
              </div>
              <div class=" flex items-center justify-center mt-2">
                {{ item.name }}
              </div>
            </el-card>
          </div>
          <el-card class="w-30 h-35 rounded-xl cursor-pointer" @click="types.name = '', types.icon = '', types.category = 2, createToolsIconDialog = true">
            <div class="flex items-center justify-center">
              <el-icon size="35">
                <svg-icon name="add-green" />
              </el-icon>
            </div>
            <div class="flex items-center justify-center">
              添加工具类型
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <xt-dialog v-model="createObjsIconDialog" title="创建流程对象类型" @cancel="createObjsIconDialog = false" @confirm="upLoadType">
      <div>
        <el-form>
          <el-form-item label="名称">
            <el-input v-model="types.name" />
          </el-form-item>
          <el-form-item label="图标">
            <upLoadIcon @up-load="(key) => { types.icon = key, types.category = 1 }" />
          </el-form-item>
          <el-form-item label="类型：">
            流程对象
          </el-form-item>
        </el-form>
      </div>
    </xt-dialog>
    <xt-dialog v-model="createToolsIconDialog" title="创建工具类型" @cancel="createToolsIconDialog = false" @confirm="upLoadType">
      <div>
        <el-form>
          <el-form-item label="名称：">
            <el-input v-model="types.name" />
          </el-form-item>
          <el-form-item label="图标：">
            <upLoadIcon @up-load="(key) => { types.icon = key }" />
          </el-form-item>
          <el-form-item label="类型：">
            工具
          </el-form-item>
        </el-form>
      </div>
    </xt-dialog>
  </div>
</template>

<style scoped>

</style>

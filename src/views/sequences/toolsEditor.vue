<script setup lang="ts">
import { getCurrentTools } from '@/axios/interfaceWorkBase'
import createTools from './toolsItem/createTools.vue'

interface toolListOpt {
  id: number
  name: string
  specification: string
  type: string
}

const toolsList = ref<toolListOpt[]>([])
const createToolsDialog = ref(false)
function init() {
  getCurrentTools().then(({ data: res }) => {
    console.log(res)
    if (res.result.length > 0) {
      const temp = []
      for (const i in res.result) {
        temp.push({
          id: res.result[i].id,
          name: res.result[i].name,
          specification: res.result[i].specification,
          type: `https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${res.result[i].type}.svg`,
        })
      }
      toolsList.value = temp
    }
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2">
      <el-card v-for="(item, index) in toolsList" :key="index" class="w-27 h-35 rounded-xl cursor-pointer">
        <div class="flex h-23 items-center justify-center">
          <div>
            <el-image :src="item.type" style="width: 4rem; height: 4rem; padding: 0.5rem;" />
            <div class="flex items-center justify-center">
              <el-text class="font-semibold">
                {{ item.name }}
              </el-text>
            </div>
            <div class="flex items-center justify-center">
              <el-text type="info">
                {{ item.specification }}
              </el-text>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="w-27 h-35 rounded-xl cursor-pointer" @click="createToolsDialog = true">
        <div class="flex h-23 items-center justify-center">
          <div>
            <div class="flex items-center justify-center">
              <el-icon size="25">
                <SvgIcon name="add-green" />
              </el-icon>
            </div>
            <div class="flex items-center justify-center">
              <el-text>
                添加工具
              </el-text>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <XtDialog
      v-model="createToolsDialog"
      title="创建工具"
      :show-cancel="false"
      :show-confirm="false"
      width="650"
      @cancel="createToolsDialog = false"
    >
      <div>
        <createTools @cancel="createToolsDialog = false" @confirm="init(), createToolsDialog = false" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { getPlant } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import createPlant from './items/createPlant.vue'

const acs = useAppCacheStore()
const createPlantDialog = ref(false)

function init() {
  getPlant(acs.currentProject).then(({ data: res }) => {
    console.log('结果', res)
  })
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  init()
})
</script>

<template>
  <div>
    <el-card class="rounded-xl w-15rem h-20rem flex flex-col items-center justify-center cursor-pointer" @click="createPlantDialog = true">
      <div>
        <div class="w-100% flex items-center justify-center">
          <el-icon size="45">
            <SvgIcon name="add-green" />
          </el-icon>
        </div>

        <div class="w-100% flex items-center justify-center">
          <el-text size="large">
            添加计划
          </el-text>
        </div>
      </div>
    </el-card>
    <XtDialog v-model="createPlantDialog" title="增加计划" :show-cancel="false" :show-confirm="false" @cancel="createPlantDialog = false">
      <createPlant @cancel="createPlantDialog = false" @confirm="init(), createPlantDialog = false" />
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

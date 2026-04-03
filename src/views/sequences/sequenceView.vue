<script setup lang="ts">
import { getSequence } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import sequenceCreate from './items/sequenceCreate.vue'
import timeSelect from './items/timeSelect.vue'

const acs = useAppCacheStore()
const currentTime = ref<number>(480)
const creatSequenceDialog = ref(false)
function init() {
  getSequence(acs.currentProject).then(({ data: res }) => {
    console.log(res)
  })
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div>
      <timeSelect @current-time="(value) => currentTime = value" />
    </div>
    <div class="mt-2">
      <el-card class="rounded-xl cursor-pointer" @click="creatSequenceDialog = true">
        <div class="flex gap-2">
          <div>
            创建流程{{ currentTime }}
          </div>
          <div>
            <el-icon size="25">
              <SvgIcon name="add-green" />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>
    <XtDialog v-model="creatSequenceDialog" title="添加流程节点" :show-cancel="false" :show-confirm="false" @cancel="creatSequenceDialog = false">
      <sequenceCreate
        :start="`${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`"
        @cancel="creatSequenceDialog = false"
        @confirm="init(), creatSequenceDialog = false"
      />
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

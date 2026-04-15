<script setup lang="ts">
import { useMobileStore } from '@/stores/mobile'

const mss = useMobileStore()
</script>

<template>
  <div class="flex justify-between items-center w-full bg-green-100 pt-3 pb-3 fixed z-999">
    <div class="pl-2">
      <el-text>{{ `${String(~~(mss.timeList[mss.currentTimeNode] / 60)).padStart(2, '0')}:${String(mss.timeList[mss.currentTimeNode] % 60).padStart(2, '0')}` }}</el-text>
    </div>
    <div>
      <el-text size="large">
        当前：{{ mss.currentTime }}
      </el-text>
    </div>
    <div class="pr-2">
      <el-text>{{ `${String(~~(mss.timeList[mss.currentTimeNode + 1] / 60)).padStart(2, '0')}:${String(mss.timeList[mss.currentTimeNode + 1] % 60).padStart(2, '0')}` }}</el-text>
    </div>
  </div>
</template>

<style scoped>

</style>

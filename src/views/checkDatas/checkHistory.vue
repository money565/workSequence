<script setup lang="ts">
import allSequence from './items/allSequence.vue'
import elapse from './items/elapse.vue'
import future from './items/future.vue'
import todayCheck from './items/todayCheck.vue'

const currentDate = ref<Date>(new Date())
const activeName = ref('allSequence')
</script>

<template>
  <div>
    <div class="mt--2 mb-2">
      <el-text class="demonstration">
        流程日期：
      </el-text>
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="Pick a day"
        size="default"
      />
    </div>
    <div>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="今日流程" name="allSequence">
          <allSequence v-if="activeName === 'allSequence'" :date="currentDate" />
        </el-tab-pane>
        <el-tab-pane label="今日检查" name="todayCheck">
          <todayCheck v-if="activeName === 'todayCheck'" :date="currentDate" />
        </el-tab-pane>
        <el-tab-pane label="已开始流程" name="elapse">
          <elapse v-if="activeName === 'elapse'" :date="currentDate" />
        </el-tab-pane>
        <el-tab-pane label="未开始流程" name="future">
          <future v-if="activeName === 'future'" :date="currentDate" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>

</style>

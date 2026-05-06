<script setup lang="ts">
import tableView from './sequenceView/tableView.vue'
import timeView from './sequenceView/timeView.vue'

const activeName = ref('tables')
</script>

<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
    >
      <el-tab-pane label="时间查看" name="times">
        <timeView />
      </el-tab-pane>
      <el-tab-pane label="列表查看" name="tables">
        <tableView />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
</style>

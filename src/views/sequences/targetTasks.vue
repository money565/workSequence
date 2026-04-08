<script setup lang="ts">
import { flattenTree, task_target } from './target'
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流程目的</span>
        </div>
      </template>
      <div class="flex gap-8">
        <div v-for="(item, index) in flattenTree(task_target)" :key="index">
          <div>
            <div class="flex items-center justify-center">
              <el-image :src="item.icon" style="width: 2rem; height: 2rem;" />
            </div>
            <div>
              <el-text>{{ item.name }}</el-text>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>

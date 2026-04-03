<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const { row, title, column = 2, list } = props.data
</script>

<template>
  <el-descriptions :title="title" :column="column" border>
    <el-descriptions-item v-for="(item, index) in list" :key="index" :span="item.span">
      <template #label>
        {{ item.label }}
      </template>
      <slot :name="item.prop" :rows="row">
        {{ item.value || row[item.prop] }}
      </slot>
    </el-descriptions-item>
  </el-descriptions>
</template>

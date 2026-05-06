<script setup lang="ts">
interface IProps {
  titleName: string
}
const props = defineProps<IProps>()
</script>

<template>
  <div class="relative bg-gray-100 border border-white/10 rounded-xl p-4 shadow-xl">
    <div class="text-lg font-semibold mb-4 pl-3 border-l-4 border-blue-400">
      {{ props.titleName }}
    </div>
    <div class="w-full h-[320px]">
      <el-empty description="description" />
    </div>
  </div>
</template>

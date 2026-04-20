<script setup lang="ts">
interface IProps {
  openDialog: boolean
  title: string
}

const props = defineProps<IProps>()
const emits = defineEmits(['confirm', 'cancel'])
const innerVisible = computed({
  // 读取：直接用 props 的值
  get() {
    return props.openDialog
  },
  // 修改：不直接改 props，而是通知父组件修改
  set(value) {
    emits('cancel', value)
  },
})
</script>

<template>
  <div>
    <XtDialog v-model="innerVisible" :title="title" @cancel="innerVisible = false">
      <div>
        更改流程时间
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>

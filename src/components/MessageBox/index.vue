<script lang="ts" setup>
import type { Action } from 'element-plus'
import { ElMessageBox } from 'element-plus'

interface IProps {
  title: string
  content: string
}

const props = defineProps<IProps>()
const emits = defineEmits(['confirm'])
function open() {
  ElMessageBox.alert(props.content, props.content, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      emits('confirm', action)
    },
  })
}
</script>

<template>
  <el-button plain @click="open">
    Click to open the Message Box
  </el-button>
</template>

<script lang="ts" setup>
const emits = defineEmits(['sendMesg'])

const noticeValue = ref<number[]>([4, 5])

function boxChanged() {
  emits('sendMesg', noticeValue.value)
}
</script>

<template>
  <el-checkbox-group v-model="noticeValue" @change="boxChanged">
    <el-checkbox :value="1" name="type">
      声讯电话
    </el-checkbox>
    <el-checkbox :value="2" name="type">
      平台短信
    </el-checkbox>
    <el-checkbox :value="3" name="type">
      钉一下
    </el-checkbox>
    <el-checkbox :value="4" name="type">
      待办
    </el-checkbox>
    <el-checkbox :value="5" name="type">
      工作通知
    </el-checkbox>
  </el-checkbox-group>
</template>

<!-- eslint-disable no-alert -->
<script setup lang="ts">
import VConsole from 'vconsole'
import { RouterView } from 'vue-router'
import { useNetworkStatus } from './composables/useNetworkStatus'
import { useUserStore } from './stores/counter'

const isDev = import.meta.env.DEV // 是否是开发环境
const isProd = import.meta.env.PROD // 是否是生产环境
const mode = import.meta.env.MODE // 具体模式：development/production

const user = useUserStore()
const { isOnline } = useNetworkStatus()
const vConsole = new VConsole()
vConsole.setOption({ log: { maxLogNumber: 5000 } })
user.login()
onMounted(() => {
  console.log('当前环境:', mode)
  console.log('是否开发环境:', isDev)
  console.log('是否生产环境:', isProd)
  if (isDev) {
    console.log('VConsole已启用')
  }
  else {
    console.log('生产环境，VConsole已禁用')
    vConsole.destroy()
  }
})
</script>

<template>
  <RouterView v-if="isOnline && user.loginReady" />
  <div v-else>
    正在启动应用
  </div>
</template>

<style>
@import './assets/css/main.css';
</style>

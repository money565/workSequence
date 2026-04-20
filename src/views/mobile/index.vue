<script setup lang="ts">
import { useMobileStore } from '@/stores/mobile'
// ==================== 1. 监听键盘左右方向键 ← → ====================
import { onMounted, onUnmounted, ref } from 'vue'
import topItem from './topItem/topItem.vue'

// 监听区域（也可以直接挂 window）
const swipeRef = ref<HTMLElement | null>(null)
const mss = useMobileStore()
// 滑动记录
let startX = 0
const minDistance = 100 // 最小滑动距离

// 触摸开始
function onTouchStart(e: Event) {
  const touchEvent = e as TouchEvent
  startX = touchEvent.touches[0].clientX
}

// 触摸结束（方向已修正）
function onTouchEnd(e: Event) {
  if (mss.checkDialog) {
    return null
  }
  const touchEvent = e as TouchEvent
  const endX = touchEvent.changedTouches[0].clientX
  const offset = endX - startX
  if (offset > minDistance) {
    if (mss.currentTimeNode > 46) {
      mss.currentTimeNode = 46
    }
    else {
      mss.currentTimeNode = mss.currentTimeNode + 1
    }
    mss.direct = 'right'
    toLeft()
  }
  else if (offset < -minDistance) {
    if (mss.currentTimeNode <= 0) {
      mss.currentTimeNode = 0
    }
    else {
      mss.currentTimeNode = mss.currentTimeNode - 1
    }
    mss.direct = 'left'
    toRight()
  }
}

// 键盘方向键（正常逻辑）
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    toLeft()
  }
  else if (e.key === 'ArrowRight') {
    toRight()
  }
}

// 业务方法
function toLeft() {
  // 左一页 / 上一张
}
function toRight() {
  // 右一页 / 下一张
}

// 绑定事件
onMounted(() => {
  const el = swipeRef.value ?? window
  el.addEventListener('touchstart', onTouchStart)
  el.addEventListener('touchend', onTouchEnd)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  const el = swipeRef.value ?? window
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div>
    <topItem />
    <router-view />
  </div>
</template>

<style scoped>

</style>

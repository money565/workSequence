<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { shallowReactive } from 'vue'

interface Mark {
  style: CSSProperties
  label: string
}
type Marks = Record<string, Mark | string>
const emits = defineEmits(['currentTime'])
const baseHourColor = ['#030510', '#050718', '#080b24', '#0b102f', '#0e153a', '#121943', '#2a386b', '#586dac', '#87ceeb', '#b1e1ff', '#d0ecff', '#e4f5ff', '#fff8e1', '#fff8e1', '#fff1c4', '#feecaf', '#fae19b', '#f7d08b', '#f4bf8e', '#f19e84', '#ee7d78', '#dd5868', '#6d275f', '#25113e']
const currentTime = ref(480)
const hour = computed(() => currentTime.value / 60)
// 格式化时间
function formatTime(minute: number) {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// 太阳轨迹 6:00 -> 17:00
const sunPos = computed(() => {
  const h = hour.value
  if (h < 6 || h > 18)
    return { x: 50, y: 80 }
  const t = (h - 6) / 11
  const angle = Math.PI * t
  return {
    x: 50 - 40 * Math.cos(angle),
    y: 30 - 22 * Math.sin(angle),
  }
})
const sunVisible = computed(() => hour.value >= 6 && hour.value <= 17)

// 月亮轨迹 0-7点 + 17-24点
const moonPos = computed(() => {
  const h = hour.value
  if (h >= 0 && h <= 7) {
    const t = h / 7
    const angle = Math.PI * t
    return {
      x: 50 - 45 * Math.cos(angle),
      y: 30 - 22 * Math.sin(angle),
    }
  }
  if (h >= 17 && h <= 24) {
    const t = (h - 17) / 7
    const angle = Math.PI * t
    return {
      x: 50 - 45 * Math.cos(angle),
      y: 30 - 22 * Math.sin(angle),
    }
  }
  return { x: 50, y: 80 }
})
const moonVisible = computed(() => (hour.value >= 0 && hour.value <= 7) || (hour.value >= 17 && hour.value <= 24))

// 背景渐变
const currentColor = computed(() => getHourSkyColor(hour.value))

// ==============================================
// ✅ 核心：实时计算 当前背景色 的 平滑相反色（无突兀切换）
// ==============================================
const oppositeColor = computed(() => {
  const rgb = currentColor.value.match(/\d+/g)!.map(Number)
  const [r, g, b] = rgb
  // 取反色 + 柔和过渡，不生硬黑白
  const nr = 255 - r
  const ng = 255 - g
  const nb = 255 - b
  return `rgb(${nr}, ${ng}, ${nb})`
})

// 24小时颜色
function getHourSkyColor(h: number) {
  const i = Math.floor(h) % 24
  const t = h - i
  return mixColor(baseHourColor[i], baseHourColor[(i + 1) % 24], t)
}

// 颜色混合
function mixColor(c1: string, c2: string, t: number) {
  const r1 = Number.parseInt(c1.slice(1, 3), 16)
  const g1 = Number.parseInt(c1.slice(3, 5), 16)
  const b1 = Number.parseInt(c1.slice(5, 7), 16)
  const r2 = Number.parseInt(c2.slice(1, 3), 16)
  const g2 = Number.parseInt(c2.slice(3, 5), 16)
  const b2 = Number.parseInt(c2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r}, ${g}, ${b})`
}

const marks2 = shallowReactive<Marks>({})
for (let i = 0; i < 1440; i++) {
  if (i % 60 === 0) {
    marks2[String(i)] = `${i / 60}:00`
  }
}
</script>

<template>
  <div
    class="w-95% mx-auto p-10 rounded-2xl shadow-xl transition-colors duration-500 min-h-[10rem] flex flex-col justify-center relative overflow-hidden"
    :style="{ backgroundColor: currentColor }"
  >
    <!-- 太阳 SVG -->
    <div
      class="absolute w-16 h-16 transition-all duration-500 ease-out"
      :style="{
        left: `${sunPos.x}%`,
        top: `${sunPos.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: sunVisible ? 1 : 0,
      }"
    >
      <svg viewBox="0 0 24 24" fill="#FFD700">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 5.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" stroke="#FFD700" stroke-width="1" stroke-linecap="round" />
      </svg>
    </div>

    <!-- 月亮 SVG -->
    <div
      class="absolute w-14 h-14 transition-all duration-500 ease-out"
      :style="{
        left: `${moonPos.x}%`,
        top: `${moonPos.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: moonVisible ? 1 : 0,
      }"
    >
      <svg viewBox="0 0 24 24" fill="#F5F5F5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>

    <!-- 顶部标题 -->
    <div
      class="text-center text-lg font-bold p-3 rounded-lg mb-8 transition-colors duration-500 relative z-10"
      :style="{ color: oppositeColor }"
    >
      24小时昼夜时间轴 · 当前时间：{{ formatTime(currentTime) }}
    </div>

    <!-- 滑块 -->
    <div class="demo" :style="{ '--stop-color': oppositeColor }">
      <el-slider v-model="currentTime" :marks="marks2" :step="1" :max="1439" class="w-full" @input="emits('currentTime', currentTime)" />
    </div>
  </div>
</template>

<style scoped>
:deep(.el-slider__runway) {
  height: 12px;
  background: rgba(255, 255, 255, 0.25);
}
:deep(.el-slider__button) {
  width: 26px;
  height: 26px;
  border: 3px solid #fff;
  background-color: #ff9a47;
}
:deep(.el-slider__stop.custom) {
  background-color: var(--stop-color, #67c23a); /* 使用 CSS 变量，带默认值 */
}
</style>

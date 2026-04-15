<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import imageCompression from 'browser-image-compression'
import { ElMessageBox } from 'element-plus'
import { onUnmounted, ref } from 'vue'

// 类型定义
interface UploadFile {
  file: File | null
  url: string
}
const emits = defineEmits(['picKey'])
const acs = useAppCacheStore()
// 原生 input DOM 引用
const fileInputRef = ref<HTMLInputElement | null>(null)
// 预览地址
const previewUrl = ref<string>('')
// 存储上传的文件对象
const uploadFile = ref<UploadFile>({
  file: null,
  url: '',
})
const currentFileKey = ref('')

// 文件大小限制 5MB
const MAX_SIZE = 5 * 1024 * 1024

/**
 * 触发点击文件选择框
 */
function triggerFileClick() {
  fileInputRef.value?.click()
}

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.8, // 目标800KB内
    maxWidthOrHeight: 1600, // 缩到1600px，巡检图足够清晰
    useWebWorker: true, // ✅ 后台线程，不卡UI
    fileType: 'image/jpeg',
    initialQuality: 0.88,
    alwaysKeepResolution: false,
    progressive: true,
  }
  try {
    return await imageCompression(file, options)
  }
  catch (err) {
    console.error('压缩失败', err)
    return file // 失败 fallback 原图
  }
}

function generateUploadKey(file: File): string {
  const now = new Date()

  // 生成目录：2026/4/15
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 不补零 → 4，不是 04
  const day = now.getDate() // 不补零 → 15
  const dir = `${year}/${month}/${day}`

  // 文件名：时分秒_4位随机数（防止重名）
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  const timeFileName = `${h}${m}${s}_${Math.random().toString(36).slice(2, 6)}`

  // 文件后缀
  const ext = file.name.split('.').pop() || 'jpg'

  // 最终上传 key（目录+文件名）
  return `sequence/${dir}/${timeFileName}.${ext}`
}
/**
 * 文件选择改变事件
 */
async function handleFileChange(e: Event) {
  if (currentFileKey.value !== '') {
    await acs.removeFile(currentFileKey.value)
    currentFileKey.value = ''
  }
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  // 未选择文件
  if (!file)
    return
  // 校验文件类型
  if (!file.type.startsWith('image/')) {
    ElMessageBox.alert('请选择图片文件', '提示', {
      confirmButtonText: '确定',
    })
    resetFileInput()
    return
  }
  // 校验文件大小
  if (file.size > MAX_SIZE) {
    ElMessageBox.alert('图片大小不能超过 5MB！', '提示', {
      confirmButtonText: '确定',
    })
    resetFileInput()
    return
  }

  const file_zip = await compressImage(file)
  currentFileKey.value = generateUploadKey(file)
  acs.initCos().then(() => {
    acs.doUploadFileWithKey(file_zip, currentFileKey.value).then((res: string) => {
      previewUrl.value = res
      emits('picKey', currentFileKey.value)
      resetFileInput()
    })
  })
  // 重置 input，解决重复选择同一张图不触发 change
}

/**
 * 清空上传
 */
function handleClear() {
  // 释放 blob 地址内存
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  uploadFile.value = { file: null, url: '' }
  acs.removeFile(currentFileKey.value)
  resetFileInput()
}

/**
 * 重置 file input
 */
function resetFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

/**
 * 组件销毁时释放内存
 */
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// 向外暴露方法和属性
defineExpose({
  file: uploadFile.value.file,
  clear: handleClear,
})
</script>

<template>
  <div class="w-[200px] m-2">
    <!-- 预览区域 / 上传区域 -->
    <div
      class="relative w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-all bg-gray-50 overflow-hidden hover:border-blue-500 hover:bg-blue-50"
      :class="previewUrl ? 'border-solid border-blue-500' : ''"
      @click="triggerFileClick"
    >
      <!-- 有预览图时显示 -->
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="预览图"
        class="w-full h-full object-cover"
      >

      <!-- 无预览图时显示上传提示 -->
      <div v-else class="text-center text-gray-600">
        <span>点击上传图片</span>
        <p class="mt-1 text-xs text-gray-400">
          支持 jpg / png / jpeg，单张不超过 5MB
        </p>
      </div>

      <!-- 清空按钮 -->
      <button
        v-if="previewUrl"
        class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-sm border-none cursor-pointer"
        @click.stop="handleClear"
      >
        ×
      </button>
    </div>

    <!-- 隐藏的原生文件上传 input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    >
  </div>
</template>

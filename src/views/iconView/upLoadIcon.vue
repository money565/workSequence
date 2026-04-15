<script setup lang="ts">
import axios from 'axios'
import { ElMessageBox } from 'element-plus'

const emits = defineEmits(['upLoad', 'delete'])

// 腾讯云 COS 配置
const COS = {
  BaseUrl: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com',
}

// 引用
const fileInputRef = ref<HTMLInputElement | null>(null)
// 状态
const uploading = ref(false)
const progress = ref(0)
const fileName = ref('')
const fileUrl = ref('')
const currentKey = ref('')

// 选择文件（严格校验 SVG）
async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return

  // 双重校验 SVG
  const isSvgMime = file.type === 'image/svg+xml'
  const isSvgExt = file.name.toLowerCase().endsWith('.svg')

  if (!isSvgMime || !isSvgExt) {
    ElMessageBox.alert(`仅支持上传 SVG 格式文件`, '失败', {
      confirmButtonText: '确定',
    })
    resetUpload()
    return
  }
  if (currentKey.value) {
    await deleteCosFile(currentKey.value, false)
  }
  resetUpload()
  uploadToCos(file)
}

// 核心：PUT 上传（无跨域、无签名、最稳定）
async function uploadToCos(file: File) {
  try {
    uploading.value = true
    fileName.value = file.name

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2, 8)
    const key = `upload/svg/${timestamp}_${random}`
    const uploadUrl = `${COS.BaseUrl}/${key}.svg`

    // PUT 直传（不会跨域！）
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (e) => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded / e.total!) * 100)
        }
      },
    })

    // 上传成功
    fileUrl.value = uploadUrl
    currentKey.value = key
    emits('upLoad', key)
  }
  catch (err) {
    ElMessageBox.alert(`上传失败：${err}`, '失败', {
      confirmButtonText: '确定',
    })
  }
  finally {
    uploading.value = false
  }
}

// 重置
function resetUpload() {
  progress.value = 0
  fileUrl.value = ''
  fileName.value = ''
  currentKey.value = ''
  if (fileInputRef.value)
    fileInputRef.value.value = ''
}

async function deleteCosFile(key: string, showMesg = true) {
  if (!key) {
    ElMessageBox.alert(`文件路径不存在`, '失败', {
      confirmButtonText: '确定',
    })
    return
  }
  resetUpload()
  try {
    const deleteUrl = `${COS.BaseUrl}/${key}`

    // 发送 DELETE 请求删除文件
    await axios.delete(deleteUrl)
    if (showMesg) {
      ElMessageBox.alert(`删除成功`, '成功', {
        type: 'success',
        confirmButtonText: '确定',
      })
    }
  }
  catch (err) {
    ElMessageBox.alert(`删除失败${err}`, '失败', {
      type: 'success',
      confirmButtonText: '确定',
    })
  }
}
</script>

<template>
  <div class="cos-upload">
    <input
      ref="fileInputRef"
      type="file"
      accept=".svg"
      hidden
      @change="handleFileChange"
    >
    <el-button type="primary" @click="fileInputRef?.click()">
      <span v-if="!uploading">选择 SVG 文件上传</span>
      <span v-else>上传中 {{ progress }}%</span>
    </el-button>

    <div v-if="fileUrl" class="file-info">
      <a :href="fileUrl" target="_blank">{{ fileName }}</a>
      <el-button @click="deleteCosFile(currentKey)">
        删除
      </el-button>
    </div>
    <div class="mt-5">
      <el-image v-if="fileUrl" :src="fileUrl" style="width: 8rem;" />
    </div>
  </div>
</template>

<style scoped>
.cos-upload {
  width: 100%;
  max-width: 400px;
}
.upload-btn:hover {
  background: #66b1ff;
}
.file-info {
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.file-info a {
  color: #409eff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

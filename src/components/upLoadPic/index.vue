<!-- SimpleCosUpload.vue -->
<script setup lang="ts">
import type { UploadFile, UploadInstance } from 'element-plus'
import { getCosTempToken } from '@/axios/interfaceLogin'
import { MesgBox } from '@/views/public/item'
import { Upload } from '@element-plus/icons-vue'
import COS from 'cos-js-sdk-v5'
import { ElMessage } from 'element-plus'

// Props
interface Props {
  prefix: string // 上传路径前缀
  multiple: boolean // 是否多选
  limit: number // 数量限制
  accept: string // 接受的文件类型
  maxSize: number // 最大文件大小（MB）
  disabled: boolean // 是否禁用
}
interface fileOpt {
  key: string
  file: UploadFile
  preview: string
}
const props = defineProps<Props>()
const emits = defineEmits(['fileList'])
// Refs
const uploadRef = ref<UploadInstance>()
const fileList = ref<fileOpt[]>([])
const uploading = ref(false)
const cosInstance = ref<COS | null>(null)
// const previewVisible = ref(false)
// const previewImageUrl = ref('')
const Bucket = ref('')
const Region = ref('')

// Computed
const actionUrl = computed(() => {
  return 'https://example.com' // Element Plus要求有action，但不使用
})

const headers = computed(() => ({
  'X-Requested-With': 'XMLHttpRequest',
}))

const uploadData = computed(() => ({
  // 固定数据，实际使用COS SDK上传
}))

// 初始化COS实例
function initCos() {
  return new Promise<COS>((resolve, reject) => {
    try {
      if (cosInstance.value)
        resolve(cosInstance.value)
      getCosTempToken().then(({ data: res }) => {
        Bucket.value = res.result.Bucket
        Region.value = res.result.Region
        const cos = new COS({
          getAuthorization: (options, callback) => {
            callback({
              TmpSecretId: res.result.tmpSecretId,
              TmpSecretKey: res.result.tmpSecretKey,
              SecurityToken: res.result.sessionToken,
              StartTime: res.result.startTime,
              ExpiredTime: res.result.expiredTime,
            })
          },
        })
        cosInstance.value = cos
        resolve(cos)
      })
    }
    catch (error) {
      reject(error)
    }
  })
}

// 上传前验证
function beforeUpload(file: any) {
  // 检查文件大小
  const maxSize = props.maxSize * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }

  // 检查文件类型
  if (props.accept && props.accept !== '*') {
    const acceptTypes = props.accept.split(',')
    if (!acceptTypes.includes(file.type)) {
      ElMessage.error('不支持的文件类型')
      return false
    }
  }
  return true
}

// 文件变化
function handleChange(file: UploadFile) {
  if (!beforeUpload(file)) {
    // const index = fileList.value.findIndex(f => f.file.uid === file.uid)
    // fileList.value.splice(index, 1)
    return null
  }
  for (const i in fileList.value) {
    if (fileList.value[i].file.uid === file.uid) {
      return
    }
  }
  fileList.value.push({
    key: '',
    file,
    preview: '',
  })
  doUploadFile(file, fileList.value.length - 1)
}

// 文件移除
function handleRemove(index: number) {
  if (index > -1) {
    if (cosInstance.value) {
      cosInstance.value.deleteObject({
        Bucket: Bucket.value,
        Region: Region.value,
        Key: fileList.value[index].key,
      }, (err) => {
        if (err) {
          return
        }
        fileList.value.splice(index, 1)
        emits('fileList', fileList.value.map(item => item.key))
      })
    }
  }
}

// 上传成功
function handleSuccess(file: UploadFile) {
  file.status = 'success'
  ElMessage.success(`${file.name} 上传成功`)
}

// 上传错误
function handleError(error: any, file: UploadFile) {
  file.status = 'fail'
  ElMessage.error(`${file.name} 上传失败: ${error.message}`)
}

// 单个文件上传
function doUploadFile(file: UploadFile, index: number) {
  try {
    file.status = 'uploading'
    // 生成文件路径
    const filePath = generateFilePath(file.raw as File)
    fileList.value[index].key = filePath
    if (cosInstance.value) {
      // 开始上传
      cosInstance.value.putObject({
        Bucket: Bucket.value,
        Region: Region.value,
        Key: filePath,
        Body: file.raw as File,
        StorageClass: 'STANDARD',
        onProgress: (progressData) => {
          file.percentage = Math.round(progressData.percent * 100)
        },
      }, (err, _data) => {
        if (err) {
          file.status = 'fail'
          handleError(err, file)
          return
        }
        emits('fileList', fileList.value.map(item => item.key))
        getPreviewUrl(index)
        handleSuccess(file)
      })
    }
  }
  catch (error) {
    file.status = 'fail'
    ElMessage.error(`${file.name} 上传失败: ${error}`)
  }
}

// 移除文件
function removeFile(index: number) {
  handleRemove(index)
  ElMessage.info('已删除文件')
}

// 判断是否为图片
function isImage(file: UploadFile) {
  const type = file.raw?.type || ''
  return type.startsWith('image/')
}

// 获取预览URL
function getPreviewUrl(index: number) {
  if (cosInstance.value) {
    const key = fileList.value[index].key
    cosInstance.value.getObjectUrl({
      Bucket: Bucket.value,
      Region: Region.value,
      Key: key,
    }, (err: any, data: any) => {
      if (err) {
        fileList.value[index].preview = ''
      }
      fileList.value[index].preview = data.Url
    })
  }
}

// 生成文件路径
function generateFilePath(file: File): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).slice(2, 10)
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  const prefix = props.prefix || 'goods/'
  const now = new Date()
  const datePath = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
  return `${prefix}${datePath}/${timestamp}_${randomStr}${ext}`
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 清空文件列表
function clearFiles() {
  fileList.value = []
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

// 获取成功上传的文件URL
function getSuccessUrls(): string[] {
  return fileList.value
    .filter(file => file.file.status === 'success' && file.file.url)
    .map(file => file.file.url!)
}

// 组件挂载时获取token
onMounted(async () => {
  try {
    initCos()
  }
  catch (error) {
    MesgBox(`初始化获取token失败:${error}`, '错误')
  }
})

// 暴露方法给父组件
defineExpose({
  clearFiles,
  getSuccessUrls,
  fileList,
})

// {{ formatFileSize(file.file.size ? file.file.size : 0) }}
// {{ getStatusText(file.file) }}
</script>

<template>
  <div>
    <!-- 上传按钮 -->
    <el-upload
      ref="uploadRef"
      :action="actionUrl"
      :headers="headers"
      :data="uploadData"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :file-list="fileList.map(item => item.file)"
      :auto-upload="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :disabled="disabled"
    >
      <el-button type="primary" :icon="Upload" :loading="uploading">
        {{ uploading ? '上传中...' : '选择文件' }}
      </el-button>
    </el-upload>

    <!-- 文件列表 -->
    <div v-if="fileList.length > 0" class="mt-5 flex">
      <div v-for="(file, index) in fileList" :key="index" class="mr-3">
        <div class="w-26 bg-gray-100 items-center m-auto justify-center text-center rounded-lg">
          <el-image
            style="width: 100px; height: 100px"
            class="rounded-t-lg"
            :src="file.preview"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="fileList.filter(f => isImage(f.file)).map(f => f.preview)"
            show-progress
            :initial-index="4"
            fit="cover"
          />
          <div>
            {{ formatFileSize(file.file.size ? file.file.size : 0) }}
          </div>

          <div class="pb-3">
            <el-button
              type="danger"
              size="small"
              @click="removeFile(index)"
            >
              删除
            </el-button>
          </div>
        </div>
        <!-- 图片预览 -->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

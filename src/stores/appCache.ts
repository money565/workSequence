import { getCosTempToken } from '@/axios/interfaceLogin'
import COS from 'cos-js-sdk-v5'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

interface projectListOpt {
  id: number
  label: string
  value: number
  managers: {
    name: string
    id: number
  }[]
  departs: {
    name: string
    id: number
  }[]
}

export const useAppCacheStore = defineStore('appCache', () => {
  const currentProject = ref<number>(-1)
  const projectList = ref<projectListOpt[]>([])
  const Bucket = ref<string>('')
  const Region = ref<string>('')
  const cosInstance = ref<COS | null>(null)
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

  function getKeyUrl(key: string) {
    return new Promise<string>((resolve, reject) => {
      try {
        if (cosInstance.value) {
          cosInstance.value.getObjectUrl({
            Bucket: Bucket.value,
            Region: Region.value,
            Key: key,
          }, (err: any, data: any) => {
            if (err) {
              resolve('-1')
            }
            resolve(data.Url)
          })
        }
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('-1')
      }
    })
  }

  function handleError(error: any, file: File) {
    ElMessage.error(`${file.name} 上传失败: ${error.message}`)
  }

  function doUploadFileWithKey(file: File, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if (cosInstance.value) {
        // 开始上传
          cosInstance.value.putObject({
            Bucket: Bucket.value,
            Region: Region.value,
            Key: key,
            Body: file,
            StorageClass: 'STANDARD',
          }, (err, _data) => {
            if (err) {
              handleError(err, file)
              return
            }
            // emits('fileList', fileList.value.map(item => item.key))
            getKeyUrl(key).then((res) => {
              resolve(res)
            })
            // handleSuccess(file)
          })
        }
      }
      catch (error) {
        reject(error)
        ElMessage.error(`${file.name} 上传失败: ${error}`)
      }
    })
  }

  async function removeFile(key: string) {
    return new Promise((reslove, reject) => {
      initCos().then(() => {
        if (cosInstance.value !== null) {
          cosInstance.value.deleteObject({
            Bucket: Bucket.value,
            Region: Region.value,
            Key: key,
          }, (err) => {
            if (err) {
              reject(err)
            }
            reslove(key)
          })
        }
      })
    })
  }

  return {
    currentProject,
    projectList,
    initCos,
    getKeyUrl,
    doUploadFileWithKey,
    removeFile,
  }
})

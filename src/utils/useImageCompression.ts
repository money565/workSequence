/* eslint-disable no-async-promise-executor */
import imageCompression from 'browser-image-compression'
// composables/useImageCompression.ts

export function compressImage(file: File): Promise<File> {
  return new Promise(async (resolve, reject) => {
    try {
      // 如果已经小于500KB，直接返回原文件
      if (file.size <= 500 * 1024) {
        return resolve(file)
      }

      let compressedFile = file
      let quality = 0.9
      let maxWidthOrHeight = 1920
      const targetSize = 500 * 1024

      // 循环压缩直到小于500KB
      while (compressedFile.size > targetSize) {
        // 先尝试降低质量
        const options: any = {
          maxSizeMB: targetSize / (1024 * 1024),
          maxWidthOrHeight,
          useWebWorker: true,
          fileType: file.type,
          initialQuality: quality,
        }

        compressedFile = await imageCompression(file, options)

        // 如果质量已经降到0.8且文件仍然太大，则降低分辨率
        if (quality <= 0.8 && compressedFile.size > targetSize) {
          maxWidthOrHeight = Math.floor(maxWidthOrHeight * 0.8)
          quality = 0.7 // 重置质量，继续尝试
        }
        else {
          quality = Math.max(0.1, quality - 0.1)
        }

        // 防止无限循环
        if (maxWidthOrHeight < 200) {
          break
        }
      }

      resolve(compressedFile)
    }
    catch (error) {
      reject(error)
    }
  })
}

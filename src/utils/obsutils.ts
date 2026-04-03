import ObsClient from 'esdk-obs-browserjs'

export interface ObsConfig {
  accessKeyId: string
  secretAccessKey: string
  securityToken: string
  endpoint: string
  bucketName: string
  region?: string
}

export function uploadToObs(file: File, config: ObsConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    const {
      accessKeyId,
      secretAccessKey,
      securityToken,
      endpoint,
      bucketName,
    } = config

    // 创建OBS客户端实例
    const obsClient = new ObsClient({
      access_key_id: accessKeyId,
      secret_access_key: secretAccessKey,
      security_token: securityToken,
      server: endpoint,
    })

    // 生成随机文件名
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`

    // 上传文件
    obsClient.putObject({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    }, (err: any, result: any) => {
      if (err) {
        reject(err)
        return
      }

      if (result.CommonMsg.Status < 300) {
        // 构建文件访问URL
        const fileUrl = `https://${bucketName}.${endpoint}/${fileName}`
        resolve(fileUrl)
      }
      else {
        reject(new Error(`上传失败，状态码: ${result.CommonMsg.Status}`))
      }
    })
  })
}

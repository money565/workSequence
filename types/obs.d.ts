// src/types/obs.d.ts
declare module 'esdk-obs-browserjs' {
  interface ObsClientConfig {
    access_key_id: string
    secret_access_key: string
    security_token?: string
    server: string
    region?: string
    max_retry_count?: number
    timeout?: number
    ssl_verify?: boolean
    long_conn_param?: any
  }

  interface PutObjectResult {
    CommonMsg: {
      Status: number
      Code: string
      Message: string
      HostId: string
      RequestId: string
    }
    InterfaceResult: any
  }

  interface PutObjectParams {
    Bucket: string
    Key: string
    Body?: File | Blob | string
    ContentType?: string
    CacheControl?: string
    ContentDisposition?: string
    ContentEncoding?: string
    ContentLanguage?: string
    Expires?: string
    Metadata?: Record<string, string>
    ACL?: string
  }

  class ObsClient {
    [x: string]: any
    constructor(config: ObsClientConfig)
    putObject(params: PutObjectParams, callback: (err: any, result: PutObjectResult) => void): void
    // 可以添加其他你需要的方法声明
  }

  export default ObsClient
}

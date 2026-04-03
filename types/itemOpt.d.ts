interface materialOpt {
  id: number
  tag: string
  name: {
    id: number
    name: string
  }
  size: string
  unit: string
  price: number
  brand: {
    id: number
    name: string
  }
  inbound_time: string
  model: {
    id: number
    name: string
  }
  from: {
    id: number
    name: string
  }
  out: {
    nature: number
    id: number
    name: string
  }
  state: {
    id: number
    name: string
  }
  posit: {
    name: string
    id: number
  }
  code: string
}

interface supplierOpt {
  name: string
  address: string
  contact: {
    name: string
    contact: string
    type: number
  }[]
  brand: string
  tex: number[]
  produce: {
    id: number
    name: string
  }[]
  pics: string[]
}

interface materialTypeOpt {
  name: string
  unit: string
  size: string
  pcs: number
  pic?: string[]
  supplier?: number[]
  description?: string
}

interface CosCredentials {
  tmpSecretId: string
  tmpSecretKey: string
  sessionToken: string
  startTime?: number
  expiredTime?: number
}

interface CosStsToken {
  credentials: CosCredentials
  expiredTime: number
  bucket: string
  region: string
  allowPrefix: string
}

interface UploadResult {
  url: string
  key: string
  fileName: string
  fileSize: number
  etag?: string
  location?: string
  statusCode?: number
}

interface UploadProgress {
  percent: number
  loaded: number
  total: number
  speed: number
}

interface UploadOptions {
  prefix?: string
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  limit?: number
}

interface qrCodeOpt { id: number, QRCode: string, address: string, name: string, code: string }

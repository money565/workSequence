/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 添加其他自定义环境变量...
  readonly VITE_API_BASE_URL: string
  readonly VITE_MODE: 'development' | 'production' | 'test'
  readonly PROD: boolean
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ServiceWorkerGlobalScope {
  __WB_MANIFEST: string[]
  addEventListener: (
    type: string,
    listener: (event: ExtendableEvent | FetchEvent | MessageEvent) => void,
    options?: boolean | AddEventListenerOptions
  ) => void
  skipWaiting: () => void
  clients: Clients
  registration: ServiceWorkerRegistration
}

interface Window {
  workbox: any // 如果使用 workbox
}

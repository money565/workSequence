// types/dingtalk.d.ts
declare module 'dingtalk-jsapi' {
  // 声明钉钉 JSAPI 的类型
  const dd: {
    ready: (callback: () => void) => void
    runtime: {
      permission: {
        requestAuthCode: (config: any) => Promise<any>
      }
    }
    // 添加其他您需要的方法
    [key: string]: any
  }

  export default dd

  export function config(arg0: { agentId: string, corpId: any, timeStamp: any, nonceStr: any, signature: any, jsApiList: string[] }) {
    throw new Error('Function not implemented.')
  }

  export function ready(arg0: () => void) {
    throw new Error('Function not implemented.')
  }
}

// 或者直接声明全局变量
declare global {
  interface Window {
    dd: any // 或者更详细的类型定义
  }
}

export const loginURL: string = 'http://118.24.54.200:8080/publicMesg'
export const baseURL: string = 'http://118.24.54.200:8080/assetManage'
export const workBaseURL: string = 'http://118.24.54.200:8080/workSequence'
export const HWURL: string = 'http://124.71.148.182:8080/publicInterface'
export function HWBaseURL() {
  if (import.meta.env.DEV) {
    return 'http://192.168.1.22:5173/#/'
  }
  if (import.meta.env.PROD) {
    return 'http://124.71.148.182:7011/#/'
  }
}
export const ddingUrl: string = 'api.dingtalk.com'
export const whiteList: string[] = ['https://www.cdxcwy.cn/']
export const mapKey: string = 'b267c777e58781119abebbfb61b06ba0' // 申请好的Web端开发者Key，首次调用 load 时必填
export const mapVersion: string = '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
export const SECRET_KEY = 'spotcheck1011123'
export const SECRET_IV = 'spotcheck1011123'
export function imageUrl(key: string): string {
  return `https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${key}.svg`
}

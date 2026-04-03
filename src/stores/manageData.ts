import { defineStore } from 'pinia'

export const useManageDataStore = defineStore('manageData', () => {
  const NFCtodeviecMesg = ref<{
    refreshKey: number
    content: string
    ready: boolean
  }>({
    refreshKey: 0,
    content: '先关闭手机端应用，再重新打开',
    ready: false,
  })

  const inputNFCDatas = ref<{
    refreshKey?: number
    data: {
      id: number
      name: string
      code?: string
    }[]
  }>({
    refreshKey: 0,
    data: [],
  })

  const recordNFCReady = ref<{
    refreshKey: number
    result: boolean
  }>({
    refreshKey: 0,
    result: false,
  })

  function recordNFCInit() {
    inputNFCDatas.value = {
      data: [],
    }
  }

  const objectThresholdDatas = ref<{
    refreshKey: number
    data: {
      name: string
      data: number[]
    }[]
  }>()
  return { NFCtodeviecMesg, inputNFCDatas, recordNFCReady, recordNFCInit, objectThresholdDatas }
})

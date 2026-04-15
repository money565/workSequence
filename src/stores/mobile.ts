import { defineStore } from 'pinia'

export const useMobileStore = defineStore('mobile', () => {
  const timeList = ref(Array.from({ length: 48 }, (_, i) => i * 30))
  const currentTime = ref<string>()
  const currentTimeNode = ref(Math.max(0, Math.ceil((new Date().getHours() * 60 + new Date().getMinutes()) / 30) - 1))
  const prePage = ref()
  const nextPage = ref()
  const direct = ref<'left' | 'right'>()
  const checkDialog = ref(false)
  let init = true
  setInterval(() => {
    currentTime.value = `${new Date().getHours()}时${new Date().getMinutes()}分`
    init = false
  }, init ? new Date().getSeconds() : 60)
  return {
    timeList,
    currentTime,
    prePage,
    nextPage,
    currentTimeNode,
    direct,
    checkDialog,
  }
})

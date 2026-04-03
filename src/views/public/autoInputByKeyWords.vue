<!-- eslint-disable vue/require-valid-default-prop -->
<script lang="ts" setup>
import { searchBlock, searchFloor, searchManager, searchMaterialTypes, searchPosit, searchPosition, searchSupplier } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

interface IProps {
  refreshKey?: number
  target: string
  title?: string
  showTitle?: boolean
  width?: string
  triggerBlur?: boolean
  inputMesg?: string
  pRange?: number[]
  state?:string | undefined
  param?:{other_floor:number | undefined, other_block:number | undefined}
}
const props = withDefaults(defineProps<IProps>(), {
  refreshKey: 0,
  target: '',
  pRange: () => [],
  title: '',
  width: '20',
  inputMesg: '',
  triggerBlur: true,
  showTitle: true,
})
const emits = defineEmits(['sendMesg', 'sendRowData'])
const inputRef = ref()
const acs = useAppCacheStore()
const state = ref('')

interface labelItem {
  label: string
  value: string
}
const inputClass = computed(() => `width:${Number(props.width) / 4}rem`)

function handleSelect(item: Record<string, any>) {
  item.target = props.target
  emits('sendMesg', item)
  if (inputRef.value && props.triggerBlur) {
    inputRef.value.blur()
  }
}

function fetchSuggestions(queryString: string, cb: (suggestions: labelItem[]) => void) {
  // 模拟数据
  const data: { k: string, p?: number[], pid?: number } = {
    k: queryString,
  }
  if (props.target === 'm') {
    data.p = props.pRange
    searchManager(data).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'sp') {
    searchSupplier({ k: queryString }).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'mt') {
    searchMaterialTypes({ k: queryString }).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'pos') {
    searchPosition({ k: queryString, pid: acs.currentProject }).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'block') {
    const sendValue:{k:string, pid:number} = { k: queryString, pid: acs.currentProject }
    searchBlock(sendValue).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'floor') {
    const sendValue:{k:string, pid:number, bid?:number} = { k: queryString, pid: acs.currentProject }
    if(props.param !== undefined){
      if(props.param.other_block !== -1){
        sendValue.bid = props.param.other_block
      }
    }
    searchFloor(sendValue).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
  if (props.target === 'o_posit') {
    const sendValue:{k:string, pid:number, fid?:number} = { k: queryString, pid: acs.currentProject }
    if (props.param !== undefined){
      if(props.param.other_floor !== -1){
        sendValue.fid = props.param.other_floor
      }
    }
    searchPosit(sendValue).then(({ data: res }) => {
      const kwList = res.result
      if (kwList.length !== 0) {
        // eslint-disable-next-line prefer-const
        let temp: { value: string, label: any }[] = []
        kwList.forEach((e: { title: string, id: string }) => {
          temp.push({
            value: e.title,
            label: e.id,
          })
        })
        const mockData: labelItem[] = temp
        cb(mockData)
      }
      else {
        const mockData: labelItem[] = []
        cb(mockData)
      }
    })
  }
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as T
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 500)

onMounted(() => {
  state.value = props.inputMesg
})

watch(() => props.refreshKey, () => {
  state.value = ''
  if (inputRef.value && props.triggerBlur) {
    inputRef.value.blur()
  }
})

watch(()=>props.state, ()=>{
  if(props.state !== undefined){
    state.value = props.state
  }else{
    state.value = ''
  }
  
})
</script>

<template>
  <div class="flex gap-4 mb-4">
    <div v-if="props.showTitle" class="mt-1">
      {{ props.title }}
    </div>
    <div>
      <el-autocomplete
        ref="inputRef"
        :key="props.refreshKey"
        v-model="state"
        :fetch-suggestions="debouncedFetchSuggestions"
        :placeholder="props.title"
        :style="inputClass"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

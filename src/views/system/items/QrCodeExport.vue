<script setup lang="ts">
import { ElButton, ElMessage, ElOption, ElSelect, ElSlider, ElSpace } from 'element-plus'
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'
import { computed, ref, watch } from 'vue'

export interface QrCodeItem {
  url: string
  name: string
}

const props = defineProps<{
  qrList: QrCodeItem[]
}>()

const paperSizes = [
  { label: 'A4 210×297mm', width: 210, height: 297 },
  { label: 'A5 148×210mm', width: 148, height: 210 },
  { label: 'A3 297×420mm', width: 297, height: 420 },
  { label: '小票80mm', width: 80, height: 9999 },
  { label: '小票57mm', width: 57, height: 9999 },
  { label: '标签100×100mm', width: 100, height: 100 },
  { label: '标签70×70mm', width: 70, height: 70 },
]

const paperIndex = ref(0)
const currentPaper = computed(() => paperSizes[paperIndex.value])

const qrSize = ref(100)
const textSize = ref(16)
const itemGap = ref(20)
const lineGap = ref(16)
const paddingY = ref(8)
const paddingX = ref(42)

const previewRef = ref<HTMLElement>()
const currentPage = ref(1)

const pagedData = computed(() => {
  const list = props.qrList || []
  const pw = currentPaper.value.width
  const ph = currentPaper.value.height
  const qpx = qrSize.value
  const gapx = itemGap.value
  const gapy = lineGap.value
  const textH = 22

  const mm2px = 3.78
  const usableW = (pw - 10) * mm2px
  const usableH = (ph - paddingY.value * 2 - 10) * mm2px

  const perLine = Math.max(1, Math.floor(usableW / (qpx + gapx)))
  const perCol = Math.max(1, Math.floor(usableH / (qpx + textH + gapy)))
  const perPage = perLine * perCol

  const pages: QrCodeItem[][] = []
  for (let i = 0; i < list.length; i += perPage) {
    pages.push(list.slice(i, i + perPage))
  }

  return { list: pages, total: pages.length }
})

const currentList = computed(() => pagedData.value.list[currentPage.value - 1] || [])
const showPagination = computed(() => pagedData.value.total > 1)

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < pagedData.value.total)
    currentPage.value++
}

watch([paperIndex, qrSize, itemGap, lineGap, paddingY, paddingX], () => {
  currentPage.value = 1
})

// ======================
// 高清导出 PNG（已修复 TS 报错）
// ======================
async function handleExportPNG() {
  if (!previewRef.value)
    return
  if (currentList.value.length === 0)
    return ElMessage.warning('暂无数据')

  const canvas = await html2canvas(previewRef.value, {
    scale: 4,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  } as any) // 👈 加个 as any 完美解决 TS 报错

  const a = document.createElement('a')
  a.download = `高清二维码_第${currentPage.value}页.png`
  a.href = canvas.toDataURL('image/png', 1.0)
  a.click()
  ElMessage.success(`第 ${currentPage.value} 页 PNG 导出成功`)
}
</script>

<template>
  <div class="flex gap-6 p-6 bg-[#f5f7fa] min-h-screen">
    <div class="w-72 p-5 bg-white rounded-lg shadow space-y-5">
      <h3 class="text-lg font-bold mb-3">
        二维码导出配置
      </h3>

      <div>
        <label class="block mb-1 text-sm font-medium">纸张规格</label>
        <ElSelect v-model="paperIndex" class="w-full">
          <ElOption
            v-for="(p, idx) in paperSizes"
            :key="idx"
            :label="p.label"
            :value="idx"
          />
        </ElSelect>
      </div>

      <div>
        <label class="block mb-1 text-sm">二维码大小：{{ qrSize }}px</label>
        <ElSlider v-model="qrSize" :min="30" :max="150" />
      </div>
      <div>
        <label class="block mb-1 text-sm">文字大小：{{ textSize }}px</label>
        <ElSlider v-model="textSize" :min="10" :max="24" />
      </div>
      <div>
        <label class="block mb-1 text-sm">横向间距：{{ itemGap }}px</label>
        <ElSlider v-model="itemGap" :min="0" :max="20" />
      </div>
      <div>
        <label class="block mb-1 text-sm">纵向行距：{{ lineGap }}px</label>
        <ElSlider v-model="lineGap" :min="0" :max="30" />
      </div>
      <div>
        <label class="block mb-1 text-sm">上下边距：{{ paddingY }}mm</label>
        <ElSlider v-model="paddingY" :min="0" :max="20" />
      </div>
      <div>
        <label class="block mb-1 text-sm">整体左右偏移：{{ paddingX }}px</label>
        <ElSlider v-model="paddingX" :min="-100" :max="100" />
      </div>

      <ElSpace direction="vertical" class="w-full">
        <ElButton type="primary" class="w-full" @click="handleExportPNG">
          导出高清 PNG
        </ElButton>
      </ElSpace>
    </div>

    <div class="flex-1 p-5 bg-white rounded-lg shadow flex flex-col items-center">
      <h3 class="text-lg font-bold self-start mb-4">
        导出预览
      </h3>

      <div
        ref="previewRef"
        class="bg-white shadow-2xl relative overflow-hidden"
        :style="{
          width: `${currentPaper.width}mm`,
          minHeight: `${currentPaper.height}mm`,
          padding: `${paddingY}mm 2mm`,
        }"
      >
        <div class="w-full" :style="{ marginLeft: `${paddingX}px` }">
          <div
            class="flex flex-wrap w-full"
            :style="{ columnGap: `${itemGap}px`, rowGap: `${lineGap}px` }"
          >
            <div
              v-for="(item, idx) in currentList"
              :key="idx"
              class="flex flex-col items-center flex-shrink-0"
              :style="{ width: `${qrSize}px` }"
            >
              <QrcodeVue
                :value="item.url"
                :size="qrSize"
                render-as="svg"
                level="L"
              />
              <div
                class="mt-1 text-center w-full break-words overflow-hidden"
                :style="{ fontSize: `${textSize}px`, lineHeight: '1.2' }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showPagination" class="mt-6 flex items-center gap-4">
        <ElButton :disabled="currentPage === 1" @click="prevPage">
          上一页
        </ElButton>
        <span>{{ currentPage }} / {{ pagedData.total }}</span>
        <ElButton :disabled="currentPage === pagedData.total" @click="nextPage">
          下一页
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(svg) {
  shape-rendering: crispEdges !important;
  image-rendering: pixelated !important;
}
</style>

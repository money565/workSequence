<script setup lang="ts" name="system-role">
import { createPosit, deletePosit, getAllPositWithFloor } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { MakeSure, MesgBox } from '../public/item'

interface positOpt {
  id: number
  name: string
  posit: { id: number, name: string }[]
}

const acs = useAppCacheStore()
const floorList = ref<positOpt[]>([])
const createPositDialog = ref(false)
const currentFloorIndex = ref<number>(0)
const currentCreatePositTitle = ref<string>('')
const currentPositName = ref<string>('')

function init() {
  getAllPositWithFloor(acs.currentProject).then(({ data: res }) => {
    floorList.value = (res.result ?? []) as positOpt[]
  })
}

function openCreatePosit(index: number) {
  currentFloorIndex.value = index
  currentCreatePositTitle.value = `添加${floorList.value[currentFloorIndex.value].name}的位置`
  createPositDialog.value = true
}

function addPosit() {
  if (currentPositName.value === '') {
    MesgBox('请输入位置的名称', '提示')
    return null
  }
  const params = {
    fid: floorList.value[currentFloorIndex.value].id,
    pName: currentPositName.value,
  }
  createPosit(params).then(() => {
    currentPositName.value = ''
    createPositDialog.value = false
    init()
  })
}

function confirmDeletePosit(p_id: number, p_name: string, f_name: string) {
  MakeSure(`确定要删除${f_name}的${p_name}位置吗?`, '确认').then((res) => {
    if (res === 'confirm') {
      deletePosit(p_id).then(() => {
        init()
        createPositDialog.value = false
      })
    }
  })
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => { init() })
</script>

<template>
  <div>
    <div v-for="(item, index) in floorList" :key="index" class="mt-5 border border-blue-500 shadow-md rounded-xl">
      <div class="bg-gray-300 rounded-xl">
        <div class="flex rounded-t-xl bg-blue-400 h-12 items-center pl-10 text-white font-sans font-semibold">
          <el-icon size="25">
            <SvgIcon name="floor-white" />
          </el-icon>
          <div class="ml-5">
            {{ item.name }}
          </div>
        </div>
        <div class="rounded-b-xl bg-yellow-50 h-25 pl-10 pt-5 pb-5 pr-5 rounded-b-xl">
          <div class="flex gap-4">
            <el-tag
              v-for="(p, n) in item.posit"
              :key="n"
              size="large"
              closable
              @close="confirmDeletePosit(p.id, p.name, item.name)"
            >
              {{ p.name }}
            </el-tag>
            <el-tag size="large" class="w-25 cursor-pointer" @click="openCreatePosit(index)">
              <div class="flex gap-2 justify-center items-center text-center">
                <div class="mt-1">
                  <el-icon size="20">
                    <SvgIcon name="add-green" />
                  </el-icon>
                </div>
                <div>
                  添加位置
                </div>
              </div>
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <XtDialog v-model="createPositDialog" :title="currentCreatePositTitle" @cancel="createPositDialog = false" @confirm="addPosit">
      <div class="font-sans font-semibold text-4.1">
        添加位置：
      </div>
      <div class="mt-3">
        <el-input v-model="currentPositName" placeholder="请输入位置名称" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped></style>

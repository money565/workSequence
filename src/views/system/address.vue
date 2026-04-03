<script setup lang="ts" name="system-user">
import { createFloor, deleteFloor, getFloor, modifyFloor } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import { MakeSure, MesgBox } from '../public/item'

const acs = useAppCacheStore()
const floorList = ref<{ id: number, name: string }[]>([])
const createFloorDialog = ref(false)
const currentFloorName = ref('')
const currentFloorIndex = ref(-1)
const editFloorDialog = ref(false)

function init() {
  getFloor(acs.currentProject).then(({ data: res }) => {
    console.log(res)
    floorList.value = (res.result ?? []) as { id: number, name: string }[]
  })
}

function addFloor() {
  if (currentFloorName.value === '') {
    MesgBox('请输入楼层名称', '提醒')
    return null
  }
  const params = {
    pid: acs.currentProject,
    name: currentFloorName.value,
  }
  createFloor(params).then(() => {
    createFloorDialog.value = false
    init()
  })
}

function editFloor() {
  if (floorList.value[currentFloorIndex.value].name === '') {
    MesgBox('请输入楼层名称', '提醒')
    return null
  }
  const params = {
    fid: floorList.value[currentFloorIndex.value].id,
    name: floorList.value[currentFloorIndex.value].name,
  }
  modifyFloor(params).then(() => {
    editFloorDialog.value = false
    init()
  })
}

function sureToDelete(index: number) {
  MakeSure('确定要删除楼层', '确认').then((res) => {
    if (res === 'confirm') {
      deleteFloor(floorList.value[index].id).then(() => {
        init()
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
    <div v-if="floorList.length > 0">
      <el-card v-for="(item, index) in floorList" :key="index" class="rounded-lg mt-5">
        <div class="h-10 w-100% flex gap-4 items-center justify-center cursor-pointer" @click="currentFloorIndex = index, editFloorDialog = true">
          <el-icon size="30">
            <SvgIcon name="floor" />
          </el-icon>
          <div>
            <el-text size="large">
              {{ item.name }}
            </el-text>
          </div>
          <div>
            <el-button type="danger" @click.stop="sureToDelete(index)">
              删除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="rounded-lg mt-5">
      <div class="h-10 w-100% flex gap-4 items-center justify-center cursor-pointer" @click="createFloorDialog = true">
        <el-icon size="30">
          <SvgIcon name="add-green" />
        </el-icon>
        <div>
          <el-text size="large">
            添加楼层
          </el-text>
        </div>
      </div>
    </el-card>
    <XtDialog v-model="createFloorDialog" title="添加楼层" @cancel="createFloorDialog = false" @confirm="addFloor">
      <div class="font-sans font-semibold text-4">
        添加楼层：
      </div>
      <div class="mt-5">
        <el-input v-model="currentFloorName" placeholder="请输入楼层名称" />
      </div>
    </XtDialog>
    <XtDialog v-model="editFloorDialog" title="编辑楼层名称" @cancel="editFloorDialog = false" @confirm="editFloor">
      <div class="font-sans font-semibold text-4">
        编辑当前楼层：
      </div>
      <div class="mt-5">
        <el-input v-model="floorList[currentFloorIndex].name" placeholder="请输入楼层名称" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped></style>

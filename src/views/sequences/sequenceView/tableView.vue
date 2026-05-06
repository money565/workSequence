<script setup lang="ts">
import type { sequence } from '../target'
import { getSequenceByPage } from '@/axios/interfaceWorkBase'
import { useAppCacheStore } from '@/stores/appCache'
import modifyDialog from './modify/modifyDialog.vue'
import itemsShow from './tableItem/itemsShow.vue'

interface editOpt {
  id: number
  target: 'title' | 'c_time' | 'floor' | 'posit' | 'objs' | 'target' | 'tools' | 'ins' | undefined
  title: string
  value: string | number | string[] | number[] | undefined
  show: boolean
  addition?: number
}
const sequenceList = ref<sequence[]>([])
const acs = useAppCacheStore()
const page = ref(1)
const perpage = ref(15)
const total = ref(1)
const loading = ref(false)
const edit = reactive<editOpt>({
  id: -1,
  title: '',
  value: undefined,
  target: undefined,
  show: false,
})

function editItems(index: number, target: 'title' | 'c_time' | 'floor' | 'posit' | 'objs' | 'target' | 'tools' | 'ins' | undefined, addition: number = -1) {
  edit.id = sequenceList.value[index].id
  edit.target = target
  const title = `编辑${sequenceList.value[index].name?.slice(0, 20) ?? ''}的`
  if (target === 'title') {
    edit.title = `${title}标题`
    edit.value = sequenceList.value[index].name
  }
  if (target === 'c_time') {
    edit.title = `${title}时间`
    edit.value = [`${sequenceList.value[index].start}`, `${sequenceList.value[index].end}`]
  }
  if (target === 'floor') {
    edit.title = `${title}楼层`
    edit.value = sequenceList.value[index].floor.id
  }
  if (target === 'posit') {
    edit.title = `${title}位置`
    edit.value = sequenceList.value[index].posit.id
  }
  if (target === 'objs') {
    edit.title = `${title}流程对象`
    edit.addition = addition
    edit.value = sequenceList.value[index].objs.map(item => `o_${item.id}`)
  }
  if (target === 'target') {
    edit.title = `${title}流程任务`
    edit.value = sequenceList.value[index].target.map(item => item.id)
  }
  if (target === 'tools') {
    edit.title = `${title}工具`
    edit.value = sequenceList.value[index].tools.map(item => item.id)
  }
  if (target === 'ins') {
    edit.title = `${title}考核内容`
    edit.value = sequenceList.value[index].ins.map(item => item.id)
  }
  edit.show = true
}

function init() {
  loading.value = true
  getSequenceByPage(acs.currentProject, page.value, perpage.value).then(({ data: res }) => {
    sequenceList.value = res.result
    total.value = res.total
    loading.value = false
  })
}

function stopSeq(index: number) {
  console.log(index)
}

onMounted(() => {
  init()
})

watch(() => acs.currentProject, () => {
  if (acs.currentProject !== -1) {
    init()
  }
  else {
    sequenceList.value = []
  }
})
</script>

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="sequenceList"
      height="750"
      style="width: 100%"
    >
      <el-table-column prop="date" label="序号" width="80" align="center">
        <template #default="scoped">
          {{ scoped.$index + (page - 1) * perpage + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程名称" width="300" align="center">
        <template #default="scoped">
          <el-popover
            title="流程名称"
            placement="right-start"
            width="300"
            :show-after="256"
          >
            <template #reference>
              <div class="w-100% truncate">
                {{ scoped.row.name }}
              </div>
            </template>
            <div class="flex gap-2">
              <div>
                {{ scoped.row.name }}
              </div>
              <div class="cursor-pointer" @click="editItems(scoped.$index, 'title')">
                <el-icon size="18">
                  <SvgIcon name="edit" />
                </el-icon>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程时间" width="180" align="center">
        <template #default="scoped">
          <div class="cursor-pointer" @click="editItems(scoped.$index, 'c_time')">
            {{ scoped.row.start }}-{{ scoped.row.end }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="计划清洁" width="80" align="center">
        <template #default="scoped">
          <el-text :type="scoped.row.plant ? 'primary' : 'success'">
            {{ scoped.row.plant ? '是' : '否' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="楼层" width="80" align="center">
        <template #default="scoped">
          <div class="cursor-pointer" @click="editItems(scoped.$index, 'floor')">
            <el-text>
              {{ scoped.row.floor.name }}
            </el-text>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="位置" width="180" align="center">
        <template #default="scoped">
          <div class="cursor-pointer" @click="editItems(scoped.$index, 'posit')">
            <el-text>
              {{ scoped.row.posit.name }}
            </el-text>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程对象" width="200" align="center">
        <template #default="scoped">
          <div @click="editItems(scoped.$index, 'objs', scoped.row.posit.id)">
            <itemsShow title="流程对象" :items="scoped.row.objs" type="primary" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程任务" width="200" align="center">
        <template #default="scoped">
          <div @click="editItems(scoped.$index, 'target', scoped.row.posit.id)">
            <itemsShow title="流程任务" :items="scoped.row.target" type="success" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="所需工具" width="200" align="center">
        <template #default="scoped">
          <itemsShow title="所需工具" :items="scoped.row.tools" type="warning" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="考核" width="280" align="center">
        <template #default="scoped">
          <itemsShow title="考核" :items="scoped.row.ins" type="danger" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #default="scoped">
          <div class="flex gap-2">
            <el-button @click="stopSeq(scoped.row.id)">
              停用
            </el-button>
            <el-button>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:page-size="perpage" v-model:current-page="page" background layout="prev, pager, next" :total="total" @change="init()" />
    <modifyDialog
      :id="edit.id"
      :trun-on="edit.show"
      :title="edit.title"
      :value="edit.value"
      :target="edit.target"
      :addition="edit.addition"
      @cancel="edit.show = false"
      @confirm="init(), edit.show = false"
    />
  </div>
</template>

<style scoped>

</style>

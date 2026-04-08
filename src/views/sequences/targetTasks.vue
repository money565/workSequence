<script lang="ts" setup>
import type { RenderContentContext } from 'element-plus/es/components/tree/src/tree.type.mjs'
import type { TASK_OPT } from './target'
import { createActionTarget, deleteActionTarget, getActionTargets } from '@/axios/interfaceWorkBase'

type Node = RenderContentContext['node']
function addNode(node: Node) {
  node.data.children.push({
    name: '',
    icon: '',
    parent: node.data.id,
    children: [],
  })
  console.log(node.data)
}
const taskTargets = ref<TASK_OPT[]>([])
const currentItemTempId = ref<number>()
const showPopover = ref(false)
const types = ref<{ id: number, name: string, icon: string }[]>([])
function init() {
  getActionTargets().then(({ data: res }) => {
    console.log(res)
    taskTargets.value = res.result
    taskTargets.value.push({
      name: '',
      icon: '',
      children: [],
      parent: null,
    })
    types.value = res.types
  })
}

function createAction(node: Node) {
  if (node.data.icon === undefined) {
    node.data.errorMesg = '请选择一个标志'
    return null
  }
  if (node.data.name === '') {
    node.data.errorMesg = '请输入动作名称'
    return null
  }
  node.data.errorMesg = ''
  const param = {
    name: node.data.name,
    type: types.value.find(item => item.icon === node.data.icon)?.id,
    parent: node.data.parent,
  }
  console.log(param)
  createActionTarget(param).then(() => {
    init()
  })
}

function delNode(node: Node) {
  deleteActionTarget(node.data.id).then(() => {
    init()
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-tree
      style="max-width: 50rem"
      :data="taskTargets"
      default-expand-all
      node-key="id"
    >
      <template #default="{ data, node }">
        <div v-if="data.id !== undefined" class="flex gap-2">
          <div>
            <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${data.icon}.svg`" style="width:3rem" />
          </div>
          <div class="flex items-center justify-start w-30">
            <el-text size="large">
              {{ data.name }}
            </el-text>
          </div>
          <div class="flex items-center justify-center mt-1">
            <el-button type="primary" link size="large" @click.stop="addNode(node)">
              添加子集
            </el-button>
          </div>
          <div class="flex items-center justify-center mt-1">
            <el-button type="danger" link size="large" @click.stop="delNode(node)">
              删除子集
            </el-button>
          </div>
        </div>
        <div v-else>
          <div class="flex gap-2">
            <div>
              <el-input v-model="data.name" placeholder="请输入流程目的名称" @click="currentItemTempId = node.id" />
            </div>
            <div class="flex items-center justify-center">
              <el-popover
                placement="bottom"
                :width="600"
                trigger="click"
                :visible="currentItemTempId === node.id && showPopover"
              >
                <template #reference>
                  <el-icon size="30" @click="currentItemTempId = node.id, showPopover = true">
                    <svg-icon name="svg-icon" />
                  </el-icon>
                </template>
                <el-card>
                  <div v-if="types.length > 0" class="flex flex-wrap w-100% max-h-90 overflow-auto">
                    <div
                      v-for="(type, index) in types"
                      :key="index"
                      class="pt-5 cursor-pointer w-5rem h-5rem tree-item rounded-xl"
                      :class="{ ' bg-blue-400': data.icon === type.icon }"
                      @click="data.icon = type.icon"
                    >
                      <div class="flex justify-center items-center">
                        <el-image :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${type.icon}.svg`" style="width:2rem" />
                      </div>

                      <div class="flex justify-center items-center">
                        <el-text>
                          {{ type.name }}
                        </el-text>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <el-text>
                      没有可选用的图标
                    </el-text>
                  </div>
                  <template #footer>
                    <div class="w-100% flex gap-2 items-end justify-end">
                      <el-button type="primary" @click="showPopover = false">
                        确定
                      </el-button>
                    </div>
                  </template>
                </el-card>
              </el-popover>
            </div>
            <div v-if="data.icon">
              <el-image style="width:2rem" :src="`https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/${data.icon}.svg`" />
            </div>
            <div class="ml-10">
              <el-button @click="createAction(node)">
                <el-icon size="30">
                  <svg-icon name="right" />
                </el-icon>
              </el-button>
            </div>
            <div v-if="node.data.errorMesg" class="ml-10">
              <el-text type="danger">
                {{ node.data.errorMesg }}
              </el-text>
            </div>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss">
/* 🔥 核心：提高 el-tree 行高 */
.el-tree-node__content {
  height: 4rem !important; /* 行高：默认34px → 改大即可 */
}
.el-tree-node__children {
  padding-left: 4rem !important;
}

/* 让内容垂直居中 */
.el-tree-node__label,
.tree-node {
  display: flex;
  align-items: center;
  height: 100%;
}
/* ------------------------------------------------ */
/* 🔥 核心：父节点最深，子节点逐级变浅 */
/* ------------------------------------------------ */
/* 一级节点（最深） */
.node-text[data-level="0"] {
  color: #1f2329 !important;
  font-weight: 600;
}
/* 二级节点（浅） */
.node-text[data-level="1"] {
  color: #4e5969 !important;
}
/* 三级节点（更浅，你有更深层级可继续加） */
.node-text[data-level="2"] {
  color: #86909c !important;
}

/* hover / 选中 颜色不变 */
.el-tree-node__content:hover .node-text,
.el-tree-node.is-current .node-text {
  color: #1989fa !important;
}

/* 放大展开/折叠箭头 */
.el-tree-node__expand-icon {
  font-size: 2rem !important; /* 改大这个数字 */
  font-weight: bold;
  margin-right: 1rem;
}

/* 展开时旋转更顺 */
.el-tree-node__expand-icon.is-opened {
  transform: rotate(90deg) scale(1.1);
}
</style>

<script setup lang="ts">
import projectView from '@/views/public/projectView.vue'
import { ArrowDown, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const currentDate = ref('')

// 手机端精简日期
function getCurrentDate() {
  const date = new Date()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  currentDate.value = `${m}-${d} 周${week}`
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心')
      break
    case 'settings':
      ElMessage.info('账号设置')
      break
    case 'logout':
      ElMessage.success('已退出登录')
      break
  }
}

onMounted(() => {
  getCurrentDate()
})
</script>

<template>
  <!-- 移动端渐变顶部栏 -->
  <div
    class="fixed top-0 left-0 right-0 h-12 px-4 z-999
           flex items-center justify-between bg-blue-500
           bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
  >
    <!-- 左侧标题 -->
    <div>
      <projectView :width="10" />
    </div>

    <!-- 右侧：日期 + 用户菜单 -->
    <div class="flex items-center gap-3">
      <div class="text-4 text-white/90 whitespace-nowrap">
        {{ currentDate }}
      </div>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="flex items-center gap-1 px-1 py-2 cursor-pointer text-white">
          <el-icon class="text-base" size="22">
            <User />
          </el-icon>
          <el-icon class="text-xl text-white/80 ml-0.5">
            <ArrowDown />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              已检查内容
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              问题回看
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 内容占位 -->
  <div class="h-12" />
</template>

<!-- eslint-disable no-useless-call -->
<script setup lang="ts">
import { useUserStore } from '@/stores/counter'
import { useSidebarStore } from '@/stores/sidebar'
import projectView from '@/views/public/projectView.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = useUserStore()
const message: number = 2
const fullScreen = ref(true)

const sidebar = useSidebarStore()
// 侧边栏折叠
function collapseChage() {
  sidebar.handleCollapse()
}

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage()
  }
})

// 用户名下拉菜单选择事件
const router = useRouter()
function handleCommand(command: string) {
  if (command === 'loginout') {
    localStorage.removeItem('xcwypsi_userMsg')
    router.push('/login')
  }
  else if (command === 'user') {
    router.push('/ucenter')
  }
}

function setFullScreen() {
  if (document.fullscreenElement) {
    fullScreen.value = true
    document.exitFullscreen()
  }
  else {
    fullScreen.value = false
    document.body.requestFullscreen.call(document.body)
  }
}
</script>

<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="header-left">
      <img class="logo" src="../assets/img/logo.svg" alt="">
      <div class="web-title font-sans text-5">
        细川岗位流程管理
      </div>
      <div class="collapse-btn" @click="collapseChage">
        <el-icon v-if="sidebar.collapse">
          <Expand />
        </el-icon>
        <el-icon v-else>
          <Fold />
        </el-icon>
      </div>
    </div>
    <div class="header-right">
      <div class="flex items-center justify-center h-5 gap-7">
        <div>
          <projectView :width="15" />
        </div>
        <div @click="router.push('/theme')">
          <el-icon size="30">
            <SvgIcon name="theme" />
          </el-icon>
        </div>
        <div class="mt-2" @click="router.push('/ucenter')">
          <el-badge :value="12" class="item">
            <el-icon size="23">
              <SvgIcon :name="message ? 'mail' : 'mailOpen'" />
            </el-icon>
          </el-badge>
        </div>
        <div class="mt-1" @click="setFullScreen">
          <el-icon size="21">
            <SvgIcon :name="fullScreen ? 'fullScreen' : 'exitFullScreen'" />
          </el-icon>
        </div>
        <!-- 用户头像 -->
        <div class="flex gap-1">
          <el-avatar class="user-avator" :size="30" :src="user.userInfo.avatar" />
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ user.userInfo.username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                  <el-dropdown-item>项目仓库</el-dropdown-item>
                </a>
                <a href="https://lin-xin.gitee.io/example/vuems-doc/" target="_blank">
                  <el-dropdown-item>官方文档</el-dropdown-item>
                </a>
                <el-dropdown-item command="user">
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided command="loginout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    color: var(--header-text-color);
    background-color: var(--header-bg-color);
    border-bottom: 1px solid #ddd;
}

.header-left {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 100%;
}

.logo {
    width: 35px;
}

.web-title {
    margin: 0 40px 0 10px;
}

.collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    opacity: 0.8;
    font-size: 22px;
}

.collapse-btn:hover {
    opacity: 1;
}

.header-right {
    float: right;
    padding-right: 50px;
}

.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.user-avator {
    margin: 0 10px 0 20px;
}

.el-dropdown-link {
    color: var(--header-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>

<!-- eslint-disable vue/valid-v-for -->
<script setup lang="ts">
import { menuData } from '@/components/menu'
import { useSidebarStore } from '@/stores/sidebar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const onRoutes = computed(() => {
  return route.path
})

const sidebar = useSidebarStore()
</script>

<template>
  {{ menuData }}
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      :background-color="sidebar.bgColor"
      :text-color="sidebar.textColor"
      router
    >
      <template v-for="item in menuData">
        <template v-if="item.children">
          <el-sub-menu :key="item.index" v-permiss="item.id" :index="item.index">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                v-if="subItem.children"
                :key="`${subItem.index}-submenu`"
                v-permiss="item.id"
                :index="subItem.index"
              >
                <template #title>
                  {{ subItem.title }}
                </template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :key="`${subItem.index}-item`" v-permiss="item.id" :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :key="item.index" v-permiss="item.id" :index="item.index">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 3rem;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 11rem;
}

.sidebar-el-menu {
    min-height: 100%;
}
</style>

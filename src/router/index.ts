import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/counter'
import { usePermissStore } from '@/stores/permiss'
import NProgress from 'nprogress'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页',
          noAuth: true,
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
      },
      {
        path: '/system-floor',
        name: 'system-floor',
        meta: {
          title: '楼层管理',
          permiss: '11',
        },
        component: () => import(/* webpackChunkName: "system-user" */ '../views/system/address.vue'),
      },
      {
        path: '/system-posit',
        name: 'system-posit',
        meta: {
          title: '位置管理',
          permiss: '12',
        },
        component: () => import(/* webpackChunkName: "system-role" */ '../views/system/posit.vue'),
      },
      {
        path: '/system-objs',
        name: 'system-objs',
        meta: {
          title: '流程对象',
          permiss: '13',
        },
        component: () => import(/* webpackChunkName: "system-menu" */ '../views/system/objs.vue'),
      },
      {
        path: '/system-job',
        name: 'system-job',
        meta: {
          title: '岗位管理',
          permiss: '31',
        },
        component: () => import(/* webpackChunkName: "table" */ '../views/system/job.vue'),
      },
      {
        path: '/kindOfplant',
        name: 'kindOfplant',
        meta: {
          title: '计划分类',
          permiss: '31',
        },
        component: () => import(/* webpackChunkName: "table" */ '../views/cleanPlant/kindOfplant.vue'),
      },

      {
        path: '/check',
        name: 'check',
        meta: {
          title: '历史检查',
          permiss: '41',
        },
        component: () => import(/* webpackChunkName: "schart" */ '../views/checkDatas/checkHistory.vue'),
      },
      {
        path: '/handle',
        name: 'handle',
        meta: {
          title: '问题处理',
          permiss: '42',
        },
        component: () => import(/* webpackChunkName: "echarts" */ '../views/checkDatas/problemHandling.vue'),
      },

      {
        path: '/icon',
        name: 'icon',
        meta: {
          title: '图标',
          permiss: '5',
        },
        component: () => import(/* webpackChunkName: "icon" */ '../views/iconView/iconView.vue'),
      },
      {
        path: '/toolsEditor',
        name: 'toolsEditor',
        meta: {
          title: '工具编辑',
          permiss: '291',
        },
        component: () => import(/* webpackChunkName: "editor" */ '../views/sequences/toolsEditor.vue'),
      },
      {
        path: '/objsType',
        name: 'objsType',
        meta: {
          title: '对象类型',
          permiss: '291',
        },
        component: () => import(/* webpackChunkName: "editor" */ '../views/sequences/objsTypeView.vue'),
      },
      {
        path: '/targetTasks',
        name: 'targetTasks',
        meta: {
          title: '流程目的',
          permiss: '293',
        },
        component: () => import(/* webpackChunkName: "editor" */ '../views/sequences/targetTasks.vue'),
      },
      {
        path: '/category',
        name: 'category',
        meta: {
          title: '检查类目',
          permiss: '292',
        },
        component: () => import(/* webpackChunkName: "markdown" */ '../views/sequences/categoryView.vue'),
      },
      {
        path: '/theme',
        name: 'theme',
        meta: {
          title: '主题设置',
          permiss: '7',
        },
        component: () => import(/* webpackChunkName: "theme" */ '../views/pages/theme.vue'),
      },
      {
        path: '/sequence',
        name: 'sequence',
        meta: {
          title: '流程管理',
          permiss: '21',
        },
        component: () => import(/* webpackChunkName: "form" */ '../views/sequences/sequenceView.vue'),
      },
      {
        path: '/plant',
        name: 'plant',
        meta: {
          title: '计划管理',
          permiss: '21',
        },
        component: () => import(/* webpackChunkName: "form" */ '../views/cleanPlant/cleanPlant.vue'),
      },
    ],
  },
  {
    path: '/mobileHome',
    name: 'mobileHome',
    meta: {
      title: '手机端',
      noAuth: false,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/mobile/index.vue'),
    children: [
      {
        // 关键步骤：设置一个 path 为空字符串的子路由
        path: '',
        // 重定向到你想默认展示的子页面路径（相对路径）
        redirect: 'home',
      },
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "login" */ '../views/mobile/home/homeView.vue'),
      },
      {
        path: '/checked',
        name: 'checked',
        component: () => import(/* webpackChunkName: "login" */ '../views/mobile/checked/checked.vue'),
      },
      {
        path: '/seqList',
        name: 'seqList',
        component: () => import(/* webpackChunkName: "login" */ '../views/mobile/seqList/seqList.vue'),
      },
    ],
  },
  {
    path: '/login',
    meta: {
      title: '登录',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/pages/login.vue'),
  },
  {
    path: '/403',
    meta: {
      title: '没有权限',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "403" */ '../views/pages/403.vue'),
  },
  {
    path: '/404',
    meta: {
      title: '找不到页面',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "404" */ '../views/pages/404.vue'),
  },
  { path: '/:path(.*)', redirect: '/404' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const permiss = usePermissStore()
  const user = useUserStore()

  if (!user.userInfo && to.meta.noAuth !== true) {
    next('/login')
  }
  else if (typeof to.meta.permiss == 'string' && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next('/403')
  }
  else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router

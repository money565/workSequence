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
        path: '/table-editor',
        name: 'table-editor',
        meta: {
          title: '可编辑表格',
          permiss: '32',
        },
        component: () => import(/* webpackChunkName: "table-editor" */ '../views/table/table-editor.vue'),
      },
      {
        path: '/schart',
        name: 'schart',
        meta: {
          title: 'schart图表',
          permiss: '41',
        },
        component: () => import(/* webpackChunkName: "schart" */ '../views/chart/schart.vue'),
      },
      {
        path: '/echarts',
        name: 'echarts',
        meta: {
          title: 'echarts图表',
          permiss: '42',
        },
        component: () => import(/* webpackChunkName: "echarts" */ '../views/chart/echarts.vue'),
      },

      {
        path: '/icon',
        name: 'icon',
        meta: {
          title: '图标',
          permiss: '5',
        },
        component: () => import(/* webpackChunkName: "icon" */ '../views/pages/icon.vue'),
      },
      {
        path: '/ucenter',
        name: 'ucenter',
        meta: {
          title: '个人中心',
        },
        component: () => import(/* webpackChunkName: "ucenter" */ '../views/pages/ucenter.vue'),
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
        path: '/category',
        name: 'category',
        meta: {
          title: '检查类目',
          permiss: '292',
        },
        component: () => import(/* webpackChunkName: "markdown" */ '../views/sequences/categoryView.vue'),
      },
      {
        path: '/export',
        name: 'export',
        meta: {
          title: '导出Excel',
          permiss: '34',
        },
        component: () => import(/* webpackChunkName: "export" */ '../views/table/export.vue'),
      },
      {
        path: '/import',
        name: 'import',
        meta: {
          title: '导入Excel',
          permiss: '33',
        },
        component: () => import(/* webpackChunkName: "import" */ '../views/table/import.vue'),
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
        path: '/calendar',
        name: 'calendar',
        meta: {
          title: '日历',
          permiss: '24',
        },
        component: () => import(/* webpackChunkName: "calendar" */ '../views/element/calendar.vue'),
      },
      {
        path: '/watermark',
        name: 'watermark',
        meta: {
          title: '水印',
          permiss: '25',
        },
        component: () => import(/* webpackChunkName: "watermark" */ '../views/element/watermark.vue'),
      },
      {
        path: '/carousel',
        name: 'carousel',
        meta: {
          title: '走马灯',
          permiss: '23',
        },
        component: () => import(/* webpackChunkName: "carousel" */ '../views/element/carousel.vue'),
      },
      {
        path: '/tour',
        name: 'tour',
        meta: {
          title: '分步引导',
          permiss: '26',
        },
        component: () => import(/* webpackChunkName: "tour" */ '../views/element/tour.vue'),
      },
      {
        path: '/steps',
        name: 'steps',
        meta: {
          title: '步骤条',
          permiss: '27',
        },
        component: () => import(/* webpackChunkName: "steps" */ '../views/element/steps.vue'),
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
        path: '/upload',
        name: 'upload',
        meta: {
          title: '上传',
          permiss: '22',
        },
        component: () => import(/* webpackChunkName: "upload" */ '../views/element/upload.vue'),
      },
      {
        path: '/statistic',
        name: 'statistic',
        meta: {
          title: '统计',
          permiss: '28',
        },
        component: () => import(/* webpackChunkName: "statistic" */ '../views/element/statistic.vue'),
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
    path: '/register',
    meta: {
      title: '注册',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "register" */ '../views/pages/register.vue'),
  },
  {
    path: '/reset-pwd',
    meta: {
      title: '重置密码',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "reset-pwd" */ '../views/pages/reset-pwd.vue'),
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
    console.log('权限', typeof to.meta.permiss, permiss.key.includes(to.meta.permiss))
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

import type { Menus } from '@/types/menu'

export const menuData: Menus[] = [
  {
    id: '0',
    title: '系统首页',
    index: '/dashboard',
    icon: 'Odometer',
  },
  {
    id: '1',
    title: '基础资料',
    index: '1',
    icon: 'HomeFilled',
    children: [
      {
        id: '11',
        pid: '1',
        index: '/system-floor',
        title: '楼层管理',
      },
      {
        id: '12',
        pid: '1',
        index: '/system-posit',
        title: '位置管理',
      },
      {
        id: '13',
        pid: '1',
        index: '/system-objs',
        title: '流程对象',
      },
      {
        id: '14',
        pid: '1',
        index: '/system-job',
        title: '岗位管理',
      },
    ],
  },
  {
    id: '2',
    title: '岗位流程',
    index: '2-1',
    icon: 'Calendar',
    children: [
      {
        id: '21',
        pid: '3',
        index: '/sequence',
        title: '流程管理',
      },
      {
        id: '29',
        pid: '3',
        index: '29',
        title: '工具和项目',
        children: [
          {
            id: '291',
            pid: '29',
            index: '/toolsEditor',
            title: '工具编辑',
          },
          {
            id: '292',
            pid: '29',
            index: '/category',
            title: '检查项目',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: '检查数据',
    index: '3',
    icon: 'Calendar',
    children: [
      {
        id: '31',
        pid: '3',
        index: '/table',
        title: '基础表格',
      },
      {
        id: '32',
        pid: '3',
        index: '/table-editor',
        title: '可编辑表格',
      },
      {
        id: '33',
        pid: '3',
        index: '/import',
        title: '导入Excel',
      },
      {
        id: '34',
        pid: '3',
        index: '/export',
        title: '导出Excel',
      },
    ],
  },
  {
    id: '4',
    icon: 'PieChart',
    index: '4',
    title: '图表',
    children: [
      {
        id: '41',
        pid: '4',
        index: '/schart',
        title: 'schart图表',
      },
      {
        id: '42',
        pid: '4',
        index: '/echarts',
        title: 'echarts图表',
      },
    ],
  },
  {
    id: '5',
    icon: 'Guide',
    index: '/icon',
    title: '图标',
    permiss: '5',
  },
  {
    id: '7',
    icon: 'Brush',
    index: '/theme',
    title: '主题',
  },
  {
    id: '6',
    icon: 'DocumentAdd',
    index: '6',
    title: '附加页面',
    children: [
      {
        id: '61',
        pid: '6',
        index: '/ucenter',
        title: '个人中心',
      },
      {
        id: '62',
        pid: '6',
        index: '/login',
        title: '登录',
      },
      {
        id: '63',
        pid: '6',
        index: '/register',
        title: '注册',
      },
      {
        id: '64',
        pid: '6',
        index: '/reset-pwd',
        title: '重设密码',
      },
      {
        id: '65',
        pid: '6',
        index: '/403',
        title: '403',
      },
      {
        id: '66',
        pid: '6',
        index: '/404',
        title: '404',
      },
    ],
  },
]

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
        id: '22',
        pid: '4',
        index: '2-1-1',
        title: '计划管理',
        children: [
          {
            id: '291',
            pid: '29',
            index: '/plant',
            title: '制定计划',
          },
          {
            id: '292',
            pid: '29',
            index: '/kindOfplant',
            title: '计划分类',
          },
        ],
      },
      {
        id: '29',
        pid: '3',
        index: '29',
        title: '工具和项目',
        children: [
          {
            id: '294',
            pid: '29',
            index: '/toolsEditor',
            title: '工具编辑',
          },
          {
            id: '295',
            pid: '30',
            index: '/targetTasks',
            title: '流程目的',
          },
          {
            id: '296',
            pid: '30',
            index: '/objsType',
            title: '对象类型',
          },
          {
            id: '297',
            pid: '29',
            index: '/category',
            title: '检查项目',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    icon: 'PieChart',
    index: '4',
    title: '检查数据',
    children: [
      {
        id: '41',
        pid: '4',
        index: '/check',
        title: '历史检查',
      },
      {
        id: '42',
        pid: '4',
        index: '/handle',
        title: '问题处理',
      },
    ],
  },
  {
    id: '5',
    icon: 'ElementPlus',
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

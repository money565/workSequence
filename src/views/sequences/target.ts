export interface TASK_OPT{
  id:number
  name:string
  icon:string
  children:TASK_OPT[]
}

export const task_target:TASK_OPT[] = [
  { id: 0, name: '清洁', icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/qingjie.svg', children: [
    {
      id: 7,
      name: '擦尘',
      icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/cashi.svg',
      children: [],
    },
    {
      id: 8,
      name: '推尘',
      icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/tuichen.svg',
      children: [],
    },
    {
      id: 11,
      name: '吸尘',
      icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/xichen.svg',
      children: [],
    },
    {
      id: 9,
      name: '墩地',
      icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/dundi.svg',
      children: [],
    },
    {
      id: 10,
      name: '清扫',
      icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/qingsao.svg',
      children: [],
    },
  ] },
  {
    id: 2,
    name: '维护',
    icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/weihu.svg',
    children: [],
  },
  {
    id: 3,
    name: '补充备品',
    icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/tianjiabeipin.svg',
    children: [],
  },
  {
    id: 4,
    name: '清洗',
    icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/qingxi.svg',
    children: [],
  },
  {
    id: 5,
    name: '清收',
    icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/qingshou.svg',
    children: [],
  },
  {
    id: 6,
    name: '换新',
    icon: 'https://xcwy-contract-1312050651.cos.ap-chengdu.myqcloud.com/genghuan.svg',
    children: [],
  },

]

export function flattenTree(tree: any[], childrenKey = 'children') {
  let result: any[] = []
  tree.forEach((node) => {
    result.push(node)
    if (node[childrenKey] && node[childrenKey].length) {
      result = result.concat(flattenTree(node[childrenKey], childrenKey))
    }
  })

  return result
}

export function targetList(params:number[]){
  console.log(params)
  const pan = flattenTree(task_target)
  const temp:TASK_OPT[] = []
  for(const i in params){
    for(const t in pan){
      if(pan[t].id === params[i]){
        temp.push({
          id:pan[t].id,
          name:pan[t].name,
          icon:pan[t].icon,
          children:[]
        })
      }
    }
  }
  return temp
}
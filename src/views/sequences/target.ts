export interface TASK_OPT {
  id?: number
  name: string
  icon: string
  children: TASK_OPT[]
  parent: number | null
  errMesg?: string
}

export interface TASK_OPT_OBJ_EXT extends TASK_OPT {
  objs: {
    id: number
    name: string
  }[]
}

export function flattenTree(tree: any[], childrenKey = 'children'): TASK_OPT[] {
  let result: any[] = []
  tree.forEach((node) => {
    result.push(node)
    if (node[childrenKey] && node[childrenKey].length) {
      result = result.concat(flattenTree(node[childrenKey], childrenKey))
    }
  })

  return result
}

export function targetList(params: number[], task_target: TASK_OPT[]) {
  const pan = flattenTree(task_target)
  const temp: TASK_OPT[] = []
  for (const i in params) {
    for (const t in pan) {
      if (pan[t].id === params[i]) {
        temp.push({
          id: pan[t].id,
          name: pan[t].name,
          icon: pan[t].icon,
          children: [],
          parent: null,
        })
      }
    }
  }
  return temp
}

export interface sequence {
  id: number
  name: string
  plant: boolean
  plantList?: {
    id: number
    name: string
  }[]
  currentPlant?: number
  floor: {
    id: number
    name: string
  }
  target: {
    id: number
    name: string
    icon: string
    result?: boolean
  }[]
  posit: {
    id: number
    name: string
  }
  objs: {
    id: number
    name: string
    type: string
    result?: boolean
  }[]
  start: string
  end: string
  start_num: number
  end_num: number
  ins: {
    id: number
    name: string
    icon: string
    parent:number | null
    result?: boolean
  }[]
  tools_accuracy: boolean
  tools: {
    id: number
    name: string
    icon: string
    result?: boolean
  }[]
  emp_accuracy: boolean
  emp: { id: number, name: string } []
}

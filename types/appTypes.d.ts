export interface objOpt {
  id: number
  name: string
  coor: string
  add?: {
    id?: number
    name?: string
  }
  types?: objectType[]
  params?: {
    label: string
    value: string
  }[]
}
export interface tableDataOpt {
  icon?: any
  project?: {
    ddingId: string
    id: number
  }
  cycleTarget?: {
    label: string
    value: number
  }
  id?: number
  regular?: number
  remindTime?: number
  insMethod?: {
    label: string
    value: number
  }
  name: string
  needPic?: boolean
  rush?: boolean
  obj: objOpt[]
  workGroup?: {
    name: string
    id: number
  }[]
  timeEnd?: string
  timeStart?: string
  state?: {
    label: string
    value: number
  }
  children?: tableDataOpt[]
}

export interface toSvgParam {
  address: string
  objList: objOpt[]
}

export interface taskListOpt {
  cycleTarget: {
    label: string
    value: number
  }
  id: number
  insMethod: {
    label: string
    value: number
  }
  name: string
  needPic: boolean
  obj: {
    add: {
      id: number
      name: string
    }
    id: number
    coor: string
    name: string
  }[]
  project: {
    ddingId: string
    id: number
  }
  regular: number
  remindTime: number
  rush: boolean
  state: {
    label: string
    value: number
  }
  teamID: number
  timeEnd: string
  timeStart: string
  workGroup: {
    id: number
    name: string
  }[]
}
interface thresholdOpt {
  sampleData: number
  valueName: string
  maxValue: number
  minValue: number
  sendMode: number[]
  sendSwitch: boolean
  numIndex: number
}
interface objThresholdLIstOpt {
  id: number
  name: string
  intelName: string
  address: { id: i.address.id, name: i.address.addName }
  data: thresholdOpt[]
}

interface objectType {
  id: number
  items: {
    props: {
      label: string
      value: string
      needExplain: boolean
    }[]
    title: string
    types: string
    result?: string
    explan?: string
  }[]
  tips: string
  title: string
}

interface addressOpt {
  address: {
    addName: string
    id: number
  }
  attr: boolean
  coordinate: string
  id: number
  name: string
  nfcCode: string
  parameters: {
    label: string
    value: string
  }[]
  project: {
    ddingId: string
    id: number
    name: string
  }
  QRCode: string
  types: taskListOpt
}

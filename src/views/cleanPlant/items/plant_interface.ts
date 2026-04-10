export interface ITEM {
  id: number
  name: string
  icon: string
}

export interface PLANT {
  id?: number
  name: string
  types: ITEM[]
  action: ITEM[]
  tools: ITEM[]
  cycle: number
  ex_date: number
  ins: ITEM[]
}

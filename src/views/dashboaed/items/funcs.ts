export interface DATA_OPT {
  name: string
  num: number
  all: number
}

export function x_name(dataList: DATA_OPT[]): string[] {
  const x: string[] = []
  for (const p in dataList) {
    x.push(dataList[p].name)
  }
  return x
}

export function y_name(dataList: DATA_OPT[]): number[][] {
  const y: number[] = []
  const a: number[] = []
  for (const p in dataList) {
    y.push(dataList[p].num)
    a.push(dataList[p].all)
  }
  return [y, a]
}

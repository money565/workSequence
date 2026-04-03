import type { Action } from 'element-plus'
import { ElMessageBox } from 'element-plus'

export function MesgBox(content: string, title: string) {
  ElMessageBox.alert(content, title, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定',
    callback: (action: Action) => {
      return action
    },
  })
}

export function MakeSure(content: string, title: string) {
  return new Promise((reject) => {
    ElMessageBox.confirm(content, title, {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      callback: (action: Action) => {
        reject(action)
      },
    })
  })
}

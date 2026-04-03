import { ElMessageBox } from 'element-plus'

export function el_alert(contents: string, title: string) {
  return new Promise((reslove) => {
    ElMessageBox.alert(contents, title, {
    // if you want to disable its autofocus
    // autofocus: false,
      confirmButtonText: '确定',
    }).then(() => {
      reslove('confirm')
    })
  })
}

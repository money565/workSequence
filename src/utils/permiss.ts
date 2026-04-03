// directives/permiss.ts
import type { Directive } from 'vue'
import { usePermissStore } from '@/stores/permiss'

export const permissDirective: Directive = {
  mounted(el: HTMLElement, binding) {
    const { value } = binding

    // 如果没有传入权限ID，默认显示
    if (!value)
      return

    // 支持传入数组或单个权限ID
    const permissionIds = Array.isArray(value) ? value : [value]

    // 从 store 获取权限检查函数
    const permissStore = usePermissStore()
    const hasPermission = permissionIds.some(id =>
      permissStore.hasPermission(id),
    )

    if (!hasPermission) {
      // 没有权限则隐藏元素
      el.style.display = 'none'
      // 或者可以添加一个自定义属性标记
      el.setAttribute('data-no-permission', 'true')
    }
  },

  updated(el: HTMLElement, binding) {
    const { value } = binding

    if (!value)
      return

    const permissionIds = Array.isArray(value) ? value : [value]
    const permissStore = usePermissStore()
    const hasPermission = permissionIds.some(id =>
      permissStore.hasPermission(id),
    )

    if (!hasPermission) {
      el.style.display = 'none'
      el.setAttribute('data-no-permission', 'true')
    }
    else {
      el.style.display = ''
      el.removeAttribute('data-no-permission')
    }
  },
}

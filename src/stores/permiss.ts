import { defineStore } from 'pinia'

interface ObjectList {
  [key: string]: string[]
}
export const usePermissStore = defineStore('permiss', () => {
  const defaultList: ObjectList = {
    admin: ['0', '1', '11', '12', '13', '2', '21', '22', '23', '24', '25', '26', '27', '28', '29', '291', '292', '3', '31', '32', '33', '34', '4', '41', '42', '5', '7', '6', '61', '62', '63', '64', '65', '66'],
    user: ['0', '1', '11', '12', '13'],
  }
  const currentUser = ref('admin') // 可以根据实际登录状态修改

  // 计算当前用户的权限列表
  const key = computed(() => {
    return currentUser.value === 'admin' ? defaultList.admin : defaultList.user
  })

  // 检查是否有某个权限
  const hasPermission = (permissionId: string | number): boolean => {
    return key.value.includes(String(permissionId))
  }

  // 设置当前用户（登录时调用）
  const setUser = (username: string) => {
    currentUser.value = username
  }
  return {
    key,
    defaultList,
    hasPermission,
    setUser,
    currentUser,
  }
})

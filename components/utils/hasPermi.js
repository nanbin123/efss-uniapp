import useUserStore from '@/store/modules/user.js'
import { unref } from 'vue'

function hasPermi(binding) {
  // 1. 获取指令传入的权限值（兼容 Vue 指令 binding 对象）
  const value = unref(binding.value || binding)
  
  const all_permission = '*:*:*'
  const userStore = useUserStore()
  const permissions = userStore.permissions || []

  // 2. 校验必须传入数组
  if (!value || !Array.isArray(value) || value.length === 0) {
    throw new Error(`请设置操作权限标签值（必须是数组）`)
  }
 
  const permissionFlag = value
  
  let a = permissions.some(
		permission => all_permission === permission || permissionFlag.includes(permission)
	)
  // 3. 权限判断：拥有全部权限 OR 包含指定权限
  return a;
}

export { hasPermi }
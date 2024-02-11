//import useUserStore from '@/store/modules/user.js'
import { unref } from 'vue';
function hasPermi(binding) {
	//console.log("====="+binding)
	const  value  = binding		
	const all_permission = "*:*:*";	
	/* const userStore = useUserStore();
	const permissions = userStore.data.permissions; */
	const permissions = uni.getStorageSync("permissions")
	if (value && value instanceof Array && value.length > 0) {
	  const permissionFlag = value	
	   return permissions.some(permission => {			 
			return all_permission === permission || permissionFlag.includes(permission)
	  })
	} else {
	  throw new Error(`请设置操作权限标签值`)
	} 
}

export {	
	hasPermi
};

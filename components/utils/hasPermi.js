import useUserStore from '@/store/modules/user.js'
function hasPermi(binding) {
	
 	const  value  = binding		
	const all_permission = "*:*:*";
	const permissions = useUserStore().permissions
	
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

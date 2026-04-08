import { defineStore } from 'pinia'

const useUserStore = defineStore( 'userStore', {
    state: () => ({
      data:{
		   permissions: []
	  }
    }),
    actions: {
		addPermissions(permissions){
			this.permissions = permissions;
		},
    }
  })

export default useUserStore
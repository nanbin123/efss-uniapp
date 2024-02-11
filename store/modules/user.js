import {get,post} from "../../components/utils/request.js"
import { defineStore } from 'pinia'

const useUserStore = defineStore( 'user', {
    state: () => ({
      data:{
		   permissions: []
	  }
    }),
	getters: {
/* 		getPermissions() {
			console.log("===woshi  get方法==")		
			return this.permissions;		
		}, */
	  },
    actions: {
      // 获取用户信息
/*      getInfo(){
			this.permissions =  ["*:*:*"]
		  	get("getInfo").then(res =>{
		  		uni.hideLoading();					
		  		//const user = res.user
		  		this.permissions = res.permissions					
		  		//resolve(res)
		  	})
      } */
    }
  })

export default useUserStore
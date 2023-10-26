import {get,post} from "../../components/utils/request.js"
import { defineStore } from 'pinia'
const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      permissions: []
    }),
    actions: {
      // 获取用户信息
      getInfo(){
		return new Promise((resolve, reject) => {			
		  	get("getInfo").then(res =>{
		  		uni.hideLoading();					
		  		const user = res.user
		  		this.permissions = res.permissions		  		
		  		resolve(res)
		  	}) 
		})
      }
    }
  })

export default useUserStore
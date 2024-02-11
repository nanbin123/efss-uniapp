import { defineStore } from 'pinia'
//还没有用，打算用于所有的更多查询，等所有的页面改完后编译成小程序看看支不支持pinia
const useUserStore = defineStore('more_search', {
    state: () => ({
      more_search: {
		  name: 'Eduardo'
	  }
    })
  })

export default useUserStore
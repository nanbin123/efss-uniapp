import { defineStore } from 'pinia'

const useOrderStore = defineStore( 'orderStore', {
    state: () => ({
      data:{
		   products: [],//订单新增、详情跳转选择产品跳转页面传输数据
		   orderProducts:[]//选择完产品跳转至订单页面传输数据
	  }
    }),
    actions: {
		addProduct(products){						this.products = products		},
		addOrderProducts(products){
			this.orderProducts = products
		}
    }
  })

export default useOrderStore
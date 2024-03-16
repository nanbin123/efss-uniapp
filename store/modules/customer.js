import { defineStore } from 'pinia'

const useCustomerStore = defineStore( 'customerStore', {
    state: () => ({
      data:{
		   products: []
	  }
    }),
    actions: {
		addProduct(products){			this.products = products		}
    }
  })

export default useCustomerStore
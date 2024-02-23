import { defineStore } from 'pinia'

const useOrderStore = defineStore( 'orderStore', {
    state: () => ({
      data:{
		   products: []
	  }
    }),
    actions: {
		addProduct(products){			this.products = products		}
    }
  })

export default useOrderStore
import { defineStore } from 'pinia'

const useCustomerStore = defineStore( 'customerStore', {
    state: () => ({
      data:{
		   products: [],
		   moreSearchCustomer:{}
	  }
    }),
    actions: {
		addProduct(products){			this.products = products		},
		addMoreSearchCustomer(moreSearchCustomer){
			this.moreSearchCustomer = moreSearchCustomer;
		}
    }
  })

export default useCustomerStore
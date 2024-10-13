import { defineStore } from 'pinia'

const useOrderStore = defineStore( 'orderStore', {
    state: () => {
		return{
			products: [],
			moreSearchOrder:{}
		}
    },
    actions: {
		addProduct(products){			this.products = products		},
		addMoreSearchOrder(moreSearchOrder){
			this.moreSearchOrder = moreSearchOrder;
		}
    }
  })

export default useOrderStore
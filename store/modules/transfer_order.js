import { defineStore } from 'pinia'
/**
 * 意向客户转订单
 */
const useTransferOrderStore = defineStore( 'transferOrderStore', {
    state: () => ({
      data:{
		  customer:{customerProducts:[]}
	  }
    }),
    actions: {
		addCustomer(customer){			this.customer = customer;		}
    }
  })

export default useTransferOrderStore
import { defineStore } from 'pinia'

const useProductStore = defineStore( 'productStore', {
    state: () => {
		return{
			products: []
		}
    },
    actions: {
		addProduct(products){
			this.products = products
		},
		clearProductStore(){
			let _this = this;
			Object.keys(this.products).forEach(function(key){					
				_this.products[key]="";
			})
		}
    }
  })

export default useProductStore
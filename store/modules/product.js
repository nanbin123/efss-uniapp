import { defineStore } from 'pinia'

const useProductStore = defineStore( 'productStore', {
    state: () => {
		return{
			moreSearchProduct:{}
		}
    },
    actions: {		
		addMoreSearchProduct(moreSearchProduct){
			this.moreSearchProduct = moreSearchProduct;
		},
		clearProductStore(){
			let _this = this;
			Object.keys(this.moreSearchProduct).forEach(function(key){					
				_this.moreSearchProduct[key]="";
			})
		}
    }
  })

export default useProductStore
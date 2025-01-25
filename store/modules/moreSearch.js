import { defineStore } from 'pinia'

const useProductStore = defineStore( 'productStore', {
    state: () => {
		return{		
			moreSearch:{}
		}
    },
    actions: {
		addMoreSearchProduct(moreSearchProduct){
			this.moreSearchProduct = moreSearchProduct;
		},
		clearMoreSearchStore(){
			let _this = this;
			Object.keys(this.moreSearch).forEach(function(key){					
				_this.moreSearch[key]="";
			})
		}
    }
  })

export default useProductStore
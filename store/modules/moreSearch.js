import { defineStore } from 'pinia'

const useMoreSearchStore = defineStore( 'moreSearchStore', {
    state: () => {
		return{		
			moreSearch:{}
		}
    },
    actions: {
		addMoreSearch(moreSearch){
			this.moreSearch = moreSearch;
		},
		clearMoreSearchStore(){
			let _this = this;
			Object.keys(this.moreSearch).forEach(function(key){					
				_this.moreSearch[key]="";
			})
		}
    }
  })

export default useMoreSearchStore
<template>
<view class="head"></view>
	<view class="item">		
		<view  class="title">客户姓名</view>			
		<input v-model="outboundForm.customerName" type="text" placeholder-class="input-placeholder" placeholder="请输入客户姓名">
	</view>
	<view class="item">
		<view style="margin-left: 0;" class="title">客户电话</view>			
		<input  v-model="outboundForm.customerPhone" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
	</view>
	
	<view class="bottom-bar">
		<view class="clear-btn" @click="clearFilters">清空所有筛选条件</view>
		<view class="search-btn" @click="search">查询</view>
	</view>
</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	import cPicker from "../../components/c-picker/c-picker.vue"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'

	export default {
		components: {
			cPicker
		},
		data() {
			return {			
				start_date:"",
				outboundForm:{}
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return {
				moreSearchStore
			}
		 },
		methods: {
			search(){
				let order = this.outboundForm;
				this.moreSearchStore.addMoreSearch(order);
				let pages = getCurrentPages();
				if(pages.length >1){
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							pages[pages.length -2].$vm.getOutbountList();
						}
					})
				}
			},
			clearFilters(){
				let that = this;
				Object.keys(this.outboundForm).forEach(function(key){					
					that.outboundForm[key]="";
				})
				this.moreSearchStore.clearMoreSearchStore(this.outboundForm);
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			isEmpty(str){
				return typeof str === 'undefined' || '' === str;
			}
		},
		onShow() {
			this.outboundForm = this.moreSearchStore.moreSearch;
		}	
	} 
</script>

<style scoped>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
}
.item{
	display: flex;	
	padding: 8px 0 8px 10px;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .title{
	font-size: 15px;
	line-height: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item input{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;	
	text-rendering: optimizeLegibility;
}
.time{
	margin-left: auto;
	text-align: right;
	padding-right: 12px;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
}
.starLen{
	display: flex;
	margin-left: auto;
}
.star{
	width: 17px;
	height: 17px;
	padding: 0 17px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center; 
}

.clear-btn, .search-btn { 
  text-align: center;
  padding: 7px;
  border-radius: 5px;
  font-size: 15px;
  margin: 10px;
}

.clear-btn {
  background-color: #fff;
  border: 1px solid #00a7e2ff; 
  color: #00a7e2ff; 
  width: 35%;
}

.search-btn {
  background-color: #00a7e2ff;
  color: #fff; 
  width: 30%;
}

</style>

<template>
		<view style="height: 5px;">
			<view class="head"></view>
		</view>	

		<view class="item">
			<image style="margin-top: 1px;margin-right: -2px;" class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')" ></image>
			<text class="title">入库单号:</text>			
			<input v-model="warehousingEntry.warehousingNumber" type="text" placeholder-class="input-placeholder" placeholder="请输入入库单号"/>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')"></image>
			<text class="title">记录日期:</text>
			<view  @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' @confirm="recordHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/supplier.png')"></image>
			<text class="title">供应商:</text>
			<input v-model="warehousingEntry.supplier" type="text"  placeholder-class="input-placeholder" placeholder="请输入供应商" />
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
				warehousingEntry:{}
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
				let warehousingEntry = this.warehousingEntry;
				this.moreSearchStore.addMoreSearch(warehousingEntry);			
				let pages = getCurrentPages();
				if(pages.length >1){
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							pages[pages.length -2].$vm.getWarehousingEntryList();
						}
					})
				}
			},
			clearFilters(){
				let _this = this;
				Object.keys(this.warehousingEntry).forEach(function(key){					
					_this.warehousingEntry[key]="";
				})
				this.moreSearchStore.clearMoreSearchStore();
			},
			toggle(val) {
				this.$refs[val].show();
			},
			recordHand(value) {
				this.warehousingEntry.recordDate = value.result							
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			isEmpty(str){
				return typeof str === 'undefined' || '' === str;
			}
		},
		onShow() {
			this.warehousingEntry = this.moreSearchStore.moreSearch;				
		}	
	}
</script>

<style scoped>

.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
}

.item{
	display: flex;	
	padding: 8px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;	
}
.item .title{
	margin-left: 1px;
	font-size: 15px;
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
  border: 1px solid #38c1b9; 
  color: #38c1b9; 
  width: 35%;
}

.search-btn {
  background-color: #38c1b9;
  color: #fff; 
  width: 30%;
}





</style>

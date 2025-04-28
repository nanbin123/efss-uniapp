<template>
<view class="head"></view>

	<view class="item">
		<image class="img" style="width: 19px;" :src="getImgUrl('static/image/order/cusomer_name_add.png')"></image>
		<view  class="title">客户姓名</view>			
		<input v-model="orderForm.customerName" type="text" placeholder-class="input-placeholder" placeholder="请输入客户姓名">
	</view>
	<view class="item">
		<image class="img" style="margin-top: 3px;" :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
		<view style="margin-left: 0;" class="title">客户电话</view>			
		<input  v-model="orderForm.phone" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/order/cusomer_address.png')"></image>
		<view class="title">客户地址</view>
		<input  v-model="orderForm.address" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/order/order_number.png')"></image>
		<view class="title">订单号</view>		
		<input type="text"  v-model="orderForm.orderNumber"	placeholder-class="input-placeholder"  placeholder="请输入订单号"/>
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/order/start_time.png')"></image>
		<view class="title">下单开始时间</view>
		<view  @tap="toggle('start_date')" class="time" :style="{color:isEmpty(orderForm.startTime) ?'#a0a0a0':'#333'}">{{isEmpty(orderForm.startTime)? "请选择":orderForm.startTime}}</view>
		<cPicker mode='date' @confirm="startHand" ref="start_date"></cPicker>
	</view>
	<view class="item">			
		<image class="img" :src="getImgUrl('static/image/order/end_time.png')"></image>
		<view class="title">下单终止时间</view>
		<view  @tap="toggle('end_date')" class="time" :style="{color:isEmpty(orderForm.endTime) ?'#a0a0a0':'#333'}">{{isEmpty(orderForm.endTime) ? "请选择":orderForm.endTime}}</view>
		<cPicker mode='date' @confirm="endHand" ref="end_date"></cPicker>
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
				fullStarUrl:'static/image/cusomer/star.png',
				nullStarUrl:'static/image/cusomer/empty.png',
				start_date:"",
				orderForm:{}
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return {
				moreSearchStore
			}
		 },
		methods: {
			toggle(val) {
				this.$refs[val].show();
			},
			startHand(value) {
				this.orderForm.startTime = value.result							
			},
			endHand(value) {
				this.orderForm.endTime = value.result							
			},
			search(){
				let order = this.orderForm;
				this.moreSearchStore.addMoreSearch(order);
				let pages = getCurrentPages();
				if(pages.length >1){
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							pages[pages.length -2].$vm.getOrderList();
						}
					})
				}
			},
			clearFilters(){
				let that = this;
				Object.keys(this.orderForm).forEach(function(key){					
					that.orderForm[key]="";
				})
				this.moreSearchStore.addMoreSearchOrder(this.orderForm);
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			isEmpty(str){
				return typeof str === 'undefined' || '' === str;
			}
		},
		onShow() {
			this.orderForm = this.moreSearchStore.moreSearch;
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

<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y style="height: calc(100vh - 35px);">
		<view class="item">
			<image  class="img" style="margin-top: 1px;margin-right: -2px;" :src="getImgUrl('static/image/warehousing/warehousing-number.png')" ></image>
			<text class="title">入库单号:</text>	
			<input v-model="warehousingEntry.warehousingNumber" type="text" disabled="disabled"/>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')"></image>
			<text class="title">记录日期:</text>
			<view @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' @confirm="recordDateHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/supplier.png')"></image>
			<text class="title">供应商:</text>
			<input v-model="warehousingEntry.supplier" type="text" />
		</view>	
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
			<text class="title">备注 :</text>	
			
			<input v-model="warehousingEntry.remark" type="text" />
			
		</view>
		<view class="item choice_porduct" @click="addWarehousingProduct()">
			<image class="img"  :src="getImgUrl('static/image/warehousing/choose_product.png')"></image>
			<text class="title">选择产品</text>
			<image class="add_product" :src="getImgUrl('static/image/add.png')"></image>
		</view>
		<view class="product"  v-for="(item,index) in warehousingEntry.warehousingEntryProductList">
			<view class="left">
				<image class="left_img" :src="getImgUrl('static/image/茶几.png')"></image>
			</view> 
			<view class="right">
				<view class="grid">
					<text class="info">品名：{{item.productName}}</text>
					<text class="info">型号：{{item.type}}</text>
				</view>
				<view class="grid">
					<text class="info" >尺寸：{{item.size}}</text>
					<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
				</view>
				<view class="grid">
					<text class="info">类别：{{item.productType}}</text>
					<text class="info">颜色：{{item.color}}</text>				
				</view>
				<view class="grid">
					<text class="info">材质：{{item.texture}}</text>	
					<text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
				</view>
				<view class="grid">
					<text class="info">数量：{{item.number}}</text>	
				</view>	
			</view> 
		</view>
	</scroll-view>
	<view class="btn" @click="addOrderForm()">
		<button>保存</button>
	</view>

</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	import cPicker from "../../components/c-picker/c-picker.vue"
	export default {
		components: {
			cPicker
		},
		options: {styleIsolation: 'shared'},
		data() {
			return {
				warehousingEntry:{}
			}
		},
		methods: {
			//选择产品
			addWarehousingProduct(){
				let that = this
				uni.navigateTo({
					url:'/pages/warehousing/warehousing_product?warehousingEntryId='+that.warehousingEntry.id
				})
			},
			getList(){
				post("warehousing/selectWarehousingEntryById",{"id":this.warehousingEntry.id}).then(res =>{
					if(200 == res.code){						
						this.warehousingEntry.warehousingEntryProductList = res.data.warehousingEntryProductList
						uni.hideLoading(); 
					}
				})
			},
			//确认提交 订单
			addOrderForm(){
				let warehousingEntryObj=JSON.parse(JSON.stringify(this.warehousingEntry));
				delete warehousingEntryObj.warehousingEntryProductList				
				post("warehousing/addUpdateWarehousingEntry",warehousingEntryObj).then(res =>{					
					if(200 == res.code){
						uni.hideLoading();
						uni.showToast({
							title: '添加入库单成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			recordDateHand(value) {				
				this.warehousingEntry.recordDate = value.result							
			},
			//时间弹窗
			toggle(val) {
				this.$refs[val].show();
			},
			isEmpty(str){
				return typeof str === 'undefined' || '' === str;
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad() {			
/* 			post("warehousing/insertWarehousingEntry").then(res =>{
				if(200 == res.code){
					this.warehousingEntry = res.data
					uni.hideLoading(); 
				}
			}) */
		}	
	}
</script>

<style>
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
	padding-left: 2px;
	width: 19px;
	height: 19px;	
}
.item .title{
	margin-left: 1px;
	font-size: 12px;
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
.item .time{
	margin-left: auto;
	text-align: right;
	padding-right: 12px;
}
.content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.item .uni-forms-item{
	width: 100%;
	margin-bottom:0;
	margin-left: auto;	
}
.item .uni-forms-item uni-input{
	display: inline;
	font-size: 18px;
	text-align: right;
}
.choice_porduct{
	position: relative;
	margin-bottom: 5px;
	padding-bottom: 5px;
	padding-top: 5px;
}
.add_product{
	width: 25px;
	height: 25px;
	position: absolute;
	right: 20px;
}

.product{
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 10rpx;
	margin-bottom: 15rpx;
}
.left{
	width: 70px;
	height: 70px;	
}
.left_img {
	width: 70px;
	height: 70px;
}
.right{
	width: 80%;
	margin-left: 5px;
}
.grid{
 	display: flex;	
	line-height: 14px;
}
.grid .info{
  width: 50%;
   color: #030303ff;
   font-size: 12px;
   color: #333;
   white-space: nowrap;  
}
.choice{
	display: flex;
	justify-content: space-between;
}
.delivery-status{
	color: #db081bff;
	font-size: 17px;
}
.choice checkbox{
	transform:scale(0.9);
	margin-right: 30px;
}
.btn{
	width: 80%;
	position: relative;
	top: 100rpx;
	margin: 0 auto;
}
.btn button{
	background-color: #00a7e2ff;
	border: 0;
	color: #daf2fbff;	
}
</style>

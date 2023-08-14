<template>
<view class="wrap">
	<view class="head"></view>
	<view class="item">
		<image class="img" src="../../static/image/warehousing/warehousing-number.png" mode=""></image>
		<text class="title">入库单号:</text>	
		<text class="content">{{warehousingEntry.warehousingNumber}}</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/warehousing/record_date.png" mode=""></image>
		<text class="title">记录日期:</text>	
		<text class="content">{{warehousingEntry.recordDate}}</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/warehousing/handled_by.png" mode=""></image>
		<text class="title">操作人:</text>	
		<text class="content">{{warehousingEntry.handledBy}}</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/warehousing/supplier.png" mode=""></image>
		<text class="title">供应商:</text>	
		<text class="content">{{warehousingEntry.supplier}}</text>	
	</view>		
	<view class="item">
		<image class="img" src="../../static/image/warehousing/warehousing-number.png" mode=""></image>
		<text class="title">备注 :</text>
		<text class="content">{{warehousingEntry.remark}}</text>
	</view>

		
	<view class="products">
		<view class="product-details">
			<image class="img" src="../../static/image/warehousing/choose_product.png" mode=""></image>
			<text class="title">产品明细</text>
		</view>
		
		<view class="product-list" v-for="(item,index) in warehousingEntry.warehousingEntryProductList">
			<view class="grid">
				<text class="info">品名：{{item.productName}}</text>
				<text class="info">型号：{{item.type}}</text>
				<text class="info">产地：{{item.production}}</text>
			</view>
			<view class="grid">	
				<text class="info">颜色：{{item.color}}</text>
				<text class="info">材质：{{item.texture}}</text>
				<text class="info" style="width: 40%;">尺寸：{{item.size}}</text>
			</view>
			<view class="choice">
				<text class="delivery-status">已入库</text>
				<checkbox checked="true" disabled="true"/>				
			</view>			
		</view>
<!-- 		<view class="product-list">
			<view class="grid">
				<text class="info">品名：长茶几</text>
				<text class="info">型号：7707-C</text>
				<text class="info">产地：东莞</text>
			</view>
			<view class="grid">				
				<text class="info">颜色：胡桃色</text>
				<text class="info">材质：楸木</text>
				<text class="info" style="width: 40%;">尺寸：1400*800*500</text>
			</view>
			<view class="choice">
				<text class="delivery-status">未入库</text>
				<checkbox checked="true"/>				
			</view>			
		</view> -->
	</view>
	<view class="btn">
		<button>确定</button>
	</view>
</view>
</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				warehousingEntry:{}
			}
		},
		methods: {
			
		},
		onLoad(option) {
				this.warehousingEntry.id = option.id				
				post("warehousing/selectWarehousingEntryById",{"id":this.warehousingEntry.id}).then(res =>{				
					if(200 == res.code){
						this.warehousingEntry = res.data
						uni.hideLoading(); 
					}
				})
		}	
	}
</script>

<style>
.wrap{
	width: 100%;	
}
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.item{
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #efeef3ff;
}
.img{
	width: 38rpx;
	height: 38rpx;	
}
.title{	
	white-space: nowrap;
	padding: 0 30rpx;
	font-size: 32rpx;
	color: #333;
}
.content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.products{
	border-top: 5px solid #efeef3ff;
}
.product-details{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx 0 20rpx;
}
.product-details .img{

}
.product-details text{
	font-size: 20px;
	font-weight: 600;
	color: #949494ff;	
}
.product-list{
	padding-left:20rpx;
	padding-top: 20rpx;
	border-bottom: 1px solid #c5c5c5ff;
}
.grid{
	width: 100%;
	display: flex;
	
}
.grid .info{
	width: 30%;
	color: #030303ff;
	font-size: 15px;
	line-height: 20px;
	word-break: break-all;
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
	/* margin-bottom: 10rpx; */
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

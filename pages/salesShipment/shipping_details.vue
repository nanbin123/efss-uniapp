<template>
<view class="wrap">
	<view class="item">
		<image class="img" src="../../static/image/cusomer/cusomer_name.png" mode=""></image>
		<text class="title">客户姓名:</text>	
		<text class="content">张三</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/customer_phone.png" mode=""></image>
		<text class="title">电话:</text>	
		<text class="content">15832922153</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/cusomer_address.png" mode=""></image>
		<text class="title">地址:</text>	
		<text class="content">北京市海淀区紫竹苑小区1号楼</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/shipping/sales_name.png" mode=""></image>
		<text class="title">销售人姓名:</text>	
		<text class="content">南滨</text>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/shipping/sales_telephone.png" mode=""></image>
		<text class="title">销售人电话:</text>	
		<text class="content">15832922153</text>	
	</view>	
	<view class="products">
		<view class="product-details">
			<image class="img" src="../../static/image/shipping/product_details.png" mode=""></image>
			<text class="title">产品明细</text>
		</view>
		<view class="product-list">
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
				<text class="delivery-status">已出库</text>
				<checkbox checked="true" disabled="true"/>				
			</view>			
		</view>
		<view class="product-list">
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
				<text class="delivery-status">未出库</text>
				<checkbox checked="true"/>				
			</view>			
		</view>
	</view>
	<view class="btn">
		<button>确定</button>
	</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.wrap{
	width: 100%;	
	border-top: 8px solid #efeef3ff;
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
	font-size: 32rpx;
	color: #333;	
	margin-left: auto;
	margin-right: 15rpx;
	text-align: right;	
}
.products{
	border-top: 10px solid #efeef3ff;
}
.product-details{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx 0 20rpx;
}
.product-details .img{
	padding-right: 10px;
}
.product-details text{
	font-size: 35rpx;
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
	height: 50rpx;	
}
.grid .info{
	width: 30%;
	color: #030303ff;
	font-size: 25rpx;	
	word-break: break-all;
}
.choice{
	display: flex;
	justify-content: space-between;
}
.delivery-status{
	color: #db081bff;
	font-size: 30rpx;
	height: 50rpx;
	margin-left: 10px;
}
.choice checkbox{
	transform:scale(0.9);
	margin-right: 20rpx;
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

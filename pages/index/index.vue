<template>
	<view class="wrap">
		<view class="swiper-wrap" >
			
			<swiper class="swiper" circular autoplay="true" interval="2000" duration="500">
				<swiper-item>
					<text class="swiper-notice">公告</text>
					<text class="swiper-text">欢迎使用本ERP系统，如有定制需求请联系微信:15832922153</text>
					<image class="swiper-image" src="../../static/image/banner/banner01.png" mode="aspectFill"></image>					
				</swiper-item>
			</swiper>
		</view>		
		<view class="workbench-title">常用应用</view>
		<view>
			<view class="u-grid">
				<view class="u-grid-item" @click="navTo('/pages/cusomer/index')">
					<view class="u-grid-item-box">
						<view class="home color01">
							  <image src="../../static/image/index/query_cusomer.png"></image>
						</view>
						<view class="grid-text">意向客户</view>
					</view>
				</view>
				<view class="u-grid-item" @click="navTo('/pages/cusomer/cusomer_add')">
					<view class="u-grid-item-box">
						<view class="home color11">
							  <image src="../../static/image/index/add_cusomer.png"></image>
						</view>
						<view class="grid-text">添加客户</view>
					</view>
				</view>				
				<view class="u-grid-item">
					<view class="u-grid-item-box" @click="navTo('/pages/order/order_add')">
						<view class="home color02">
							 <image src="../../static/image/index/sales_order.png"></image>
						</view>
						<view class="grid-text">销售订单</view>
					</view>
				</view>
				<view class="u-grid-item"  @click="navTo('/pages/priceList/index')">
					<view class="u-grid-item-box">
						<view class="home color03">
							 <image src="../../static/image/index/price_list.png"></image>
						</view>
						<view class="grid-text">价格表</view>
					</view>
				</view>
				<view class="u-grid-item"   @click="navTo('/pages/productAnalysis/index')">
					<view class="u-grid-item-box">
						<view class="home color04">
							 <image src="../../static/image/index/product_analysis.png"></image>
						</view>
						<view class="grid-text">产品分析</view>
					</view>
				</view>
				<view class="u-grid-item" @click="navTo('/pages/salesKanban/index')">
					<view class="u-grid-item-box">
						<view class="home color05">
							 <image src="../../static/image/index/sales_kanban.png"></image>
						</view>
						<view class="grid-text">销售看板</view>
					</view>
				</view>				
				<view class="u-grid-item">
					<view class="u-grid-item-box">
						<view class="home color07">
							 <image src="../../static/image/index/warehousing.png"></image>
						</view>
						<view class="grid-text">销售入库</view>
					</view>
				</view>
				<view class="u-grid-item" @click="navTo('/pages/salesShipment/index')">
					<view class="u-grid-item-box">
						<view class="home color07">
							 <image src="../../static/image/index/receipt_doc.png"></image>
						</view>
						<view class="grid-text">销售出货</view>
					</view>
				</view>		
			</view>
			<view class="workbench-title">日常办公</view>
			<view class="u-grid">
				<view class="u-grid-item"  @click="navTo('/pages/product/product_query')">
					<view class="u-grid-item-box">
						<view class="home color06">
							 <image src="../../static/image/index/product_query.png"></image>
						</view>
						<view class="grid-text">产品查询</view>
					</view>
				</view>
				<view class="u-grid-item"  @click="navTo('/pages/product/product_add')">
					<view class="u-grid-item-box">
						<view class="home color10">
							 <image src="../../static/image/index/product_add.png"></image>
						</view>
						<view class="grid-text">添加产品</view>
					</view>
				</view>
				<view class="u-grid-item" @click="navTo('/pages/receipt/index')">
					<view class="u-grid-item-box">
						<view class="home color08">
							  <image src="../../static/image/index/receipt.png"></image>
						</view>
						<view class="grid-text">销售收款</view>
					</view>
				</view>
				<!-- <view class="u-grid-item">
					<view class="u-grid-item-box">
						<view class="home color09">
							  <image src="../../static/image/index/payment_order.png"></image>
						</view>
						<view class="grid-text">付款单</view>
					</view>
				</view> -->
				<view class="u-grid-item" @click="navTo('/pages/profitLoss/index')">
					<view class="u-grid-item-box">
						<view class="home color10">
							  <image src="../../static/image/index/profit_and_loss.png"></image>
						</view>
						<view class="grid-text">盈亏表</view>
					</view>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	}
</script>

<style>
	.swiper-wrap {
		position: relative;
		overflow: hidden;
		transform: translateY(0);
		padding: 0 10px;
	}
	.swiper {
		height: 270rpx;
		background-color: #f3f4f6;
	}
	.swiper-notice{
		position: absolute;
		top: 30rpx;
		left: 45%;		
		z-index: 999;
		font-size: 22px;
		color: #eaf2ffff;
		font-family: cursive
	}
	.swiper-text{
		position: absolute;
		top: 100rpx;
		left: 5%;
		right: 5%;
		z-index: 999;
		font-size: 20px;
		line-height: 1.2;
		color: #eaf2ffff;
		font-family: cursive
	}
	.swiper-image {
		width: 100%;
		will-change: transform;
		height: 100%;		
		display: block;		
		pointer-events: none;
		border-radius: 12rpx;
	}
	
	
	
.workbench-title{
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	padding: 15px 30rpx;
}
.u-grid {
	width: 100%;	
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	align-items: center;	
}

.u-grid-item {
	width: 25%;
	box-sizing: border-box;
	background: #fff;	
	align-items: center;
	justify-content: center;
	position: relative;
	flex-direction: column;
	position: relative;
	float: left;
}

.u-grid-item-box {
	padding: 30rpx 0;	
	align-items: center;
	justify-content: center;
	flex-direction: column;
	display: flex;
	width: 100%;
	height: 100%;
	
}


.home {
 	width: 48px;
 	height: 48px;
	align-items: center;
 	border-radius: 6px;
 	box-sizing: border-box;
	display: flex;
	justify-content: center;
	color:#ffffff;
	font-size: 26px;
 }
 .home image{
	 width: 50px;
	 height: 46px
 }
 .grid-text {
 	font-size: 24rpx;
 	padding: 15rpx;
 	color: #202328;
 }
 .color01{
 	 background: #17c295ff;
 	 border:1rpx solid #17c295ff;
 }
 .color02{
 	 background: #00a7e2ff;
 	 border:1rpx solid #00a7e2ff;
 }
 .color03{
 	 background: #f86f5cff;
 	 border:1rpx solid #f86f5cff;
 }
 .color04{
 	 background: #00a7e2ff;
 	 border:1rpx solid #00a7e2ff;
 }
 .color05{
 	 background: #17c295ff;
 	 border:1rpx solid #17c295ff;
 }
 .color06{
 	 background: #00a7e2ff;
 	 border:1rpx solid #00a7e2ff;
 }
 .color07{
 	 background: #f4b75eff;
 	 border:1rpx solid #f4b75eff;
 }
 .color08{
 	 background: #00a7e2ff;
 	 border:1rpx solid #00a7e2ff;
 }
 .color09{
 	 background: #f4b75eff;
 	 border:1rpx solid #f4b75eff;
 }
 .color10{
 	 background: #17c295ff;
 	 border:1rpx solid #17c295ff;
 }
 .color11{
 	 background: #00a7e2ff;
 	 border:1rpx solid #00a7e2ff;
 }

</style>

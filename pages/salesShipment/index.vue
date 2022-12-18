<template>
<view class="wrap">
	<view class="completion-status">
		<view  v-for="(item,index) in completionStatusList" 
			class="normal-class" :class="{'active-class': nowIndex == index}" 
			@click="changeCompletionStatus(index)">{{item}}
		</view>
	</view>
	<navigator url="/pages/salesShipment/shipping_details?id=123">
		<view class="content">
			<view>订单编号:&nbsp;201907221820</view>
			<view>提交时间:&nbsp;2019-07-22 18:21:12</view>
			<view class="personal-name">
				<view>提交人姓名:&nbsp;南滨</view>
				<view class="customer-name">客户姓名:&nbsp;张三</view>
			</view>
		</view>
	</navigator>
	<navigator url="/pages/salesShipment/shipping_details?id=123">
		<view class="content">
			<view>订单编号:201907221820</view>
			<view>提交时间:2019-07-22 18:21:12</view>
			<view class="personal-name">
				<view>提交人姓名:南滨</view>
				<view class="customer-name">客户姓名:张三</view>
			</view>
		</view>
	</navigator>
</view>

</template>

<script>
	export default {
		data() {
			return {
				nowIndex: 0,
				completionStatusList:['新单据','未完成','已完成']
			}
		},
		methods: {
			changeCompletionStatus(index){
				this.nowIndex = index
			}
		}
	}
</script>

<style>
.wrap{
	position: relative;
	border-top: 20rpx solid #EFEEF4;
	width: 100%;
	height: 100%;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.completion-status{
	display: flex;
	justify-content: space-around;
	padding: 15rpx 20rpx 0 20rpx;	
}
.completion-status view{
	width: 190rpx;
	height: 75rpx;
	text-align: center;
	line-height: 75rpx;	
	border-radius: 10rpx;
	font-size: 30rpx;
}
.normal-class{
	background: #F1F1F1;
	color: rgb(0, 0, 0);
}
.active-class{
	background: rgb(219, 246, 237);
	color: rgb(46, 178, 138);
}
.content{
	padding: 20rpx 0 20rpx 60rpx;
	font-size: 32rpx;
	line-height: 50rpx;
	border-bottom: #F0F0F0 2px solid;
}
.personal-name{
	display: flex;
}
.customer-name{
	margin-left: 35rpx;
}
</style>

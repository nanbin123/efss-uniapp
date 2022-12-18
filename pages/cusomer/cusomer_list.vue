<template>
	<view class="wrap">
		<navigator url="/pages/cusomer/cusomer_detail?id=123">
			<view class="container">
				<view class="item user_name">
					<text>操作人:小南</text>
				</view>
				<view class="item">
					<text>订单号:2019102400001</text>
					<text>下单时间:2019-10-24</text>
				</view>
				<view class="item">
					<text>姓名:李丹</text>
					<text>性别:男</text>
					<text>电话:15832922153</text>
				</view>
				<view class="isOrder order">
					已下单
				</view>
			</view>
		</navigator>
		
		<navigator url="/pages/cusomer/cusomer_detail?id=123">
			<view class="container">
				<view class="item user_name">
					<text>操作人:小南</text>
				</view>
				<view class="item">
					<text>订单号:2019102400001</text>
					<text>下单时间:2019-10-24</text>
				</view>
				<view class="item">
					<text>姓名:李楠</text>
					<text>性别:女</text>
					<text>电话:17692677970</text>
				</view>
				<view class="isOrder unorder">
					未下单
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		onLoad(){
			//this.getDate()
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
.container{
	position: relative;
	border-bottom: 2px solid #efeef3ff;
	padding: 20rpx 20rpx 0 20rpx;
}
.item{
	display: flex;
	justify-content: space-between;	
	padding-bottom: 20rpx;
	font-size: 35rpx;
	color: #929292ff;
}
.user_name{	
	color: #0a0a0aff;
	font-weight: bold;
}
.isOrder{
	width: 60px;
	text-align: center;	
	position: absolute;
	top: 18rpx;
	right: 25rpx;
}
.order{
	border: 1px solid #c6e6ddff;
	color: #54c5a4ff;
}
.unorder{
	border: 1px solid #ebd0cbff;
	color: #e80a13ff;
}
</style>
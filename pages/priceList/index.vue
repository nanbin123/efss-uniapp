<template>
<view class="wrap">
	<view class="top_line"></view>
	<view class="search">
		<view class="search_count">
			 <input class="search_input" confirm-type="search" type="text" placeholder="搜索品名或型号"/>
			 <view class="search_img">
			 	<image src="../../static/image/search.png"></image>
			 </view>
		</view>
	</view>
	<view class="content">
		<view class="left">
			<view class="left_img">
				<image src="../../static/image/red_add.png"></image>					
			</view>
			<view class="left_text">
				<text>点击添加图片</text>
			</view>
		</view>
		<view class="right"> 
			<view class="grid">
				<text class="info" style="width: 50%;">品名：长茶几</text>
				<text class="info" style="width: 50%;">型号：7707-C</text>
			</view>
			<view class="grid">
				<text class="info" style="width: 33%;">类别：茶几</text>
				<text class="info" style="width: 33%;">颜色：胡桃色</text>
				<text class="info" style="width: 33%;">材质：楸木</text>
			</view>
			<view class="grid">
				<text class="info" style="width: 50%;">尺寸：1400*800*500</text>
				<text class="info" style="width: 50%;color: #1aa1cfff;">产地：东莞</text>
			</view>
			<view class="grid-bottom">
				<text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥1300</text></text>
			</view>	
		</view>	
	</view>
	<view class="line"></view>
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

.wrap {
}
.top_line{
	width: 100%;
	height: 10rpx;
	background-color: #efeef3ff;
}
.search{
	padding: 20rpx 50rpx 20rpx 50rpx;	
	background: #ffffff;
}
.search_count{
	background-color: #ffffff;
	border: 1px solid #f2f2f2;
	 border-radius: 100rpx;
	 height:64rpx;
	 display: flex;
	 align-items: center;
}
.search_input{
	text-align: left;
	font: sist 14px;
	color:'#606266';
	background-color: #ffffff;
	flex: 1;
	font-size: 28rpx;
	margin-left: 20rpx;
}
.search_img{
	width:35rpx ;
	height:45rpx;
	padding: 0 20rpx;
}
.search_img image{
	width:40rpx ;
	height:40rpx;
}
.content{
	border-radius: 5px;
	display: flex;	
	background-color: #fff;
}
.left{
	width: 120px;
	height: 80px;
	background-color: #f2f2f2ff;
}
.left_text{
	font-size: 5rpx;	
	padding: 2px;
	text-align: center;
	margin-top: 5px;
	color: #a3a3a1ff;
}

.left_img {
    width: 20px;
    height: 20px;
	margin: 0 auto;
	margin-top: 15px;
    border-radius: 20px;
    background-color: #f86f5cff;
}
.left_img image {
	 width: 20px;
	 height: 20px;	 
}
.right {
    margin-left: 10px;
	width: 100%;
}
.grid {
	width: 100%;
	display: flex;
	margin-bottom: 7px;
}
.grid-bottom{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 0;
}

.info {
   color: #030303ff;
   font-size: 11px; 
}
.line{
	height: 1px;
	width: 100%;
	background-color: #cbcbcbff;
	margin-top: 10px;
}

</style>

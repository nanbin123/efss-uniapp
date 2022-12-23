<template>
<view class="wrap">	
	<view class="search">
		 <input class="search_input" confirm-type="search" type="text" placeholder="搜索品名或型号"/>			 
		 <image class="search_img" src="../../static/image/search.png"></image>
	</view>
	<view class="content">
		<view class="left">
			<image class="left_img" src="../../static/image/red_add.png"></image>
			<view class="left_text">点击添加图片</view>			
		</view>
		<view class="right"> 
			<view class="grid">
				<text class="info">品名：长茶几</text>
				<text class="info">型号：7707-C</text>
			</view>
			<view class="grid">
				<text class="info" style="width: 50%;">尺寸：1400*800*500</text>
				<text class="info">产地：东莞</text>
			</view>
			<view class="grid">
				<text class="info" >类别：茶几</text>
				<text class="info" >颜色：胡桃色</text>				
			</view>
			<view class="grid">
				<text class="info">材质：楸木</text>
				<text class="info" >库存：<text style="font-size: 12px;">30</text></text>
			</view>	
			<view class="grid">
				<text class="info" >零售价：<text style="color: #d6a950ff; font-size: 12px;">￥13100</text></text>
				<text class="info" >采购价：<text style="color: #1aa1cfff; font-size: 12px;">￥70000000</text></text>				
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
	width: 100%;
	border-top: 5px solid #efeef3ff;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.top_line{
	width: 100%;
	height: 10rpx;
	background-color: #efeef3ff;
}
.search{
	margin: 20rpx 50rpx 20rpx 50rpx;
	background: #ffffff;
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
	width:40rpx ;
	height:40rpx;
}

.content{
	display: flex;
	align-items: center;
	background-color: #fff;
}
.left{
	width: 20%;
	height: 72px;
	background-color: #f2f2f2ff;	
    text-align: center;
}
.left_text{
	font-size: 10px;	
	padding: 2px;
	text-align: center;
	margin-top: 5px;
	color: #a3a3a1ff;
}
.left_img {
    width: 20px;
    height: 20px;	
	margin-top: 15px;	
}
.right{
	width: 80%;
	margin-left: 5px;
}
.grid {	
 	display: flex;	
	line-height: 14px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 12px;
   white-space: nowrap;  
}
.line{
	height: 1px;
	width: 100%;
	background-color: #cbcbcbff;
	margin-top: 10px;
}

</style>

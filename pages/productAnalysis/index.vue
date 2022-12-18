<template>
	<view style="width: 100%;border-top: 8px solid #efeef3ff;">
		<!-- 头部 -->
		<view class="screen-bar">
			<view class="screen-bar-item" @tap.stop="itemClick" >
				<view class="bar-item-text">
					{{titleText}}
				</view>
				<image src="../../static/image/product/arrow.png"></image>
			</view>
			<view class="datestartAndEnd">
				<view class="dateStart">
					<view  @tap="toggle('start_date')" :style="{color:dateStart=='开始时间'?'#a0a0a0':'#333'}">{{dateStart}}</view>
					<cPicker mode='date' @confirm="dateStartHand" ref="start_date"></cPicker>
				</view>
				<view class="dateEnd">
					<view  @tap="toggle('end_date')" :style="{color:dateEnd=='结束时间'?'#a0a0a0':'#333'}">{{dateEnd}}</view>
					<cPicker mode='date' @confirm="dateEndHand" ref="end_date"></cPicker>
				</view>				
			</view>
			<view class="dropdown-box" :style="{'opacity':show?'1':'0','display':show?'block':'none'}">				
				<view class="dropdown-item" v-for="(item,index) in itemArr" :key="index" @tap.stop="subItemClick(index)">
					{{item['text']}}
				</view>				
			</view>
		</view>
		<!-- 头部遮罩层 -->
		<view class="bg-mask" :class="[show?'bg-mask-show':'']" @tap="maskClose" @touchmove="touchControl"></view>
		<!-- 产品列表 -->
		<view class="product">
			<view class="left">			
				<image class="left-img" src="../../static/image/red_add.png"></image>
				<view class="left-text">点击添加图片</view>
			</view>
			<view class="right">
				<view>
					<text class="info">品名：长茶几</text>
					<text class="info">型号：7707-C</text>
					<text class="info">类别：茶几</text>
				</view>
				<view>
					<text class="info" >颜色：胡桃色</text>
					<text class="info" >材质：楸木</text>
					<text class="info">尺寸：1400*800*500</text>
				</view>
				<view>
					<text class="info" style="color: #1aa1cfff;">产地：东莞</text>
					<view class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥1300</text></view>
					<view class="info">销售量：<text style="color: #d6a950ff; font-size: 12px;">3</text></view>
				</view>
				<view>
					<view class="info">销售额：<text style="color: #d6a950ff; font-size: 12px;">￥3900</text></view>
				</view>	
			</view>	
		</view>
	</view>

</template>

<script>
	
import cPicker from "../../components/c-picker/c-picker.vue"
import {
	picker
} from "../../components/mixins/picker.js"

	export default {
		components: {
			cPicker
		},
		data() {
			return {
				show: false,
				titleText: '全部',
				itemArr:  [
					{
						text: '全部',
						value: 0
					},{
						text: '按销售',
						value: 1
					}, {
						text: '按数量',
						value: 2
					}
				],
				dateStart:'开始时间',
				dateEnd:'结束时间'
			}
		},
	
		methods: {
			//显示下拉框
			itemClick() {
				this.show = !this.show				
			},
			//替换标题
			subItemClick(index) {
				this.titleText =  this.itemArr[index]['text']
				this.show = false
			},			
			//关闭
			maskClose() {
				this.show = false
			},
			//关闭
			touchControl() {
				this.maskClose()
			},
			toggle(val) {//开始时间和结束时间
				this.$refs[val].show();
			},
			dateStartHand(value) {
				this.dateStart = value.result							
			},
			dateEndHand(value){
				this.dateEnd = value.result
			}
		}
	}
</script>

<style>
	.screen-bar {
		width: 100%;
		height: 60rpx;
		padding: 0 30rpx;
		background-color: #fff;		
		display: flex;
		position: relative;
		z-index: 99;
		border-bottom: 2rpx solid #efeef3ff;
		box-shadow: 0 2rpx 10rpx #efeef3ff;
	}
	.screen-bar-item {		
		height: 100%;		
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bar-item-text {
		max-width: 120rpx;
		font-size: 26rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.screen-bar-item image {
		width: 24rpx;
		height: 24rpx;
		padding-top: 2rpx;
		padding-left: 30rpx;
		display: block;
		margin-left: 12rpx;
		transition: all .3s;
		flex-shrink: 0;
	}
	.dropdown-box {		
		background-color: #fff;
		height: 210rpx;
		bottom: -210rpx;
		width: 100%;
		padding-left: 30rpx;
		position: absolute;
		left: 0;
		top: 62rpx;
		z-index: 99;
		overflow: hidden;
	}
	.dropdown-item {
		height: 70rpx;
		width: 100%;		
		font-size: 28rpx;
		color: #666;
		display: flex;
		align-items: center;
		padding: 0 15rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #111111;
		border-bottom: 1rpx solid #EEEEEE;
	}
	.bg-mask {		
		position: absolute;
		top: 8px;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 98;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.bg-mask-show {
		visibility: visible;
		opacity: 0.8;
	}
	.datestartAndEnd{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left:100rpx;
		font-size: 26rpx;
		color: #acacacff;
		padding-right: 100rpx;
		margin-top: 2rpx;
	}
	.dateEnd{
		padding-left: 100rpx;
	}
	.product{
		display: flex;
		border-bottom: 1px solid #cbcbcbff;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.product .left{
		width: 120px;
		height: 80px;
		background-color: #f2f2f2ff; 
	}
	.product .left-img {
		display: block;
	    width: 20px;
	    height: 20px;
		padding-top: 30rpx;
		margin: 0 auto;
	}
	.product .left-text{
		font-size: 5rpx;	
		text-align: center;
		margin-top: 10rpx;
		color: #a3a3a1ff;
	}
	
	.product .right {
	    margin-left: 10px;
		width: 100%;
		height: 80rpx;		
	}
	.info {
	   display: inline-block;
	   width: 33%;
	   color: #030303ff;
	   font-size: 11px;
	}

</style>

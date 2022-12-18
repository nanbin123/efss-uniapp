<template>
	<view class="wrap">
		<!-- 头部 -->
		<view class="screen-bar">
			<view class="screen-bar-item" @tap.stop="itemClick" >
				<view class="bar-item-text">
					{{titleText}}
				</view>
				<image src="../../static/image/product/arrow.png"></image>
			</view>
			<view class="dropdown-box" :style="{'opacity':show?'1':'0','display':show?'block':'none'}">
				<view class="dropdown-item" v-for="(item,index) in itemArr" :key="index" @tap.stop="subItemClick(index)">
					{{item['text']}}
				</view>				
			</view>
		</view>
		<!-- 头部遮罩层 -->
		<view class="bg-mask" :class="[show?'bg-mask-show':'']" @tap="maskClose" @touchmove="touchControl"></view>
		<view class='achievement-title'>
			<view class='title'>
				<view class="before-square"></view>
				<text>{{beforeTitle}}</text>
			</view>
			<view class="title">
				<view class="now-square"></view>
				<text>{{nowTitle}}</text>
			</view>
			<view  class="title">
				<image class="increase" src="../../static/image/salesKanban/sales_increase.png"></image>	
				<text>增&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;幅</text>
			</view>
		</view>
		<view class="achievement-list">
			<view class="user-name">张三</view>
			<view class="achievement">
				<view class='title'>
					<view class="before"></view>
					<text>100</text>
				</view>
				<view class="title">
					<view class="now"></view>
					<text>70</text>
				</view>
				<view  class="title">
					<image class="increase" src="../../static/image/salesKanban/sales_increase.png"></image>	
					<text>-30</text>
				</view>
			</view>
		</view>
		<view class="achievement-list">
			<view class="user-name">李四</view>
			<view class="achievement">
				<view class='title'>
					<view class="before"></view>
					<text>100</text>
				</view>
				<view class="title">
					<view class="now"></view>
					<text>70</text>
				</view>
				<view  class="title">
					<image class="increase" src="../../static/image/salesKanban/sales_increase.png"></image>	
					<text>-30</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				titleText: '请选择时间段',
				itemArr:  [
					{
						text: '按天查询',
						value: 1
					}, {
						text: '按周查询',
						value: 2
					}, {
						text: '按月查询',
						value: 3
					}, {
						text: '按季度查询',
						value: 4
					}, {
						text: '按年度查询',
						value: 5
					}
				],
				beforeTitle:'昨日业绩',
				nowTitle:'今日业绩'
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
				this.show = false;
				let titleValue =  this.itemArr[index]['value']
				switch(titleValue){
				    case 1:
				        this.beforeTitle = '昨日业绩';
						this.nowTitle = '今日业绩';
				        break;
				    case 2:
				        this.beforeTitle = '上周业绩';
						this.nowTitle = '本周业绩';
				        break;
					case 3:
						this.beforeTitle = '上月业绩';
						this.nowTitle = '本月业绩';
						break;
					case 4:
						this.beforeTitle = '上季度业绩';
						this.nowTitle = '本季度业绩';
						break;
					case 5:
						this.beforeTitle = '上年业绩';
						this.nowTitle = '本年业绩';
						break;
				    default:
				        break;
				}		
			},			
			//关闭
			maskClose() {
				this.show = false
			},
			//关闭
			touchControl() {
				this.maskClose()
			},
		}
	}
</script>

<style>
	.wrap{
		width: 100%;
		border-top: 8px solid #efeef3ff;
	}
	.screen-bar {
		height: 80rpx;
		padding: 0 30rpx;
		background-color: #fff;		
		display: flex;
		position: relative;
		z-index: 99;
		border-bottom: 2rpx solid #f0f0f0ff;		
	}
	.screen-bar-item {		
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.bar-item-text {		
		font-size: 30rpx;
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
		height: 349rpx;
		bottom: -210rpx;
		width: 65%;
		padding-left: 30rpx;
		position: absolute;
		left: 0;
		top: 62rpx;
		z-index: 99;
		overflow: hidden;
		border: 1px solid #DEDEDE;
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
		background: rgba(0, 0, 0, 0);
		z-index: 98;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.bg-mask-show {
		visibility: visible;
		opacity: 0.8;
	}
	.achievement-title{
		display: flex;
		justify-content: space-around;
		padding: 30rpx ;
		border-bottom: 1rpx solid #f0f0f0ff;
	}
	.title{
		display: flex;
		font-size: 30rpx;
		width: 30%;
	}
	.before-square{
		width: 45rpx;
		height: 45rpx;
		background: #17C295;
		margin-right: 20rpx;
	}
	.now-square{
		width: 45rpx;
		height: 45rpx;
		background: #00A7E2;
		margin-right: 20rpx;
	}
	.increase{
		width: 45rpx;
		height: 45rpx;
		margin-right: 20rpx;		
	}
	.achievement-list{		
		background-color: #f9f9f9ff;
		border-bottom: 1px solid #f0f0f0ff;		
		padding: 20rpx 30rpx ;
	}
	.achievement{
		display: flex;
		justify-content: space-around;
	}	
	.before{
		width: 40rpx;
		height: 40rpx;
		background: #17C295;
		margin-right: 20rpx;
	}
	.now{
		width: 40rpx;
		height: 40rpx;
		background: #00A7E2;
		margin-right: 20rpx;
	}
	.user-name{
		font-size: 30rpx;
		color: #8f8f94ff;
		margin-bottom: 15rpx;
		margin-left: 10px;		
		text-align: left;
	}
</style>

<template>
<!-- 头部 -->
<view> 
	<view class="head">			
		<view class="screen-bar">
			<view class="screen-bar-item" @tap.stop="itemClick" >
				<view class="bar-item-text">
					{{titleText}}
				</view>
				<image :src="getImgUrl('static/image/product/arrow.png')"></image>
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
				<image class="increase" :src="getImgUrl('static/image/salesKanban/sales_increase.png')"></image>	
				<text class="increase_value">增&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;幅</text>
			</view>
		</view>
	</view>
</view>
	
<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 150px);" @scrolltolower="onReachBottom">
	<view class="achievement-list"  v-for="(item,index) in salesPerformanceList" :key="index">
		<view class="user-name">{{item.nickName}}</view>
		<view class="achievement">
			<view class='title'>
				<view class="before"></view>
				<text class="before_value">{{item.beforeData}}</text>
			</view>
			<view class="title">
				<view class="now"></view>
				<text class="now_value">{{item.nowData}}</text>
			</view>
			<view  class="title">
				<image class="increase" :src="getImgUrl('static/image/salesKanban/sales_increase.png')"></image>	
				<text class="increase_value">{{increase(item)}}</text>
			</view>
		</view>
	</view>
</scroll-view>

</template>

<script>
import {get,post} from "../../components/utils/request.js"
export default {
	data() {
		return {
			pageNum: 1, // 当前页
			status: 'more',
			contentText: {
				contentdown: '上拉加载更多~',				
				contentrefresh: '正在加载更多~',				
				contentnomore: '我是有底线的~'
			},
			iconType: 'auto',    // 图标样式 
			show: false,
			titleText: '请选择时间段',
			itemArr:  [
				{
					text: '按天查询',
					value: 'day'
				}, {
					text: '按周查询',
					value: 'week'
				}, {
					text: '按月查询',
					value: 'month'
				}, {
					text: '按季度查询',
					value: 'quarter'
				}, {
					text: '按年度查询',
					value: 'year'
				}
			],
			beforeTitle:'昨日业绩',
			nowTitle:'今日业绩',
			salesPerformanceList:[]
		}
	},
	methods: {
		//选择时间段
		itemClick() {
			this.show = !this.show
		},
		//替换标题
		subItemClick(index) {
			this.titleText =  this.itemArr[index]['text']
			this.show = false;
			this.titleValue =  this.itemArr[index]['value']
			switch(this.titleValue){
				case 'day':
					this.beforeTitle = '昨日业绩';
					this.nowTitle = '今日业绩';
					this.getList();
					break;
				case 'week':
					this.beforeTitle = '上周业绩';
					this.nowTitle = '本周业绩';
					this.getList();
					break;
				case 'month':
					this.beforeTitle = '上月业绩';
					this.nowTitle = '本月业绩';
					this.getList();
					break;
				case 'quarter':
					this.beforeTitle = '上季度业绩';
					this.nowTitle = '本季度业绩';
					this.getList();
					break;
				case 'year':
					this.beforeTitle = '上年业绩';
					this.nowTitle = '本年业绩';
					this.getList();
					break;
				default:
					break;
			}		
		},			
		//关闭选择时间段下拉框
		maskClose() {
			this.show = false
		},
		//关闭选择时间段下拉框
		touchControl() {
			this.maskClose()
		},
		getList(){				
			post("statistics/selectListSalesPerformance",{"pageNum":this.pageNum,"queryScope":this.titleValue}).then(res =>{
				this.totalCount = res.total
				 if(this.totalCount >=0){
					this.salesPerformanceList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.salesPerformanceList.length){					 
					 this.status = "noMore"
				 }
			}) 
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	computed:{
		increase(){
			return function(item){
				return item.nowData - item.beforeData;
			};
		}
	},
	onReachBottom() {
		if(this.totalCount > this.salesPerformanceList.length){				
			this.pageNum++;				
			post("statistics/selectListSalesPerformance",{"pageNum":this.pageNum,"queryScope":this.titleValue}).then(res =>{
				this.salesPerformanceList = this.salesPerformanceList.concat(res.rows)
				uni.hideLoading();
			})
		}else if(this.totalCount == this.salesPerformanceList.length){ 
			 this.status = "noMore"				
		}
	},
	onLoad(){
		post("statistics/selectListSalesPerformance",{"pageNum":this.pageNum,"queryScope":"day"}).then(res =>{
			this.totalCount = res.total
			 if(this.totalCount >=0){
				this.salesPerformanceList = res.rows
				uni.hideLoading();
			 }
			 if(this.totalCount == this.salesPerformanceList.length){					 
				 this.status = "noMore"
			 }
		}) 
	}
}
</script>

<style>
	.head{		
		border-top: 5px solid #efeef3ff; 
		height: 100px;
	}
	.screen-bar {
		height: 46px;
		padding: 0 25px;				
		display: flex;
		position: relative;
		z-index: 99;
		border-bottom: 1px solid #f0f0f0ff;		
	}
	.screen-bar-item {		
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.bar-item-text {		
		font-size: 20px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.screen-bar-item image {
		width: 20px;
		height: 20px;
		padding-top: 2px;
		/* padding-left: 30px; */
		display: block;
		/* margin-left: 12px; */
		transition: all 0.3s;
		flex-shrink: 0;
	}
	.dropdown-box {
		background-color: #fff;
		height: 350px;
		width: 40%;
		padding-left: 15px;
		position: absolute;
		left: 0;
		top: 62px;
		z-index: 99;
		overflow: hidden;
		border: 1px solid #DEDEDE;
	}
	.dropdown-item {
		height: 70px;
		width: 100%;
		color: #666;
		display: flex;
		align-items: center;
		padding: 0 10px;
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
		height: 50px;
		align-items: center;
		justify-content: space-around;		
		border-bottom: 1px solid #f0f0f0ff;
	}
	.title{
		display: flex;
		font-size: 18px;
		width: 30%;
	}
	.before-square{
		width: 30px;
		height: 30px;
		background: #17C295;
		margin-right: 5px;
	}
	.now-square{
		width: 30px;
		height: 30px;
		background: #00A7E2;
		margin-right: 5px;
	}
	.increase{
		width: 30px;
		height: 30px;		
		margin-right: 5px;
	}
	.increase_value{
		line-height: 33px;
	}
	.achievement-list{		
		background-color: #f9f9f9ff;
		border-bottom: 1px solid #f0f0f0ff;		
	}
	.achievement{
		display: flex;
		justify-content: space-around;
		margin-bottom: 5px;
	}	
	.before{
		width: 30px;
		height: 30px;
		background: #17C295;
		margin-right: 5px;
	}
	.before_value{
		line-height: 30px;		
	}
	.now{
		width: 30px;
		height: 30px;
		background: #00A7E2;
		margin-right: 5px;
	}
	.now_value{
		line-height: 30px;
	}
	.user-name{
		font-size: 15px;
		color: #8f8f94ff;
		margin-bottom: 5px;
		margin-left: 10px;		
		text-align: left;
	}
</style>

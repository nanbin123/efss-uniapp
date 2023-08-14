<template>
<!-- 头部 -->
<view class="head">
	<view class="screen-bar">
		<view class="screen-bar-item" @tap.stop="itemClick" >
			<view class="bar-item-text">
				{{titleText}}
			</view>
			<image src="../../static/image/product/arrow.png"></image>
		</view>
		<view class="datestartAndEnd">
			<view class="dateStart">				
				<view  @tap="toggle('start_date')">					
					<text  v-if='dateStart  == ""' style="color: #a0a0a0;">开始时间</text>
					<text  v-else style="color: #333;">{{dateStart}}</text>					
				</view>
				<cPicker mode='date' @confirm="dateStartHand" ref="start_date"></cPicker>
			</view>
			<view class="dateEnd">				
				<view  @tap="toggle('end_date')">
					<text  v-if='dateEnd  == ""' style="color: #a0a0a0;">结束时间</text>
					<text  v-else style="color: #333;">{{dateEnd}}</text>					
				</view>
				<cPicker mode='date' @confirm="dateEndHand" ref="end_date"></cPicker>
			</view>
		</view>
		<view class="dropdown-box" :style="{'opacity':show?'1':'0','display':show?'block':'none'}">				
			<view class="dropdown-item" v-for="(item,index) in itemArr" :key="index" @tap.stop="subItemClick(index)">
				{{item['text']}}
			</view>				
		</view>
	</view>
</view>
<!-- 头部遮罩层 -->
<view class="bg-mask" :class="[show?'bg-mask-show':'']" @tap="maskClose" @touchmove="touchControl"></view>
<!-- 产品列表 -->
<view class="product"  v-for="(item,index) in productAnalysisList"  :key="index">
	<view class="left">			
		<image class="left-img" src="../../static/image/red_add.png"></image>
		<view class="left-text">点击添加图片</view>
	</view>
	<view class="right">
		<view>
			<text class="info">品名：{{item.productName}}</text>
			<text class="info">型号：{{item.type}}</text>
			<text class="info">尺寸：1400*800*500</text>
		</view>
		<view>
			<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
			<text class="info">类别：{{item.productType}}</text>
			<text class="info" >颜色：{{item.color}}</text>
		</view>
		<view>
			<text class="info" >材质：{{item.texture}}</text>					
			<view class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></view>					
			<view class="info">销售量：<text style="color: #d6a950ff; font-size: 12px;">{{item.salesQuantity}}</text></view>
		</view>
		<view>
			<view class="info">销售额：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.salesAmount}}</text></view>
		</view>
	</view>	
</view>
</template>

<script>
import {get,post} from "../../components/utils/request.js"	
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
				productAnalysisList:[],
				show: false,
				titleText: '全部',
				titleValue: '',//排序默认全部
				itemArr:  [
					{
						text: '全部',
						value: ''
					},{
						text: '按销额',
						value: 'salesAmount'
					}, {
						text: '按销量',
						value: 'salesQuantity'
					}
				],
				dateStart:'',
				dateEnd:'',
				pageNum: 1, // 分页当前页
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多~',				
					contentrefresh: '正在加载更多~',				
					contentnomore: '我是有底线的~'
				},
				iconType: 'auto'    // 图标样式 
			}
		},
	
		methods: {
			//显示下拉框
			itemClick() {
				this.show = !this.show				
			},
			//替换标题
			subItemClick(index) {
				this.titleText =  this.itemArr[index]['text'];
				this.titleValue = this.itemArr[index]['value'];
				this.show = false;
				this.getProductAnalysisList();
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
				this.dateStart = value.result;
				this.getProductAnalysisList();
			},
			dateEndHand(value){
				this.dateEnd = value.result;
				this.getProductAnalysisList();
			},
			getProductAnalysisList(){
				post("statistics/selectListProductAnalysis",{
					"pageNum":this.pageNum,"startTime":this.dateStart,"endTime":this.dateEnd,"sort":this.titleValue}).then(res =>{
					 this.totalCount = res.total
					 if(this.totalCount >=0){
						this.productAnalysisList = res.rows
						uni.hideLoading();
					 }
					 if(this.totalCount == this.productAnalysisList.length){					 
						 this.status = "noMore"
					 }
				})
			}
		},
		onReachBottom() {
			if (this.totalCount > this.productAnalysisList.length) {
				this.pageNum++;
				post("statistics/selectListProductAnalysis", {"pageNum":this.pageNum,"startTime":this.dateStart,"endTime":this.dateEnd,"sort":this.titleValue}).then(res => {
					this.productAnalysisList = this.productAnalysisList.concat(res.rows)					
					uni.hideLoading();
				})
			} else if (this.totalCount == this.productAnalysisList.length) {
				this.status = "noMore"
			}
		},
		onLoad(){			
			post("statistics/selectListProductAnalysis",{
				"pageNum":this.pageNum,"startTime":this.dateStart,"endTime":this.dateEnd,"sort":this.titleValue}).then(res =>{
				 this.totalCount = res.total
				 if(this.totalCount >0){
					this.productAnalysisList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.productAnalysisList.length){					 
					 this.status = "noMore"
				 } 
			})
		}
	}
</script>

<style>
	.head{
		height: 52px;
	}
	.screen-bar {
		position: fixed;
		border-top: 8px solid #efeef3ff;
		width: 100%;
		height: 50px;
		padding: 0 20px;
		background-color: #fff;		
		display: flex;
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

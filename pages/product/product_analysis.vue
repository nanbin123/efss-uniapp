<template>
	<z-paging ref="paging" v-model="productAnalysisList" @query="queryList">
		<template #top>
			<view class="head">
				<view class="screen-bar">
					<view class="screen-bar-item" @tap.stop="itemClick" >
						<view class="bar-item-text">
							{{titleText}}
						</view>
						<image :src="getImgUrl('static/image/product/arrow.png')"></image>
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
		</template>
		<!-- 头部遮罩层 -->
		<view class="bg-mask" :class="[show?'bg-mask-show':'']" @tap="maskClose" @touchmove="touchControl"></view>
		<!-- 产品列表 -->
		<view class="product"  v-for="(item,index) in productAnalysisList"  :key="index">
			<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
			<view class="product-content">
				<view  class="grid">
					<text class="info">品名：{{item.productName}}</text>
					<text class="info">型号：{{item.type}}</text>					
				</view>
				<view class="grid">
					<text class="info">尺寸：1400*800*500</text>
					<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>					
				</view>
				<view class="grid">
					<text class="info" >材质：{{item.texture}}</text>
					<text class="info" >颜色：{{item.color}}</text>
					<view class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></view>
					
				</view>
				<view class="grid">
					<text class="info">时间：{{item.orderCreateTime}}</text>
					<view class="info">销售量：<text style="color: #d6a950ff; font-size: 12px;">{{item.salesQuantity}}</text></view>
					<view class="info">销售额：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.salesAmount}}</text></view>
				</view>
			</view>	
		</view>
		
	</z-paging>

</template>

<script>
import {get,post} from "../../components/utils/request.js"	
import cPicker from "../../components/c-picker/c-picker.vue"

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
				dateEnd:''
			}
		},
	
		methods: {
			refreshOrderList(pageNo){
				post("statistics/selectListProductAnalysis",{"pageNum":pageNo,"startTime":this.dateStart,"endTime":this.dateEnd,"sort":this.titleValue}).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				this.refreshOrderList(pageNo);
			},
			//显示下拉框
			itemClick() {
				this.show = !this.show				
			},
			//按销量或者按销售额度
			subItemClick(index) {
				this.titleText =  this.itemArr[index]['text'];
				this.titleValue = this.itemArr[index]['value'];
				this.show = false;
				this.$refs.paging.reload();
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
			// 开始时间
			dateStartHand(value) {
				this.dateStart = value.result;
				this.$refs.paging.reload();
			},
			// 结束时间
			dateEndHand(value){
				this.dateEnd = value.result;
				this.$refs.paging.reload();
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		}
	}
</script>

<style scoped>
	.head{
		border-top: 5px solid #efeef3ff;
		height: 50px;
	}
	.screen-bar {
		width: 100%;
		height: 40px;
		padding: 0 10px;
		background-color: #fff;		
		display: flex;
		z-index: 99;
		border-bottom: 1px solid #efeef3ff;
		box-shadow: 0 1px 10rpx #efeef3ff;
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
		width: 100%;
		padding-left: 30rpx;
		position: absolute;
		left: 0;
		top: 50px;
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
		top: 0;
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
		position: relative;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-bottom: 1px solid #cbcbcbff;
		padding-bottom: 5px;
		margin-bottom: 5px;
	}
	.product .img{
		width: 70px;
		height: 75px;	
	}
	.product .product-content {
	   flex: 1;
	   margin-left: 2px;	
	}
	.grid {
	 	display: flex;
	 	line-height: 20px;
	}
	.info {
	  width: 50%;
	  color: #030303ff;
	  font-size: 13px;
	  color: #333;
	  white-space: nowrap;  
	  overflow: hidden; /* 超出部分隐藏 */
	  text-overflow: ellipsis; /* 显示省略号 */
	  text-rendering: optimizeLegibility;
	}
	

</style>

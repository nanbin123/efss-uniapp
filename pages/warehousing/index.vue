<template>
<view class="wrap">
	<view class="completion-status">
		<view  v-for="(item,index) in completionStatusList" 
			class="normal-class" :class="{'active-class': nowIndex == index}" 
			@click="changeCompletionStatus(index)">{{item}}
		</view>
	</view>
	<navigator v-for="(item,index) in warehousingEntryList" :url="'/pages/warehousing/warehousing_details?id='+item.id"  :id="item.id">
		<view class="content">
			<view class="item">											
				<text  class="info">入库单号:{{item.warehousingNumber}}</text>
				<text  class="info">记录日期:{{item.recordDate}}</text>							
			</view>
			<view class="item">
				<text  class="info">操&nbsp;作&nbsp;人&nbsp;:{{item.handledBy}}</text>	
				<text  class="info">供&nbsp;应&nbsp;商&nbsp;:{{item.supplier}}</text>							
			</view>
			<view>
				<text  class="info">货&nbsp;品:&nbsp;{{item.productNames}}</text>
			</view>
		</view>
	</navigator>
	
</view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				nowIndex: 0,
				completionStatusList:['新单据','未完成','已完成'],
				warehousingEntryList:[],
				pageNum: 1, // 当前页				
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
			changeCompletionStatus(index){
				this.nowIndex = index
			}
		},
		onLoad() {
			post("warehousing/selectListWarehousingEntry").then(res =>{	
				this.totalCount = res.total
				 if(this.totalCount >0){
					this.warehousingEntryList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.warehousingEntryList.length){					 
					 this.status = "noMore"
				 }
			})
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
	font-size: 15px;
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
	padding: 10px;
	padding-bottom: 0;
	border-bottom: #F0F0F0 2px solid;
}
.item{
	display: flex;
	line-height: 15px;
	padding-bottom: 10px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 15px;
   white-space: nowrap;  
}
</style>

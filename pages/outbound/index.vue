<template>
<view class="wrap">
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<view class="completion-status">
		<view  v-for="(item,index) in completionStatusList" 
			class="normal-class" :class="{'active-class': nowIndex == index}" 
			@click="changeCompletionStatus(index)">{{item}}
		</view>
	</view>
	<view>
	<navigator v-for="(item,index) in outboundList" :url="'/pages/outbound/outbound_details?id='+item.id">
		<view class="content">
			<view>订&nbsp单&nbsp号&nbsp:&nbsp;{{item.orderNumber}}</view>
			<view>记录日期:&nbsp;{{item.recordDate}}</view>
			<view class="personal-name">
				<view>操&nbsp作&nbsp人&nbsp:&nbsp;{{item.handledBy}}</view>
				<view class="customer-name">客户姓名:&nbsp;{{item.customerName}}</view>
			</view>
		</view>		
	</navigator>
	<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="outboundList.length > 0"/>
	</view>
</view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				nowIndex: 0,
				completionStatusList:['新单据','未完成','已完成'],
				outboundList:[],
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
		onReachBottom() {
			if(this.totalCount > this.outboundList.length){
				this.pageNum++;				
				post("outbound/selectOutbound",{"pageNum":this.pageNum}).then(res =>{					
					 this.outboundList = this.outboundList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.outboundList.length){ 
				 this.status = "noMore"				
			}
		},
		onLoad() {
			post("outbound/selectOutbound").then(res =>{
				this.totalCount = res.total;				
				this.outboundList = res.rows;
				uni.hideLoading();				
				 if(this.totalCount == this.warehousingEntryList.length){					 
					 this.status = "noMore";
				 }
			})
		}
	}
</script>

<style>
.wrap{
	position: relative;	
	width: 100%;
	height: 100%;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.completion-status{
	display: flex;
	justify-content: space-around;
	padding: 10px 10px 0 10px;	
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
	padding: 10px 0 10px 30px;
	font-size: 15px;
	line-height: 25px;
	border-bottom: #F0F0F0 2px solid;
}
.personal-name{
	display: flex;
}
.customer-name{
	margin-left: 7px;
}
</style>

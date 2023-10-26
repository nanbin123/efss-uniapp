<template>	
	<view class="wrap">
		<view style="height: 5px;">
			<view class="head"></view>
		</view>
		<navigator v-for="(item,index) in receiptList" :url="'/pages/receipt/receipt_detail?id='+item.id"  :id="item.id">
			<view class="container">	
				<view class="item">
					<text  class="info">订单编号:{{item.orderNumber}}</text>
					<text  class="info">客户姓名:{{item.customerName}}</text>
				</view>
				<view class="item ">					
					<text  class="info">订单总金额:{{item.totalAmount}}</text>
					<text  class="info">折&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;扣:{{discount(item)}}</text>
				</view>				
				<view class="item ">
					<text  class="info">订单实收金额：{{item.actualmoney}}</text>
					<text  class="info">已&nbsp;收&nbsp;款:{{item.received}}</text>
				</view>
				<view class="item ">
					<text  class="info">待&nbsp;收&nbsp;款：{{item.tobeReceived}}</text>
					<text  class="info">收款金额:{{item.amountCollected}}</text>
				</view>
			</view>			
		</navigator>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="receiptList.length > 0"/>
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				receiptList:[],
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
			discount(item){//折扣计算
				if(item.totalAmount == 0  || typeof item.totalAmount == 'undefined'){
					return ''
				}
				if(item.actualmoney == 0 || typeof item.actualmoney == 'undefined'){
					return ''
				}
				let discount = item.actualmoney/item.totalAmount*100;				
				return discount == 0 ? '':discount*100;
			}
		},
		onReachBottom() {
			if(this.totalCount > this.receiptList.length){
				this.pageNum++;				
				post("receipt/selectReceipt",{"pageNum":this.pageNum}).then(res =>{					
					 this.receiptList = this.receiptList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.receiptList.length){ 
				 this.status = "noMore"				
			}
		},
		onLoad(){
			post("receipt/selectReceipt",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				this.receiptList = res.rows
				uni.hideLoading();				
				if(this.totalCount == this.receiptList.length){				
					 this.status = "noMore"
				 }
			}) 
		}
	}


</script>

<style>


.wrap{
	width: 100%;
	height: 100%;
}
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.container{
	position: relative;
	border-bottom: 2px solid #efeef3ff;
	padding: 10px 10px 0 10px;
}
.grid {	
 	
}
.item{
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 12px;
   white-space: nowrap;  
}
</style>
<template>	

<!-- 		<view style="height: 5px;">
			<view class="head"></view>
		</view> -->
		
	<view class="head">
		<view class="search">
			 <view class="same_search">
				<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索订单号或客户姓名"/>
			</view>
			<navigator  class="more_search" url="">
				<i class="iconfont">&#xe69b;</i>
			</navigator>
		</view>
	</view>
	<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 135px);" @scrolltolower="onReachBottom">	
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
	</scroll-view>
	<view class="footer">
		<navigator url="/pages/receipt/receipt_add">
			新增收款单
		</navigator>
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
			getImgUrl(image){
			   return this.BASEURL+image;
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
/* @import "../../style/icon/iconfont.css"; */
.head{
	height: 60px;
}
.head .search{
	border-top: 5px solid #efeef3ff; 
	position: fixed; 
	width: 100%;
	height: 45px;
	padding: 5px 0;	
	z-index: 999;
	background-color: #ffffff;	
	display: flex;
}
.head .same_search{	
	width:100%;
}
 .search_input{	
	height: 45px;	
	background-repeat: no-repeat;
	background-position: 98%;	
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;	
	color:'#606266';	
	padding-left: 20px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 20px; 
}
.more_search{
	height: 40px;
	width: 40px;
	margin-top: 3px; 
	border-radius: 5px;
	text-align: center;
	line-height: 40px;
	background-color: #00b6aaff;
	margin-left: 8px; 
	margin-right: 10px;
	
}
.iconfont{
	color: #ffffff;	
	font-size: 18px;
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

.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
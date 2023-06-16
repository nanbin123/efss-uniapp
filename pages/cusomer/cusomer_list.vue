<template>
	<view class="wrap">		
		<view class="head"></view>		
		<navigator v-for="(item,index) in customerList" :url="'/pages/cusomer/cusomer_detail?id='+item.id"  :id="item.id">
			<view class="container">
				<view class="item user_name">					
					<text>操作人:{{item.createBy}}</text>
				</view>
				<view class="item">
					<text>订单号:2019102400001</text>
					<text>下单时间:2019-10-24</text>
				</view>
				<view class="item">
					<text>姓名:{{item.customerName}}</text>
					<text>性别:{{item.sex}}</text>
					<text>电话:{{item.phone}}</text>
				</view>
				<view class="isOrder order">
					已下单
				</view>
			</view>			
		</navigator>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="customerList.length > 0"/>
<!-- 		<navigator url="/pages/cusomer/cusomer_detail?id=123">
			<view class="container">
				<view class="item user_name">
					<text>操作人:小南</text>
				</view>
				<view class="item">
					<text>订单号:2019102400001</text>
					<text>下单时间:2019-10-24</text>
				</view>
				<view class="item">
					<text>姓名:李楠</text>
					<text>性别:女</text>
					<text>电话:17692677970</text>
				</view>
				<view class="isOrder unorder">
					未下单
				</view>
			</view>
		</navigator> -->
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				customerList:[],
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
		
		onLoad(){
 			post("customer/selectIntendedCustomers",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				 if(this.totalCount >0){
					this.customerList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.customerList.length){					 
					 this.status = "noMore"
				 }
			}) 
		},
		methods: {

		},
		onReachBottom() {
			if(this.totalCount > this.customerList.length){
				this.pageNum++;				
				post("customer/selectIntendedCustomers",{"pageNum":this.pageNum}).then(res =>{					
					 this.customerList = this.customerList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.customerList.length){ 
				 this.status = "noMore"				
			}
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
	padding: 20rpx 20rpx 0 20rpx;
}
.item{
	display: flex;
	justify-content: space-between;	
	padding-bottom: 20rpx;
	font-size: 35rpx;
	color: #929292ff;
}
.user_name{	
	color: #0a0a0aff;
	font-weight: bold;
}
.isOrder{
	width: 60px;
	text-align: center;	
	position: absolute;
	top: 18rpx;
	right: 25rpx;
}
.order{
	border: 1px solid #c6e6ddff;
	color: #54c5a4ff;
}
.unorder{
	border: 1px solid #ebd0cbff;
	color: #e80a13ff;
}
</style>
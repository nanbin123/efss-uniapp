<template>
	<view class="head">
		<view class="search">
			 <view class="same_search">
				<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索客户姓名或手机号"/>
			</view>
			<navigator  class="more_search" url="">
				<i class="iconfont">&#xe69b;</i>
			</navigator>
		</view>
	</view>
	<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 135px);" @scrolltolower="onReachBottom">
		<navigator v-for="(item,index) in customerList" :url="'/pages/customer/customer_detail?id='+item.id"  :id="item.id">
			<view class="container">
				<view v-if="item.isOrder == 'ordered'" class="item">	
					<text  class="info">订单号:{{item.orderNumber}}</text>
					<text  class="info">下单时间:{{item.orderTime}}</text>
				</view>
				<view class="item">
					<text  class="info" >操作人:{{item.operator}}</text>
					<text  class="info" >客户姓名:{{item.customerName}}</text>					
				</view>
				<view class="item">					
					<text  class="info" >客户性别:{{item.sex}}</text>
					<text  class="info" >客户电话:{{item.phone}}</text>
				</view>
				<view class="item">
					<text  class="info">客户地址:{{item.address}}</text>	
					<view class="grade" style="display: flex;">
						<text>意向程度:</text>
						<image class="star" :src="item.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
						<image class="star" :src="item.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
						<image class="star" :src="item.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
					</view> 
				</view>			
				<text  v-if="item.isOrder == 'no_order'" class="isOrder unorder">未下单</text>
				<text  v-if="item.isOrder == 'ordered'"  class="isOrder order">已下单</text>
			</view>			
		</navigator>	
	</scroll-view>
	
	<view class="footer">
		<navigator url="/pages/customer/customer_add">
			添加客户
		</navigator>
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
				iconType: 'auto',// 图标样式 
				fullStarUrl:'static/image/cusomer/star.png',
				nullStarUrl:'static/image/cusomer/empty.png',	
			}
		},
		
		onShow(){
 			post("customer/selectIntendedCustomers",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				 if(this.totalCount >0){
					this.customerList = res.rows;
				 }
			})
		},
		methods: {
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			onReachBottom() {				
				if(this.totalCount > this.customerList.length){
					this.pageNum++;				
					post("customer/selectIntendedCustomers",{"pageNum":this.pageNum}).then(res =>{					
						 this.customerList = this.customerList.concat(res.rows)						
					})
				}else if(this.totalCount == this.customerList.length){ 
					 uni.showToast({
					    title: '没有更多意向客户了',
					    duration: 3000,
					    icon: 'none'
					 });						
				}
			}
		}

	}


</script>

<style>
@import "../../static/icon/iconfont.css";

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
.item{
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
}
.info {
    width: 50%;
    color: #030303ff;
    font-size: 14px; 
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}
.isOrder{
	width: 50px;
	height: 20px;
	line-height: 20px;
	font-size: 13px;
	text-align: center;	
	position: absolute;
	bottom: 7px;
	right: 6px;
}
.order{
	border: 1px solid #c6e6ddff;
	border-radius: 2px;
	color: #54c5a4ff;
}
.unorder{
	border: 1px solid #ebd0cbff;
	color: #e80a13ff;
}
.grade{
	display: flex;
	width: 50%;
	color: #030303ff;
	font-size: 13px;
}
.star{
	width: 13px;
	height: 13px;
	margin: 0 10px;
}
.footer{
	height: 30px;
	font-size: 16px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
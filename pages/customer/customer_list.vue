<template>
	<view class="head">
		<view class="search">
			 <view class="same_search">
				<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索客户姓名或手机号"/>
			</view>
			<view  class="more_search" @click="moreSearch()">
				<view class="iconfont">&#xe69b;</view>
			</view>
		</view>
	</view>
	<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 90px);" @scrolltolower="onReachBottom">
		<navigator v-for="(item,index) in customerList" :url="'/pages/customer/customer_detail?id='+item.id"  :id="item.id">
			<view class="container">
				<view v-if="item.isOrder == 'ordered'" class="item">	
					<text  class="info">订单号:{{item.orderNumber}}</text>
					<text  class="info">下单时间:{{item.orderTime}}</text>
				</view>
				<view class="item">
					<text  class="info" >客户姓名:{{item.customerName}}</text>
					<text  class="info" >客户电话:{{item.phone}}</text>
				</view>
				<view class="item">					
					<text  class="info" >客户性别:{{item.sex}}</text>
					<text  class="info">客户地址:{{item.address}}</text>	
				</view>
				<view class="item">
					<text  class="info">报价:{{item.quotation}}</text>	
					<view class="grade" style="display: flex;">
						<text>意向程度:</text>
						<image class="star" :src="item.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
						<image class="star" :src="item.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
						<image class="star" :src="item.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
					</view> 
				</view>	
				<view class="item">
					<text  class="info" >记录时间:{{item.createTime}}</text>
					<text  class="info" >操作人:{{item.operator}}</text>
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
	import useCustomerStore from '@/store/modules/customer.js'
	export default {
		data() {
			return {
				customerList:[],
				fullStarUrl:'static/image/cusomer/star.png',
				nullStarUrl:'static/image/cusomer/empty.png',
				searchVal:"",
				pageNum:1,
				searchCustomer:{}
			}
		},
		setup() {
			const customerStore = useCustomerStore();
			return { customerStore} 
		 },
		methods: {
			onReachBottom() {
				if(this.totalCount > this.customerList.length){
					this.searchCustomer.pageNum = this.pageNum++;;
					post("customer/selectIntendedCustomers",this.searchCustomer).then(res =>{					
						 this.customerList = this.customerList.concat(res.rows)						
					})
				}else if(this.totalCount == this.customerList.length){ 
					 uni.showToast({
					    title: '没有更多意向客户了',
					    duration: 3000,
					    icon: 'none'
					 });						
				}
			},
			moreSearch(){
				uni.navigateTo({
					url:'/pages/customer/customer_query'
				})
			},
			getCustomerList(){//高级查询
				let customer = this.customerStore.data.moreSearchCustomer;
				this.searchCustomer = customer;
				this.searchCustomer.pageNum = this.pageNum;				
				post("customer/selectIntendedCustomers",this.searchCustomer).then(res =>{
					this.totalCount = res.total;					 
					this.customerList = res.rows;
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(val){
				this.searchCustomer.pageNum = this.pageNum;	
				this.searchCustomer.customerNameOrPhone = val;
				post("customer/selectIntendedCustomers",this.searchCustome).then(res =>{
					this.totalCount = res.total;					 
					this.customerList = res.rows;
				})
			}
		},
		onLoad(){
			post("customer/selectIntendedCustomers",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total;
				this.customerList = res.rows;
			})
		}
	}


</script>

<style>
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
.head .search .same_search{	
	flex: 1;
}
 .search_input{	
	height: 41px;	
	background-repeat: no-repeat;
	background-position: 98%;	
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;
	padding-left: 20px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 10px; 
}
 .head .search .more_search{
	height: 39px;
	width: 39px;
	margin-top: 2px; 
	border-radius: 3px;
	text-align: center;
	line-height: 39px;
	background-color: #00b6aaff;
	margin-left: 5px; 
	margin-right: 7px;
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
	border-radius: 2px;
	font-size: 13px;
	text-align: center;	
	position: absolute;
	bottom: 6px;
	right: 6px;
	padding: 0 2px;
}
.order{
	border: 1px solid #c6e6ddff;
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
	margin: 0 7px;
}
.footer{
	height: 30px;
	font-size: 16px;
	text-align: center;
	line-height: 30px;
	background-color: #38c1b9;
	color: #ffffff;	
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
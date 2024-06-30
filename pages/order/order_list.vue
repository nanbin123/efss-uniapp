<template>
<view class="head">
	<view class="search">
		 <view class="same_search">
			<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索客户姓名或手机号"/>
		</view>
		<navigator class="more_search" url="/pages/order/order_query">
			<i class="iconfont">&#xe69b;</i>
		</navigator>
	</view>
</view>
		
<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 90px);" @scrolltolower="onReachBottom">
	<navigator v-for="(item,index) in orderList" :url="'/pages/order/order_deatil?id='+item.id"  :id="item.id">
		<view class="container">
			<view class="item">
				<text  class="info">订单号:{{item.orderNumber}}</text>
				<text  class="info">客户姓名:{{item.customerName}}</text>
			</view>
			<view class="item">					
				<text  class="info">客户性别:{{sexConvert(item.sex)}}</text>	
				<text  class="info">客户电话:{{item.phone}}</text>
			</view>
			<view class="item ">					
				<text  class="info">客户地址:{{item.address}}</text>
				<text  class="info">送货时间:{{item.deliveryTime}}</text>
			</view>
			<view class="item ">
				<text  class="info">货品:{{item.productNames}}</text>
				<text  class="info">实收金额:{{item.actualmoney}}</text>
			</view>
			<view class="item ">
				<text  class="info">下单时间：{{item.createTime}}</text>
				<text  class="info">操作人:{{item.updateBy}}</text>
			</view>
		</view>			
	</navigator>
</scroll-view>

<view class="footer">
	<navigator url="/pages/order/order_add">
		新增订单
	</navigator>
</view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				orderList:[],
				pageNum: 1,				
				searchVal:''
			}
		},
		methods: {
			sexConvert(sex){
				if('1'==sex){
					return '男'
				}else{
					return '女'
				}
			},
			onReachBottom() {
				if(this.totalCount > this.orderList.length){
					this.pageNum++;				
					post("order/selectOrder",{"pageNum":this.pageNum}).then(res =>{							
						 this.orderList = this.orderList.concat(res.rows)					
					})
				}else if(this.totalCount == this.orderList.length){ 
					 uni.showToast({
					    title: '没有更多销售订单了',
					    duration: 3000,
					    icon: 'none'
					 });			
				}
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onShow() {
			post("order/selectOrder",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				this.orderList = res.rows
				uni.hideLoading();
			}) 
		}
	}


</script>

<style>

.head{
	height: 60px;
}

.head .search{
	width: 100%;
	border-top: 5px solid #efeef3ff; 
	position: fixed; 
	height: 45px;
	padding: 5px 0;	
	z-index: 999;
	background-color: #ffffff;	
	display: flex;
}
.head .search .same_search{	
	flex: 1;
}
 .head .search .same_search .search_input{	
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
	background-color: #00a7e2ff;
	margin-left: 5px; 
	margin-right: 7px;
	
}
.iconfont{
	color: #ffffff;	
	font-size: 18px;
}


.container{	
	border-bottom: 2px solid #efeef3ff;
	padding: 10px 10px 0 10px;
}
.grid {	
 	
}
.item{
	display: flex;
	line-height: 13px;
	padding-bottom: 10px;
}
.info {
    width: 50%;
    color: #030303ff;
    font-size: 13px; 
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}

.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #ffffff;
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
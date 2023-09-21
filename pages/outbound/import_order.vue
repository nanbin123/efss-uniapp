<template>
	
	<view class="wrap">
		<view style="height: 5px;">
			<view class="head"></view>
		</view>
		<view v-for="(item,index) in orderList" :id="item.id"  >
			<view class="container" @click="chooseOrder(item.id)">
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
		</view>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="orderList.length > 0"/>
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				orderList:[],
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
			sexConvert(sex){
				if('1'==sex){
					return '男'
				}else{
					return '女'
				}
			},
			chooseOrder(id){
				let pages = getCurrentPages();
				if(pages.length >1){
					let prevPage = pages[pages.length -2];
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							prevPage.getList(id);
						}
					})
				}
			}
		},
		onReachBottom() {
			if(this.totalCount > this.orderList.length){
				this.pageNum++;				
				post("order/selectOrder",{"pageNum":this.pageNum}).then(res =>{					
					 this.orderList = this.orderList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.orderList.length){ 
				 this.status = "noMore"				
			}
		},
		onLoad(){
			post("order/selectOrder",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				 if(this.totalCount >0){
					this.orderList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.orderList.length){					 
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
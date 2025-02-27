<template>
	<z-paging ref="paging" v-model="orderList" @query="queryList">		
		<template #top>
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
		</template>
		
		<view class="container" v-for="(item,index) in orderList" @click="chooseOrder(item.id)">
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
		
	</z-paging>	
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				orderList:[],
				searchVal:'',
				searchImportOrder:{}
			}
		},
		methods: {
			refreshImportOrderList(){
				post("receipt/selectOrderList",this.searchImportOrder).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				this.searchImportOrder.pageNum = pageNo;
				this.refreshImportOrderList();
			},
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
							pages[pages.length -2].$vm.getOrderById(id);
						}
					})
				}
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(newVal, oldVal) {
				if (newVal != null){
					this.searchImportOrder = {"customerNameOrPhone":newVal};
					this.$refs.paging.reload();
				}
			}
		}
	}
</script>

<style scoped>
.head{
	height: 60px;
}
.head .search{
	width: 100%;
	border-top: 5px solid #efeef3ff;	
	height: 45px;
	padding: 5px 0;	
	background-color: #ffffff;	
	display: flex;
}
.head .search  .same_search{	
	flex: 1;
}
.head .search .same_search .search_input{	
	height: 41px;	
	background-repeat: no-repeat;
	background-position: 98%;	
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;	
	color:'#606266';	
	padding-left: 10px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 5px; 
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
   font-size: 13px;
   white-space: nowrap; /* 文字不换行 */
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 以省略号形式显示 */
}
</style>
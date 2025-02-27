<template>	
	<z-paging ref="paging" v-model="receiptList" @query="queryList">
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
	
		<navigator v-for="(item,index) in receiptList" :url="'/pages/receipt/receipt_detail?id='+item.id"  :id="item.id">
			<view class="container">	
				<view class="item">
					<text  class="info">订单编号:{{item.orderNumber}}</text>
					<text  class="info">客户姓名:{{item.customerName}}</text>
				</view>
				<view class="item">
					<text class="info">客户电话:{{item.customerPhone}}</text>
					<text class="info">客户地址:{{item.customerAddress}}</text>
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
		<template #bottom>
			<view class="footer">
				<navigator url="/pages/receipt/receipt_add">
					新增收款单
				</navigator>
			</view>
		</template>
	</z-paging>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				receiptList:[],
				searchVal:'',
				searchReceipt:{}
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
			refreshOutboundList(){
				post("receipt/selectReceipt",this.searchReceipt).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {	
				this.searchReceipt.pageNum = pageNo;
				this.refreshOutboundList();
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(newVal, oldVal) {
				if (newVal != null){
					this.searchReceipt = {"customerNameOrPhone":newVal};
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
	padding: 10px 5px 0 5px;
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
   white-space: nowrap;  
}

.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;
	width: 100%;
}
</style>
<template>
	<z-paging ref="paging" v-model="orderList" @query="queryList">
		<template #top>
			<view class="head">
				<view class="search">
					 <view class="same_search">
						<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"  
							v-model="searchVal" type="text" placeholder="搜索客户姓名或手机号"/>
					</view>
					<view class="more_search" @click="moreSearch()">
						<i class="iconfont">&#xe69b;</i>
					</view>
				</view>
			</view>
		</template>

		<navigator v-for="(item,index) in orderList" :url="'/pages/order/order_deatil?id='+item.id" :id="item.id">
			<view class="container">
				<view class="item">
					<text  class="info">订单号:{{item.orderNumber}}</text>
					<text  class="info">客户姓名:{{item.customerName}}</text>
				</view>
				<view class="item">
					<text  class="info">客户电话:{{item.customerPhone}}</text>
					<text  class="info">客户地址:{{item.customerAddress}}</text>
				</view>
				<view class="item">
					<text  class="info">客户性别:{{sexConvert(item.sex)}}</text>				
					<text  class="info">送货时间:{{item.deliveryTime}}</text>
				</view>
				<view class="item">
					<text  class="info">货品:{{item.productNames}}</text>
					<text  class="info">实收金额:{{item.actualmoney}}</text>
				</view>
				<view class="item">
					<text  class="info">下单时间：{{item.createTime}}</text>
					<text  class="info">操作人:{{item.operator}}</text>
				</view>
			</view>			
		</navigator>
		
		<template #bottom>
			<view class="footer">
				<navigator url="/pages/order/order_add">
					新增订单
				</navigator>
			</view>
		</template>
		
	</z-paging>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"	
	// import useOrderStore from '@/store/modules/order.js'
	import useMoreSearchStore from '@/store/modules/moreSearch.js'

	export default {
		data() {
			return {
				orderList:[],
				pageNum: 1,
				searchVal:'',
				searchOrder:{}
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return { moreSearchStore }
		},
		methods: {
			refreshOrderList(){
				post("order/selectOrder",this.searchOrder).then(res =>{	
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				this.searchOrder.pageNum = pageNo;
				this.searchOrder.customerNameOrPhone = this.searchVal;
				this.refreshOrderList(this.searchOrder);
			},
			moreSearch(){
				uni.navigateTo({
					url:'/pages/order/order_query'
				})
			},
			getOrderList(){//高级查询
				let order = this.moreSearchStore.moreSearch;
				this.searchOrder = order;
				this.$refs.paging.reload();
			},
			sexConvert(sex){
				if('1'==sex){
					return '男'
				}else{
					return '女'
				}
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(val){
				this.$refs.paging.reload()
			}
		},
		onLoad() {
			// this.searchOrder.pageNum = this.pageNum;
			// this.orderQueryList()
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
	padding: 10px 5px 0 5px;
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
	color: #fff;
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
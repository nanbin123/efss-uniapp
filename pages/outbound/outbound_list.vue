<template>
	<z-paging ref="paging" v-model="outboundList" @query="queryList">
		<template #top>
			<view class="head">
				<view class="status-search">	
					<view class="completion-status">
						<view  v-for="(item,index) in completionStatusList" 
							class="normal-class" :class="{'active-class': completionStatus == item}" 
							@click="changeCompletionStatus(item)">{{item}}
						</view>
					</view>
					<view class="search">
						 <view class="same_search">
							<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"
							v-model="searchVal" confirm-type="search" type="text" placeholder="搜索客户姓名或手机号"/>
						</view>
						<view  class="more_search" @click="moreSearch()">
							<i class="iconfont">&#xe69b;</i>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		<navigator v-for="(item,index) in outboundList" :url="'/pages/outbound/outbound_details?id='+item.id">
			<view class="content">
				<view class="item">
					<view class="info">客户姓名:&nbsp;{{item.customerName}}</view>
					<view class="info">客户电话:&nbsp;{{item.phone}}</view>
				</view>
				<view class="item">
					<view class="info">记录日期:&nbsp;{{item.recordDate}}</view>
					<view class="info">操&nbsp作&nbsp人&nbsp:&nbsp;{{item.handledBy}}</view>					
				</view>
				<view class="item">订&nbsp单&nbsp号&nbsp:&nbsp;{{item.orderNumber}}</view>			</view>		
		</navigator>
		
		<template #bottom>
			<view class="outbound_footer">
				<navigator url="/pages/outbound/outbound_add">
					新增出库
				</navigator>
			</view>
		</template>
	</z-paging>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'
	export default {
		data() {
			return {
				completionStatus: '新单据',
				completionStatusList:['新单据','未完成','已完成'],
				outboundList:[],
				searchOutbound:{},
				searchVal:''
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return {
				moreSearchStore
			}
		 },
		methods: {
			changeCompletionStatus(completionStatus){
				this.completionStatus = completionStatus;
				this.$refs.paging.reload();
			},
			refreshOutboundList(){
				post("outbound/selectOutbound",this.searchOutbound).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				let outbound = this.moreSearchStore.moreSearch;				
				this.searchOutbound =  outbound;
				this.searchOutbound.pageNum = pageNo;
				this.searchOutbound.customerNameOrPhone = this.searchVal;
				this.searchOutbound.completionStatus= this.completionStatus;
				this.refreshOutboundList();
			},
			getOutbountList(){//高级查询
				this.$refs.paging.reload();
			},
			moreSearch(){
				uni.navigateTo({
					url:'/pages/outbound/outbound_query'
				})
			},
			getImgUrl(image) {
				return this.BASEURL + image;
			}
		},
		watch:{
			searchVal(newVal, oldVal) {
				if (newVal != null){
					this.searchOutbound = {"customerNameOrPhone":newVal};
					this.$refs.paging.reload();
				}
			}
		},
		onLoad() {
		}
	}
</script>

<style scoped>
.head{
	height: 90px;/* 88 +2 留出2px 的空间 */
}
.head .status-search{
	border-top: 5px solid #efeef3ff;
	height: 33px; /* 30+3+45+2+3 */	
	width: 100%;
}
.head .completion-status{
	display: flex;
	justify-content: space-around;
	padding-top: 3px;
}
.head .completion-status view{
	width: 80px;
	height: 32px;
	text-align: center;
	line-height: 32px;	
	border-radius: 3px;
	font-size: 13px;
}

.head .search{	
	display: flex;
	width: 100%;
	height: 47px;/* 45+2 */
	padding-top: 3px;
	z-index: 999;
	background-color: #ffffff;	
}
.head .search .same_search {
	flex: 1;
}
.head .search .same_search .search_input {
	height: 40px;
	background-repeat: no-repeat;
	background-position: 98%;
	border: 1px solid #f2f2f2;
	border-radius: 7px;
	text-align: left;
	padding-left: 10px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 5px;
}

.more_search{
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

.normal-class{
	background: #F1F1F1;
	color: rgb(0, 0, 0);
}
.active-class{
	background: rgb(219, 246, 237);
	color: rgb(46, 178, 138);
}
.content{
	border-bottom: 2px solid #efeef3ff;
	padding: 10px 5px 0 7px;
}
.content .item{
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
	font-size: 15px;
	color: #030303ff;
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}
.content .item .info{
    width: 50%;
}

.outbound_footer{
	height: 30px;
	font-size: 16px;
	text-align: center;
	line-height: 30px;
	background-color: #38c1b9;
	color: #ffffff;	
}
</style>

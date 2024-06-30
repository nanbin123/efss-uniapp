<template>
	
	<view class="head">
		<view class="status-search">	
			<view class="completion-status">
				<view  v-for="(item,index) in completionStatusList" 
					class="normal-class" :class="{'active-class': nowIndex == index}" 
					@click="changeCompletionStatus(index)">{{item}}
				</view>
			</view>
			<view class="search">
				 <view class="same_search">
					<input class="search_input"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索客户姓名或订单号"/>
				</view>
	
				<navigator  class="more_search" url="">
					<i class="iconfont">&#xe69b;</i>
				</navigator>
			</view>
		</view>
	</view>
	
	
	<scroll-view style="height: calc(100vh - 165px);" scroll-y><!-- 90+30 -->
		<navigator v-for="(item,index) in outboundList" :url="'/pages/outbound/outbound_details?id='+item.id">
			<view class="content">
				<view>订&nbsp单&nbsp号&nbsp:&nbsp;{{item.orderNumber}}</view>
				<view>记录日期:&nbsp;{{item.recordDate}}</view>
				<view class="personal-name">
					<view>操&nbsp作&nbsp人&nbsp:&nbsp;{{item.handledBy}}</view>
					<view class="customer-name">客户姓名:&nbsp;{{item.customerName}}</view>
				</view>
			</view>		
		</navigator>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="outboundList.length > 0"/>
	</scroll-view>


	<view class="footer">
		<navigator url="/pages/outbound/outbound_add">
			新增出库
		</navigator>
	</view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				nowIndex: 0,
				completionStatusList:['新单据','未完成','已完成'],
				outboundList:[],
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
			changeCompletionStatus(index){
				this.nowIndex = index
			}
		},
		onReachBottom() {
			if(this.totalCount > this.outboundList.length){
				this.pageNum++;				
				post("outbound/selectOutbound",{"pageNum":this.pageNum}).then(res =>{					
					 this.outboundList = this.outboundList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.outboundList.length){ 
				 this.status = "noMore"				
			}
		},
		onLoad() {
			post("outbound/selectOutbound").then(res =>{
				this.totalCount = res.total;				
				this.outboundList = res.rows;
				uni.hideLoading();				
				 if(this.totalCount == this.warehousingEntryList.length){					 
					 this.status = "noMore";
				 }
			})
		}
	}
</script>

<style>
/* 	@import "../../style/icon/iconfont.css"; */


.head{
	height: 90px;/* 88 +2 留出2px 的空间 */
}
.head .status-search{
	border-top: 5px solid #efeef3ff;
	height: 33px; /* 30+3+45+2+3 */
	position: fixed; 
	width: 100%;
}
.head .completion-status{
	display: flex;
	justify-content: space-around;
	padding-top: 3px;
}
.head .completion-status view{
	width: 80px;
	height: 30px;
	text-align: center;
	line-height: 30px;	
	border-radius: 5px;
	font-size: 15px;
}

.head .search{	
	display: flex;
	width: 100%;
	height: 47px;/* 45+2 */
	padding-top: 3px;
	z-index: 999;
	background-color: #ffffff;	
	
}
.head .same_search{
	width:100%;
}
 .search_input{	
	height: 45px;
	background-image:url("../../static/image/search.png");
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

.normal-class{
	background: #F1F1F1;
	color: rgb(0, 0, 0);
}
.active-class{
	background: rgb(219, 246, 237);
	color: rgb(46, 178, 138);
}
.content{
	padding: 10px 0 10px 30px;
	font-size: 15px;
	line-height: 25px;
	border-bottom: #F0F0F0 2px solid;
}
.personal-name{
	display: flex;
}
.customer-name{
	margin-left: 7px;
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

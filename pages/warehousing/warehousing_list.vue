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
					<input class="search_input"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索货品"/>
				</view>

				<navigator  class="more_search" url="/pages/warehousing/warehousing_query">
					<i class="iconfont">&#xe69b;</i>
				</navigator>
			</view>
		</view>
	</view>
	<scroll-view style="height: calc(100vh - 165px);" scroll-y><!-- 90+30 -->
		<navigator v-for="(item,index) in warehousingEntryList" :url="'/pages/warehousing/warehousing_details?id='+item.id"  :id="item.id">
			<view class="content">
				<view class="item">											
					<text  class="info">入库单号:{{item.warehousingNumber}}</text>
					<text  class="info">记录日期:{{item.recordDate}}</text>							
				</view>
				<view class="item">
					<text  class="info">操&nbsp;作&nbsp;人&nbsp;:{{item.handledBy}}</text>	
					<text  class="info">供&nbsp;应&nbsp;商&nbsp;:{{item.supplier}}</text>							
				</view>
				<view>
					<text  class="info">货&nbsp;品:&nbsp;{{item.productNames}}</text>
				</view>
			</view>
		</navigator>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="warehousingEntryList.length > 0"/>	
	</scroll-view>

	<view class="footer">
		<navigator url="/pages/warehousing/warehousing_add">
			新增入库
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
				warehousingEntryList:[],
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
		onLoad() {
			post("warehousing/selectListWarehousingEntry").then(res =>{
				this.totalCount = res.total
				 if(this.totalCount >0){
					this.warehousingEntryList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.warehousingEntryList.length){					 
					 this.status = "noMore"
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
	padding: 10px;
	padding-bottom: 0;
	border-bottom: #F0F0F0 2px solid;
}
.item{
	display: flex;
	line-height: 15px;
	padding-bottom: 10px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 15px;
   white-space: nowrap;  
   -webkit-font-smoothing: antialiased;
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

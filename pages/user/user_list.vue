<template>

		<view class="head">	
			<view class="search">
				 <view class="same_search">
					<input class="search_input"  v-model="searchVal" confirm-type="搜索" type="text" placeholder="搜索姓名或账号"/>
				</view>
				<navigator  class="more_search" url="/pages/user/user_query">
					<i class="iconfont">&#xe69b;</i>
				</navigator>
			</view>
		</view>
		<scroll-view style="height: calc(100vh - 135px);" scroll-y>
			<navigator v-for="(item,index) in userList" :url="'/pages/user/user_detail?userId='+item.userId" :id="item.userId">
				<view class="container">
					<view class="item">
						<text  class="info">账号:{{item.userName}}</text>
						<text  class="info">用姓名:{{item.nickName}}</text>
					</view>
					<view class="item ">					
						<text  class="info">手机号码:{{item.phonenumber}}</text>
						<text  class="info">创建时间:{{item.createTime}}</text>
					</view>
				</view>			
			</navigator>		
			<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="userList.length > 0"/>	
		</scroll-view>
		
		<view class="footer">
			<navigator url="/pages/user/user_add">
				新增员工
			</navigator>
		</view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				userList:[],
				pageNum: 1, // 当前页				
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多~',				
					contentrefresh: '正在加载更多~',				
					contentnomore: '我是有底线的~'
				},
				iconType: 'auto',    // 图标样式 
				searchVal:''
			}
		},
		methods: {
			refreshData(){
				get("system/user/list",{"pageNum":this.pageNum}).then(res =>{
					this.totalCount = res.total
					this.userList = res.rows
					uni.hideLoading();				
					if(this.totalCount == this.userList.length){				
						 this.status = "noMore"
					 }
				}) 
			}
		},
		onReachBottom() {
			if(this.totalCount > this.userList.length){
				this.pageNum++;				
				get("system/user/list",{"pageNum":this.pageNum}).then(res =>{					
					 this.userList = this.userList.concat(res.rows)
					 uni.hideLoading();	
				})
			}else if(this.totalCount == this.userList.length){ 
				 this.status = "noMore"	
			}
		},
		onLoad(){
			
		},
		onShow(){
			 this.refreshData();
		}
	}


</script>

<style>
/* @import "../../style/icon/iconfont.css"; */
.head{
	height: 60px;
}

.head .search{
	border-top: 5px solid #efeef3ff; 
	border-bottom: 1px solid #efeef3ff;
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
	/* background-image:url("../../static/image/search.png"); */
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
	border-bottom: 1px solid #efeef3ff;
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
   font-size: 12px;
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
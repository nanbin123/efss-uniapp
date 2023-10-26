<template>	
	<view class="wrap">		
		<view class="head"></view>
		<view class="main">
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
		</view>
		<view class="footer">
			<navigator url="/pages/user/user_add">
				新增员工
			</navigator>
			
		</view>
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
				iconType: 'auto'    // 图标样式 
			}
		},
		methods: {
			getList(){
				get("system/user/list",{"pageNum":1}).then(res =>{					
					 this.userList = res.rows
					 uni.hideLoading();	
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
			get("system/user/list",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total
				this.userList = res.rows
				uni.hideLoading();				
				if(this.totalCount == this.userList.length){				
					 this.status = "noMore"
				 }
			}) 
		}
	}


</script>

<style>

.wrap{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
.head{
	height: 5px;
	background-color:  #efeef3ff;	
}
.main{	
	overflow: auto;
}
.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;
	margin-top: auto;
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
   font-size: 12px;
   white-space: nowrap;  
}
</style>
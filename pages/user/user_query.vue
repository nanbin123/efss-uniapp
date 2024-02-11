<template>
	<view class="wrap">
		<view class="head"></view>
		<view class="main">
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">账号 :</text>
				<input  v-model="user.userName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入登录账号">
			</view>
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/nick_name.png')"></image>
				<text class="title">姓名 :</text>
				<input v-model="user.nickName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
			<view class="item">
				<image class="img" style="width: 20px;height: 19px;"  :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
				<text  class="title">手机号 :</text>
				<input v-model="user.phonenumber" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入手机号">
			</view>
		</view>	
		<view class="bottom-bar">
		    <view class="clear-btn" @click="clearFilters">清空所有筛选条件</view>
		    <view class="search-btn" @click="search">查询</view>
		</view>
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"	
	export default {
		data() {
			return {				
				user:{}				
			}
		},	

		methods: {
			clearFilters(){
				this.user = {}
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
			
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
.item{	
	display: flex;
	align-items: center;
	padding: 10px;
	border-bottom: 1px solid #efeef3ff;
}
.item .img{
	width: 22px;
	height: 21px;		
}
.item .title{
	white-space: nowrap;
	padding: 0 15px;
	font-size: 15px;
	color: #333;
}

.item input{
	font-size: 16px;
	margin-left: auto;
	padding-right: 15px;
	text-align: right;
}

.item .input-placeholder{
	font-size: 16px;
	text-align: right;
	color: #aaa;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center; 
  background-color: #fff;
}

.clear-btn, .search-btn { 
  text-align: center;
  padding: 10px 0;
  border-radius: 5px; 
  width: 35%;
  margin: 0 5%;
}

.clear-btn {
  background-color: #fff;
  border: 1px solid #409eff; 
  color: #409eff; 
  
}

.search-btn {
  background-color: #409eff;
  color: #fff; 
}




</style>

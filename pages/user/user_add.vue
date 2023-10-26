<template>
	<view class="wrap">
		<view class="head"></view>
		<view class="main">
			<view class="item">
				<image class="img"  src="../../static/image/user/user_name.png"></image>
				<text class="title">账号 :</text>
				<input  v-model="user.userName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入登录账号">
			</view>
			<view class="item">
				<image class="img"  src="../../static/image/user/user_name.png"></image>
				<text class="title">密码 :</text>
				<input v-model="user.password" confirm-type="next" type="password" placeholder-class="input-placeholder" placeholder="请输入登录密码">
			</view>
			<view class="item">
				<image class="img" src="../../static/image/user/nick_name.png"></image>
				<text class="title">姓名 :</text>
				<input v-model="user.nickName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
			<view class="item">
				<image class="img" style="width: 20px;height: 19px;" src="../../static/image/order/cusomer_phone.png"></image>
				<text  class="title">手机号 :</text>
				<input v-model="user.phonenumber" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入手机号">
			</view>	
		</view>
		<view class="btn" @click="addUserForm()">
			<button>保存</button>
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
			addUserForm(){
				post("system/user",JSON.stringify(this.user),'application/json').then(res =>{
					let pages = getCurrentPages();
					if(pages.length >1){
						let prevPage = pages[pages.length -2];
						if(200 == res.code){
							uni.navigateBack({
								delta:1,
								success:(event) =>{
									prevPage.getList();									
								}
							})
						}
					}
				})
			},
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
.textarea-placeholder{
	font-size: 15px;
}
.btn{
	width: 80%;
	position: relative;
	top: 30rpx;
	margin: 0 auto;
}
.btn button{
	background-color: #00a7e2ff;
	border: 0;
	color: #daf2fbff;	
}
</style>

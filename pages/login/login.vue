<template>
	<view class="input_style">
		<view class="title">账号密码登录</view>
		<uni-easyinput class="account-number" v-model="username" :clearable="true" placeholder="请输入账号" prefix-icon="person"></uni-easyinput>
		<uni-easyinput class="pass-word" v-model="password" type="password" :clearable="true" placeholder="请输入密码" prefix-icon="locked"></uni-easyinput>
		<view class="button" @click="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:'admin',
				password:'admin123'
			}
		},
		methods: {
			login(){
				//http://localhost/dev-api/captchaImage
				if(!this.username || !this.password){
					uni.showToast({
						title:'请输入账号密码',
						icon:'none'
					});
					return;
				}
				uni.request({
					url: "http://localhost:8080/login",
					method: "POST",
					data: {
						"username":this.username,
						"password":this.password
					},
					header: {						
						'Accept': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'Content-Type': 'application/json;charset=UTF-8'
					},
					success(res) {
						if(200 ==res.data.code){								
							 uni.setStorageSync("token", res.data.token)
							 uni.redirectTo({
								url: '/pages/index/index'
							 });
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					fail(res) {
						console.log(JSON.stringify(res))
						uni.showToast({
							title: '请求超时，请重试',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style>
 .input_style{
	width: 600rpx;
	max-width: 600rpx;
	margin-left: 75rpx;
	margin-right: 75rpx;
}
.title{
	display: inline-block;
	font-size: 44rpx;
	color: #000000;
	margin-top: 50rpx;
}
.button{
	display: flex;
	align-items: center;
	justify-content: center;
	letter-spacing: 4rpx;
	border-radius: 12rpx;
	height: 80rpx;
	background-color: #007aff;
	margin-top: 40rpx;
	font-size: 30rpx;
	color: #ffffff;
}
.account-number{
	margin-top: 40rpx;
}
.pass-word{
	margin-top: 20rpx;
}
</style>

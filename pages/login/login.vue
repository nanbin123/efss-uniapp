<template>
    <view class="loginBox">
      <h3 class="welcome">欢迎登录</h3>
      <view class="inputBox">
        <view class="ipt">
          <input type="text" v-model="username" placeholder="请输入账号"/>
        </view>
        <view class="ipt">
          <input type="passsword" v-model="password" placeholder="请输入密码"/>
        </view>
        <button class="login" @click="login">登录</button>
        <view class="forgetPwd">
          <span>联系客服</span>
          <span>没有账号，去注册</span>
        </view>
      </view>
    </view>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
  export default {
    data() {
      return {
      	username:'admin',
      	password:'admin123'
      }
    },
    methods: {
		watchRouter(){
			 this.permissions =  ["*:*:*"]
			 get("getInfo").then(res =>{
				uni.hideLoading();					
				uni.setStorageSync("permissions", res.permissions)
			 })
			
		},
		login(){
			let  that = this;
			if(!this.username || !this.password){
				uni.showToast({
					title:'请输入账号密码',
					icon:'none'
				});
				return;
			}
			uni.request({
				url: this.BASEURL+"login",
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
						 that.watchRouter();
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

<style scoped>
  .loginBox{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-60%);
    width: 90%;
    border-radius: 20rpx;
    padding: 60rpx;
    box-sizing: border-box;
  }
  .welcome{
    color:rgb(66,157,250);
	text-align: center;
    font-size: 25px;
    letter-spacing: 5px;
    margin-bottom:35px;
  }
  .ipt{
    height: 86rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 40rpx;
    background-color: #f5f5f5;
    border-radius: 10rpx;
    padding-left: 10rpx;
  }
  .ipt input{
    margin-left: 15px;
    font-size: 15px;
  }
  .ipt input{
    margin-left: 20rpx;
  }
  .forgetPwd{
    margin-top: 20px;
    font-size: 15px;
    color: #b5b5b5;
    text-align: end;
    padding:0 10rpx;
    display: flex;
    justify-content: space-between;
  }
  .login{
    margin-top: 20px;
    line-height: 50px;
    text-align: center;
    background: rgb(66,157,250);
    border-radius: 20px;
    color: #fff;
    margin-top: 35px;
  }
  
  .tip{
    text-align: center;
    font-size: 28rpx;
    position: fixed;
    bottom: 50rpx;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #f4f4f4;
  }

</style>
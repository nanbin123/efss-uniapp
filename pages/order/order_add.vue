<template>
<view class="wrap">
	<view class="item cusomer_name">
		<image class="img"  style="width: 19px;height: 21px;" src="../../static/image/order/order_number.png"></image>
		<text class="title">订&nbsp单&nbsp号&nbsp:</text>
		<input v-model="orderForm.orderNumber" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/cusomer_name_add.png"></image>
		<text class="title">客户姓名:</text>
		<input v-model="orderForm.customerName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/cusomer_gender.png"></image>
		<view class="title">客户性别:</view>
		<view class="gender">
			<radio-group class="radio-group" @change="radioChange">
			  <radio class="radio1" value = '1' color="#38c1b9"  :checked="orderForm.sex === '1'">
				  <text class="radio-text" :style="{'color':orderForm.sex === '1'?'#fff':'#333'}">男</text>
			  </radio>
			  <radio class="radio2" value = '2' color="#38c1b9" :checked="orderForm.sex === '2'">
				  <text class="radio-text" :style="{'color':orderForm.sex === '2'?'#fff':'#333'}">女</text>
			  </radio>
			</radio-group>
		</view>
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/cusomer_phone.png"></image>
		<text class="title">客户电话:</text>
		<input  v-model="orderForm.phone"  confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入电话">
	</view>
	<view class="item cusomer_address">
		<image class="img" src="../../static/image/order/cusomer_address.png"></image>
		<text class="title">客户地址:</text>
		<input v-model="orderForm.address" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入地址">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/total_amount.png"></image>
		<text class="title">订单总金额:</text>
		<input disabled="disabled" v-model="productRetailPriceTotal">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/order_actual_amount.png"></image>
		<text class="title">实收金额:</text>
		<input v-model="orderForm.actualmoney" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入收款金额">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/discount.png"></image>
		<text class="title">折&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp扣&nbsp:</text>
		<input disabled="disabled"  v-model="discount">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/delivery_time.png"></image>
		<text class="title">送货时间:</text>
		<view class="deliveryTime">
			<view  @tap="toggle('delivery_time')">
				<text  v-if='typeof orderForm.deliveryTime  == "undefined"' style="color: #a0a0a0;">请选择</text>
				<text  v-else style="color: #333;">{{orderForm.deliveryTime}}</text>
			</view>
			<cPicker mode='date' @confirm="deliveryHand" ref="delivery_time"></cPicker>
		</view>
	</view>
	<view class="item choice_porduct" @click="addOrderProduct()">
		<image class="img" src="../../static/image/order/choice.png"></image>
		<text class="title">选择产品</text>
		<image class="add_product" src="../../static/image/add.png"></image>
	</view>
	<view class="product"  v-for="(item,index) in orderForm.orderProductList">
		<view class="left">
			<image class="left_img" src="../../static/image/茶几.png" mode=""></image>
		</view> 
		<view class="right">
			<view class="grid">
				<text class="info">品名：{{item.productName}}</text>
				<text class="info">型号：{{item.type}}</text>
			</view>
			<view class="grid">
				<text class="info" >尺寸：{{item.size}}</text>
				<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
			</view>
			<view class="grid">
				<text class="info">类别：{{item.productType}}</text>
				<text class="info">颜色：{{item.color}}</text>				
			</view>
			<view class="grid">
				<text class="info">材质：{{item.texture}}</text>			
				<text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
			</view>
			<view class="grid">
				<text class="info">数量：{{item.number}}</text>	
			</view>	
		</view> 
	</view>
	
	<view class="btn"  @click="addOrderForm()">
		<button>确认</button>
	</view>
	
</view>
</template>

<script>
import cPicker from "../../components/c-picker/c-picker.vue"
import {
	picker
} from "../../components/mixins/picker.js"
import {get,post} from "../../components/utils/request.js"
	
	export default {
		components: {
			cPicker
		},
		data() {
			return {
				deliveryTime:'请选择',
				//列表数据，可根据自己的业务获取
				csListArrl:[{
					
				}],
				orderForm:{}
			}
		},
		methods: {
			//送货时间弹窗
			toggle(val) {
				this.$refs[val].show();
			},	
			deliveryHand(value) {
				this.orderForm.deliveryTime = value.result							
			},
			//性别选择
			radioChange(evt){
				this.orderForm.sex = evt.detail.value;
			},
			//确认提交 订单
			addOrderForm(){
				let orderFormObj=JSON.parse(JSON.stringify(this.orderForm));
				delete orderFormObj.orderProductList				
				post("order/addUpdateOrder",orderFormObj).then(res =>{
					if(200 == res.code){
						uni.hideLoading();
						uni.showToast({
							title: '添加销售订单成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			addOrderProduct(){
				let that = this
				uni.navigateTo({
					url:'/pages/order/order_product?orderId='+that.orderForm.id
				})
			},
			getList(){
				post("order/selectOrderById",{"orderFormId":this.orderForm.id}).then(res =>{
					if(200 == res.code){
						this.orderForm.orderProductList = res.data.orderProductList
						uni.hideLoading(); 
					}
				})
			}
		},
		computed:{
			productRetailPriceTotal(){
				 let productRetailPriceTotal = 0;		  
				 if(typeof(this.orderForm.orderProductList) !="undefined"){
					for(let i= 0 ;i< this.orderForm.orderProductList.length; i++) {
						productRetailPriceTotal += parseFloat(this.orderForm.orderProductList[i].retailPrice) * parseFloat(this.orderForm.orderProductList[i].number);
					}
				 }
				 this.orderForm.totalAmount = productRetailPriceTotal
				return productRetailPriceTotal;
			},
			discount(){				
				if(this.orderForm.totalAmount == 0 || typeof this.orderForm.totalAmount == 'undefined'){
					return 0
				}
				if(this.orderForm.actualmoney == 0 || typeof this.orderForm.actualmoney == 'undefined'){
					return 0
				}
				 let discount = this.orderForm.actualmoney/this.orderForm.totalAmount;				 
				return discount*100
			}
		},
		onLoad() {
			post("order/insertAddOrderForm").then(res =>{				
				if(200 == res.code){
					this.orderForm.id = res.data.id;
					this.orderForm.orderNumber = res.data.orderNumber;
					uni.hideLoading();
				}
			})
		}
	}
</script>

<style>
.wrap{
	position: relative;
	width: 100%;
	height: 100%;
}
.item{
	display: flex;	
	padding: 20rpx 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
	
}
.item .img{
	padding-left: 10px;
	width: 20px;
	height: 20px;	
}
.item .title{
	padding: 0 20rpx;
	font-size: 35rpx;
	color: #333;
}
.item input{
	flex-grow: 1;
	padding-right: 30rpx;
	text-align: right;
}
.cusomer_name{
	border-top: 5px solid #efeef4ff;
}
.cusomer_address{
	border-bottom: 5px solid #efeef4ff;
}
.item .input-placeholder{
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.item .deliveryTime {
	flex-grow: 1;
	padding-right: 30rpx;
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.choice_porduct{
	position: relative;
	margin-bottom: 5px;
}
.add_product{
	width: 25px;
	height: 25px;
	position: absolute;
	right: 20px;
}
/* 产品列表 */
.product{
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 10rpx;
	margin-bottom: 15rpx;
}
.left{
	width: 70px;
	height: 70px;	
}
.left_img {
	width: 70px;
	height: 70px;
}
.right{
	width: 80%;
	margin-left: 5px;
}
.grid {	
 	display: flex;	
	line-height: 14px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 12px;
   color: #333;
   white-space: nowrap;  
}

/* 客户性别 */
.gender{
	margin-left: auto;
	padding-right: 15px;
}

 /deep/ .gender .radio-group svg {
	display: none  !important;
}


/deep/ .gender .uni-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
}
.gender .radio-group .radio1,.radio2{
	position: relative !important;
}
/deep/.gender .radio-group .radio1 .uni-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
 /deep/ .gender .radio-group .radio2  .uni-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
.radio-text{
	position: absolute;
	left: 20px;
	top: 2px;
	font-size: 12px;	
	line-height: 25px;	
}
/*适用于 微信小程序*/
.gender .wx-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
}
.gender .radio-group .radio1 .wx-radio-input {
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
.gender .radio-group .radio2  .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
.gender .wx-radio-input.wx-radio-input-checked::before{
 font-size:0; /* 对勾大小 */
}



.btn{
	position: relative;
	top: 100rpx;
	width: 70%;
	margin:0 auto;
}
.btn button{
	background-color: #02a5e6ff;
	border: 0;
	color: #f4f7ffff;
}
</style>

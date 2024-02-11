<template>

	<view class="head">
		<view class="line"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 90px);">
		<view class="item">
			<image class="img"  style="width: 19px;height: 20px;"  :src="getImgUrl('static/image/order/order_number.png')" ></image>
			<text class="title">订单编号:</text>
			<input v-model="orderForm.orderNumber" disabled="disabled" confirm-type="next" type="text">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_name_add.png')"></image>
			<text class="title">客户姓名:</text>
			<input v-model="orderForm.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入姓名' ">
		</view>
		<view class="item" style="padding-top: 5px; padding-bottom: 5px;">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_gender.png')"></image>
			<view class="title">客户性别:</view>			
			<view class="gender">
				<radio-group class="radio-group" @change="radioChange">
				  <radio class="radio1" color="#38c1b9"  :disabled="isEditable" :style="{
					  'background-color':orderForm.sex === '1'?'#38c1b9':'#fff'}"
				   value = '1' :checked="orderForm.sex === '1'">
					  <text class="radio-text"  :style="{'color':orderForm.sex === '1'?'#fff':'#333'}">男</text>
				  </radio>
				  <radio class="radio2"  :disabled="isEditable" color="#38c1b9" :style="{'background-color':orderForm.sex === '2'?'#38c1b9':'#fff'}" value = '2' :checked="orderForm.sex === '2'">
					  <text class="radio-text" :style="{'color':orderForm.sex === '2'?'#fff':'#333'}">女</text>
				  </radio>
				</radio-group>
			</view>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
			<text class="title">客户电话:</text>
			<input  v-model="orderForm.phone" :disabled="isEditable"  confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户电话' ">
		</view>
		<view class="item cusomer_address">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_address.png')"></image>
			<text class="title">客户地址:</text>
			<input  v-model="orderForm.address" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请客户输入地址' ">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/total_amount.png')"></image>
			<text class="title">订单总金额:</text>
			<input disabled="disabled" v-model="productRetailPriceTotal" >	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/order_actual_amount.png')" ></image>
			<text class="title">实收金额:</text>
			<input  v-model="orderForm.actualmoney" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入收款金额'">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/discount.png')"></image>
			<text class="title">折扣:</text>
			<input disabled="disabled" v-model="discount">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/delivery_time.png')"></image>
			<text class="title">送货时间:</text>
			<view class="deliveryTime">
				<view  @tap="toggle('delivery_time')">
					<text  v-if='typeof orderForm.deliveryTime  == "undefined"' style="color: #a0a0a0;">请选择</text>
					<text  v-else style="color: #333;">{{orderForm.deliveryTime}}</text>
				</view>
				<cPicker mode='date' @confirm="deliveryHand" ref="delivery_time"></cPicker>
			</view>
		</view>
		<view class="item choice_porduct"  @click="addOrderProduct()">
			<image class="img" :src="getImgUrl('static/image/order/choice.png')"></image>
			<text class="title">选择产品</text>
			<image class="add_product" :src="getImgUrl('static/image/add.png')"></image>
		</view>
		
		<view class="product"  v-for="(item,index) in orderForm.orderProductList">
			<view class="left">
				<image class="left_img" :src="getImgUrl('static/image/茶几.png')"  mode=""></image>
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
	</scroll-view>
	
	<view class="bottom-bar">
		  <text class="delete" @click="deleteOrderForm()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		  <text class="edit"  @click="editOrderForm()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>
	
</template>
<script>
import cPicker from "../../components/c-picker/c-picker.vue"
import {
	picker
} from "../../components/mixins/picker.js"
import {get,post} from "../../components/utils/request.js"
import useOrderStore from '@/store/modules/order.js' 

	export default {
		components: {
			cPicker
		},
		options: {styleIsolation: 'shared'},
		data() {
			return {				
				orderForm:{},
				condition: false ,// 根据条件设置是否显示 placeholder 内容
				isEditable: true
			
			}
		},
		methods: {
			editOrderForm(){
				if(this.isEditable == true){
					this.isEditable = false					
				}else if(this.isEditable == false){	
					let order = this.orderForm
					const orderProductList = order.orderProductList.map(item => ({
					  id: item.id					  
					}));
					order.orderProductList = orderProductList;					
					post("order/updateOrderFormById",JSON.stringify(this.orderForm),'application/json').then(res =>{
						if(200 == res.code){
							this.isEditable = true
							uni.showToast({
							  title: '修改销售订单成功',
							  icon: 'none', 
							  duration: 2000 
							});
						}
					})
				}
			},
			deleteOrderForm(){
				if(this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除该员工信息',
					  success: (res)=> {						 
					    if (res.confirm) {	
							this.removeUserByIds()
					    } else if (res.cancel) {					     
					      console.log('用户点击取消');
					    }
					  }
					});
				}else if(this.isEditable == false){
					this.isEditable = true			
				}
			},
			radioChange(evt){
				this.orderForm.sex = evt.detail.value; 
		
			},
			toggle(val) {
				if(!this.isEditable){
					this.$refs[val].show();
				}
			},			
			deliveryHand(value) {
				this.orderForm.deliveryTime = value.result
			},
			addOrderProduct(){				
				let that = this
				if(!this.isEditable){
					let arrProduct = this.orderForm.orderProductList;					
					useOrderStore().addProduct(arrProduct)		
					uni.navigateTo({
						url:'/pages/order/order_product?orderId='+that.orderForm.id
					})
				}
				

			},
			getList(){
				post("order/selectOrderById",{"orderFormId":this.orderId}).then(res =>{
					if(200 == res.code){
						this.orderForm = res.data
						uni.hideLoading(); 
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
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
				if(this.orderForm.totalAmount == 0  || typeof this.orderForm.totalAmount == 'undefined'){
					return 0
				}
				if(this.orderForm.actualmoney == 0 || typeof this.orderForm.actualmoney == 'undefined'){
					return 0
				}
				 let discount = this.orderForm.actualmoney/this.orderForm.totalAmount;				 
				return discount*100
			}
		},
		onLoad(option) {
			this.orderId = option.id
			post("order/selectOrderById",{"orderFormId":this.orderId}).then(res =>{				
				if(200 == res.code){
					this.orderForm = res.data
					uni.hideLoading(); 
				}
			})
		}	
}
</script>

<style>

.head{
	 height: 5px;
	width: 100%;
}
.line{
	position: fixed;
	z-index: 9999;
	height: 5px;
	width: 100%;
	background-color:  #efeef4ff;
}


.item{
	display: flex;	
	padding: 10px 0 5px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;	
}
.item .img{
	padding-left: 10px;	
	width: 20px;
	height: 16px;	
}
.item .title{	
	width: 100px;
	padding: 0 10px;
	font-size: 15px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
}
.item input{
	font-size: 15px;
	width: 100%;
	padding-right: 15px;
	text-align: right;
}
.item .deliveryTime {
	width: 100%;
	padding-right: 15px;
	text-align: right;
	font-size: 15px;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
}
.cusomer_address{
	border-bottom: 5px solid #efeef4ff;
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
	border-color: #38c1b9; 
}
/deep/ .gender  .uni-radio-input-disabled{
	background-color: transparent !important;
	
}
.gender .radio-group .radio1,.radio2{
	position: relative !important;
}
/* /deep/.gender .radio-group .radio1{	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
 /deep/ .gender .radio-group .radio2 .uni-radio-inputs{	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
} */
.radio-text{
	position: absolute;
	left: 20px;
	top: 2px;
	font-size: 12px;	
	line-height: 25px;	
}
/*适用于 微信小程序*/
.gender .wx-radio-input {
	/* border-radius: 0 !important; */
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
}
/* .gender .radio-group .radio1 .wx-radio-input {
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
.gender .radio-group .radio2  .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
} */
.gender .wx-radio-input.wx-radio-input-checked::before{
 font-size:0; /* 对勾大小 */
}


.bottom-bar {  
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 39px;
  background-color: #fff;
  border-top: 1px solid #cbcbcbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
   z-index: 999; /* 确保位于最顶层 */
}

.delete {
  width:50%;
  height: 100%;
  line-height: 39px;
  color: #00a7e2ff;
  margin-left: 10px;
}

.edit {
	width:50%;
	height: 100%;
	line-height: 52px;
	text-align:right;
	color: #00a7e2ff;
	margin-right: 10px;
}


</style>

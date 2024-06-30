<template>

	<view style="height: 5px;">
		<view class="head"></view>
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
			<input :focus='customerNameFocus'  @blur='customerNameFocus = false' v-model="orderForm.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入姓名' ">
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
			<input :focus='phoneFocus' @blur="checkPhone"  v-model="orderForm.phone" :disabled="isEditable"  confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户电话' ">
		</view>
		<view class="item cusomer_address">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_address.png')"></image>
			<text class="title">客户地址:</text>
			<input  :focus='addressFocus'  @blur='addressFocus = false'  v-model="orderForm.address" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请客户输入地址' ">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/total_amount.png')"></image>
			<text class="title">订单总金额:</text>
			<input disabled="disabled" v-model="productRetailPriceTotal" >	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/order_actual_amount.png')" ></image>
			<text class="title">实收金额:</text>
			<input :focus='actualmoneyFocus'  @blur='actualmoneyFocus = false'  v-model="orderForm.actualmoney" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入收款金额'">
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
		<view class="product" v-for="(item,index) in orderForm.orderProductList" :key="item.id">
			<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
			<view class="product-content">
				<view class="grid">
					<text class="info">品名：{{item.productName}}</text>
					<text class="info">型号：{{item.type}}</text>
				</view>
				<view class="grid">
					<text class="info" >尺寸：{{item.size}}</text>
					<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
				</view>
				<view class="grid">	
					<text class="info">材质：{{item.texture}}</text>		
					<text class="info">颜色：{{item.color}}</text>	
								
				</view>
				<view class="grid">
					<text class="info" style="color: #e96225ff;">数量：<text >￥{{item.number}}</text></text>	
					<text class="info" style="color: #e96225ff;">零售价：<text >￥{{item.retailPrice}}</text></text>
				</view>				
			</view>
			<view class="remove" @click="deleteProduct(item.productId)" v-show="!isEditable">
				<i class="iconfont">&#xe612;</i>
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
import {picker} from "../../components/mixins/picker.js"
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
				isEditable: true,				
				customerNameFocus:true,
				phoneFocus:false,
				addressFocus:false,
				actualmoneyFocus:false
			}
		},
		setup() {
			const orderStore = useOrderStore();	
			return { orderStore }
		 },
		methods: {
			//移除指定产品
			deleteProduct(productId){
				let orderProductList = this.orderForm.orderProductList;
				this.orderForm.orderProductList = orderProductList.filter(obj => obj.productId != productId);				
			},
			// 校验电话号码
			checkPhone() {
			  this.phoneFocus = false
			  const reg = /^(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})$/;
			  this.phoneError = !reg.test(this.orderForm.phone);		  
			  if (this.phoneError) {
				uni.showToast({
				  title: '请输入有效的电话号码',
				  icon: 'none'
				});
			  }
			},	
			editOrderForm(){
				if(this.isEditable == true){
					this.isEditable = false					
				}else if(this.isEditable == false){
					if(!this.orderForm.customerName){
						 this.$nextTick(() => {
							   this.customerNameFocus = true
						 })
						uni.showToast({
							title: '客户姓名不能为空',
							icon: 'none'
						});
						return
					}
					if(!this.orderForm.sex){
						uni.showToast({
							title: '请选择客户性别',
							icon: 'none'
						});
						return
					}			
					if(!this.orderForm.phone){
						 this.$nextTick(() => {
							   this.phoneFocus = true
						 })				
						uni.showToast({
							title: '客户电话不能为空',
							icon: 'none'
						});
						return;
					}else if (this.phoneError) {
						uni.showToast({
						  title: '请输入有效的电话号码',
						  icon: 'none'
						});
						return;
					}
					if(!this.orderForm.address){
						 this.$nextTick(() => {
							   this.addressFocus = true
						 })
						uni.showToast({
							title: '客户地址不能为空',
							icon: 'none'
						});
						return;
					}
					if(!this.orderForm.actualmoney){
						 this.$nextTick(() => {
							   this.actualmoneyFocus = true
						 })
						uni.showToast({
							title: '实收金额不能为空',
							icon: 'none'
						});
						return
					}
					
					let orderForm=JSON.parse(JSON.stringify(this.orderForm));		
					let orderProductList = orderForm.orderProductList.map(item =>{
						return {productId: item.productId,number:item.number}
					});
					orderForm.orderProductList = orderProductList;
					post("order/updateOrderFormById",JSON.stringify(orderForm),'application/json').then(res =>{
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
				let that = this
				if(this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除该员工信息',
					  success: (res)=> {						 
					    if (res.confirm) {
							post("order/deleteOrderFormById",{"id":that.orderForm.id}).then(res =>{
								if(200 == res.code){
									this.isEditable = true;
									that.orderForm ={};
									uni.showToast({
									  title: '删除销售订单成功',
									  icon: 'none', 
									  duration: 2000 
									});
								}
							})
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
				if(this.isEditable == false){
					let arrProduct = this.orderForm.orderProductList;					
					this.orderStore.addProduct(arrProduct)
					uni.navigateTo({
						url:'/pages/order/order_product'
					})
				}
			},
			getOrderProduct(){
				let orderProductList = this.orderForm.orderProductList; // 新增页面产品信息
				let products = this.orderStore.products; // 产品选择页面带过来的数据			
				for (let i = 0; i < products.length; i++) {
					let foundMatch = false;
					for (let j = 0; j < orderProductList.length; j++) {
						if (orderProductList[j].productId === products[i].productId) {
							orderProductList[j].number = products[i].number;
							foundMatch = true;
							break;
						}
					}
					if (!foundMatch) {
						orderProductList.unshift(products[i]);						
					}
				}
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
			} ,
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
			post("order/selectOrderById",{"orderFormId":option.id}).then(res =>{				
				if(200 == res.code){
					this.orderForm = res.data;
				}
			})
		}	
}
</script>

<style>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
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
	position: relative;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 5px;
}
.product .img{
	width: 80px;
	height: 80px;	
}
.product-content{
	flex: 1;
	margin-left: 5px;
}
.grid {	
 	display: flex;
 	line-height: 20px;
}
.info {
  width: 50%;
  color: #030303ff;
  font-size: 14px;
  color: #333;
  white-space: nowrap;  
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  text-rendering: optimizeLegibility;
}
.remove{
	position: absolute;
	right: 10px;
}
.remove .iconfont{
	color: #02a5e6ff;	
	font-size: 20px;
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
	border-color: #38c1b9 !important; 
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

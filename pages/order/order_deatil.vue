<template>

	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y style="height: calc(100vh - 46px);">
		<view class="item">
			<image class="img"  style="width: 19px;height: 20px;"  :src="getImgUrl('static/image/order/order_number.png')" ></image>
			<text class="title">订单编号</text>
			<input  @blur='customerNameFocus = false' v-model="orderForm.orderNumber" disabled="disabled" confirm-type="next" type="text">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_name_add.png')"></image>
			<text class="title">客户姓名</text>
			<text class="iconfont">&#xe639;</text>	
			<input :focus='customerNameFocus'  @blur='customerNameFocus = false' v-model="orderForm.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入姓名' ">
		</view>
		<view class="item" style="padding-top: 5px; padding-bottom: 5px;">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_gender.png')"></image>
			<view class="title">客户性别</view>
			<text class="iconfont">&#xe639;</text>
			<view class="gender">
				<radio-group class="radio-group" @change="radioChange">
				  <radio class="radio1" color="#00a7e2ff"  :disabled="isEditable" :style="{'background-color':orderForm.sex === '1'?'#00a7e2ff':'#fff'}" value = '1' :checked="orderForm.sex === '1'">
					  <text class="radio-text"  :style="{'color':orderForm.sex === '1'?'#fff':'#333'}">男</text>
				  </radio>
				  <radio class="radio2"  :disabled="isEditable" color="#00a7e2ff" :style="{'background-color':orderForm.sex === '2'?'#00a7e2ff':'#fff'}" value = '2' :checked="orderForm.sex === '2'">
					  <text class="radio-text" :style="{'color':orderForm.sex === '2'?'#fff':'#333'}">女</text>
				  </radio>
				</radio-group>
			</view>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
			<text class="title">客户电话</text>
			<text class="iconfont">&#xe639;</text>
			<input :focus='phoneFocus' @blur="checkPhone"  v-model="orderForm.customerPhone" :disabled="isEditable"  confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户电话' ">
		</view>
		<view class="item cusomer_address">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_address.png')"></image>
			<text class="title">客户地址</text>
			<text class="iconfont">&#xe639;</text>
			<input  :focus='addressFocus'  @blur='addressFocus = false'  v-model="orderForm.customerAddress" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请客户输入地址' ">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/total_amount.png')"></image>
			<text class="title">订单总金额</text>
			<input disabled="disabled" v-model="productRetailPriceTotal" >	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/order_actual_amount.png')" ></image>
			<text class="title">实收金额</text>
			<text class="iconfont">&#xe639;</text>
			<input :focus='actualmoneyFocus'  @blur='actualmoneyFocus = false'  v-model="orderForm.actualmoney" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入收款金额'">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/discount.png')"></image>
			<text class="title">折扣</text>
			<input disabled="disabled" v-model="discount">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/delivery_time.png')"></image>
			<text class="title">送货时间</text>
			<view @tap="toggle('delivery_time')" class="time" :style="{color:isEmpty(orderForm.deliveryTime) ?'#a0a0a0':'#333'}">{{isEmpty(orderForm.deliveryTime)? "请选择":orderForm.deliveryTime}}</view>
			<cPicker mode='date' :pageData="orderForm.deliveryTime" @confirm="deliveryHand" ref="delivery_time"></cPicker>
		</view>
		<view class="item choice_porduct"  @click="addOrderProduct()">
			<image class="img" :src="getImgUrl('static/image/order/choice.png')"></image>
			<text class="title">选择产品</text>
			<image class="add_product" :src="getImgUrl('static/image/add.png')"></image>
		</view>		
		<view class="product" v-for="(item,index) in orderForm.orderProductList" :key="item.id">
			<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
			<view class="product-content" @click="open(item)">
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
					<text class="info" style="color: #e96225ff;">数量：<text >{{item.number}}</text></text>	
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
	
	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_content">
			<view class="popup_title">{{popupProduct.productName}}</view>
			<view class="popup_item">
				<text class="popup_item_title">数量:</text>
				<view class="popup_item_text"><input v-model="popupProduct.number" type="number"/></view>
			</view>
			<view class="popup_product_foot">
				<view class="cancel" @click="cancelTrack()">取消</view>			
				<view class="determine" @click="submitTrack()">确定</view>
			</view>
		</view>
	</uni-popup>
	
</template>
<script>
import cPicker from "../../components/c-picker/c-picker.vue"
import {get,post} from "../../components/utils/request.js"
import useProductStore from '@/store/modules/product.js' 

export default {
	components: {
		cPicker
	},
	options: {styleIsolation: 'shared'},
	data() {
		return {
			orderForm:{
				orderProductList:[],
			},
			condition: false ,// 根据条件设置是否显示 placeholder 内容
			isEditable: true,				
			customerNameFocus:true,
			phoneFocus:false,
			addressFocus:false,
			actualmoneyFocus:false,			
			popupProduct:{
				productId:"",
				productName:"",
				number:""
			}
		}
	},
	setup() {
		const productStore = useProductStore();
		return { productStore }
	 },
	methods: {
		open(item){
			if(this.isEditable == false){
				this.popupProduct.productName = item.productName;
				this.popupProduct.number = item.number;
				this.popupProduct.productId = item.productId;
				this.$refs.popup.open('center');
			}
		},
		cancelTrack(){
			this.$refs.popup.close()
		},
		submitTrack(){
			let orderProductList = this.orderForm.orderProductList;
			let productId = this.popupProduct.productId;
			let orderProduct = orderProductList.filter(obj =>obj.productId == productId)[0]			
			orderProduct.number = this.popupProduct.number;
			this.$refs.popup.close()
		},
		//移除指定产品
		deleteProduct(){
			let productId = this.popupProduct.productId;
			let orderProductList = this.orderForm.orderProductList;
			let index = orderProductList.findIndex(item =>item.productId == productId)
			orderProductList.splice(index,1);
		},
		// 校验电话号码
		checkPhone() {
			if("" !=this.orderForm.customerPhone && undefined != this.orderForm.customerPhone){
				this.phoneFocus = false
				const reg = /^(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})$/;
				this.phoneError = !reg.test(this.orderForm.customerPhone);		  
				if (this.phoneError) {
					uni.showToast({
					  title: '请输入有效的电话号码',
					  icon: 'none'
					});
				}
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
				if(!this.orderForm.customerPhone){
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
				if(!this.orderForm.customerAddress){
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
				  content: '是否删除销售订单',
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
			let arrProduct = this.orderForm.orderProductList;
			this.productStore.addProduct(arrProduct);			
			if(this.isEditable == false){
				uni.navigateTo({
					url:'/pages/order/order_product'
				})
			}
		},
		getOrderProduct(){
			let products = JSON.stringify(this.productStore.products);
 			this.orderForm.orderProductList = JSON.parse(products);
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		},
		isEmpty(str){
			return typeof str === 'undefined' || '' === str;
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

<style scoped>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}

.item{
	display: flex;	
	padding: 8px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;	
}
.item .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;	
}
.item .title{
	margin-left: 2px;
	font-size: 15px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	color:red;
	font-size: 12px;
	margin-left: -5px;
}
.item input{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item .time{
	margin-left: auto;
	text-align: right;
	padding-right: 12px;
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
	width: 70px;
	height: 75px;	
}
.product-content{
	flex: 1;
	margin-left: 2px;
}
.grid {	
 	display: flex;
 	line-height: 20px;
}
.info {
  width: 50%;
  color: #030303ff;
  font-size: 13px;
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

.popup_content {
	position: relative;
	width: 260px;
	height: 120px;
	background-color: white;	
	overflow: auto;
 } 
 .popup_title {
 	 font-size: 15px;	
	 text-align: center;
	 margin: 5px; 	
 }
 .popup_item {
 	 display: flex;	
 	 margin: 10px 15px;
 }
 .popup_item_title{
 	white-space: nowrap;
 	font-size: 15px;
 	color: #070707ff;
 }
 .popup_item_text{
 	border-bottom: 1px solid #f1f1f1ff;
 	flex-grow: 1;
 	text-align: center;
 	white-space: nowrap;
 }
 .popup_item_text input{
 	font-size: 15px;
 	color: #070707ff;
 }

.popup_product_foot {
	width: 260px;
	position: absolute;
	bottom: 0;
	left: 0;
    height: 40px;
	line-height: 40px;
	color: #070707ff;
	font-size: 15px;
	display: flex;
    border-top: 1px solid #f1f1f1ff;
}
.cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
}
.determine{
	text-align: center;
	width: 50%;
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
	border-color: #00a7e2ff !important; 
}
/deep/ .gender  .uni-radio-input-disabled{
	background-color: transparent !important;
}
/deep/ .gender .radio-group .radio1,.radio2{
	position: relative !important;
}
/deep/.gender .radio-group .radio1 {
	border-top-left-radius: 8%;
	border-bottom-left-radius:8%;
}
 /deep/ .gender .radio-group .radio2{
	 border-top-right-radius: 8%;
	 border-bottom-right-radius:8% ;
 }
 /deep/.gender .radio-group .radio1 .uni-radio-input {
 	border-right: 0 !important;
 	border-top-left-radius: 8% !important;
 	border-bottom-left-radius:8% !important;
 }
  /deep/ .gender .radio-group .radio2 .uni-radio-input {	
 	border-top-right-radius: 8% !important;
 	border-bottom-right-radius:8% !important;
 }
 /deep/ .gender .uni-radio-input-disabled{
 	background-color: transparent !important;
 }
.radio-text{
	position: absolute;
	left: 20px;
	top: 2px;
	font-size: 12px;	
	line-height: 25px;	
}
/*适用于 微信小程序*/
/deep/ .gender .wx-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
	border-color: #00a7e2ff !important;
}
/deep/ .gender .radio-group .radio1 .wx-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
/deep/ .gender .radio-group .radio2 .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
/deep/ .gender .wx-radio-input-disabled{
	background-color: transparent !important;
}
/deep/ .gender .wx-radio-input.wx-radio-input-checked::before{
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
}

.delete {
  width:50%;
  height: 39px;
  line-height: 39px;
  color: #00a7e2ff;
  margin-left: 10px;
}

.edit {
	width:50%;
	height: 100%;
	line-height: 39px;
	text-align:right;
	color: #00a7e2ff;
	margin-right: 10px;
}

</style>

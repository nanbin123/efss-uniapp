<template>

	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y style="height: calc(100vh - 46px);">
		<view class="item">
			<text class="title">订单编号</text>
			<input  @blur='customerNameFocus = false' v-model="orderForm.orderNumber" disabled="disabled" confirm-type="next" type="text">
		</view>
		<view class="item">
			<text class="title">客户姓名</text>
			<text class="iconfont">&#xe639;</text>	
			<input :focus='customerNameFocus'  @blur='customerNameFocus = false' v-model="orderForm.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入姓名' ">
		</view>
		<view class="item">
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
			<text class="title">客户电话</text>
			<text class="iconfont">&#xe639;</text>
			<input :focus='phoneFocus' @blur="checkPhone"  v-model="orderForm.customerPhone" :disabled="isEditable"  confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户电话' ">
		</view>
		<view class="item cusomer_address">
			<text class="title">客户地址</text>
			<text class="iconfont">&#xe639;</text>
			<input  :focus='addressFocus'  @blur='addressFocus = false'  v-model="orderForm.customerAddress" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请客户输入地址' ">
		</view>
		<view class="item">
			<text class="title">订单总金额</text>
			<input disabled="disabled" v-model="productRetailPriceTotal" >	
		</view>
		<view class="item">
			<text class="title">实收金额</text>
			<text class="iconfont">&#xe639;</text>
			<input :focus='actualmoneyFocus'  @blur='actualmoneyFocus = false'  v-model="orderForm.actualmoney" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请输入收款金额'">
		</view>
		<view class="item">
			<text class="title">折扣</text>
			<input disabled="disabled" v-model="discount">
		</view>
		<view class="item">
			<text class="title">送货时间</text>
			<view @tap="toggle('delivery_time')" class="time" :style="{color:isEmpty(orderForm.deliveryTime) ?'#a0a0a0':'#333'}">{{isEmpty(orderForm.deliveryTime)? "请选择":orderForm.deliveryTime}}</view>
			<cPicker mode='date' :pageData="orderForm.deliveryTime" @confirm="deliveryHand" ref="delivery_time"></cPicker>
		</view>
		<view class="item choice_porduct"  @click="addOrderProduct()">
			<text class="title">选择产品</text>
			<view class="add_product" v-if="!isEditable"><text>添加</text></view>
		</view>		
	<view class="product" v-for="(item, index) in orderForm.orderProductList" :key="item.productId || index">
		<view class="product-content" @click="open(item)">
			<view class="grid">
				<view class="info">品名：{{item.productName}}</view>
				<view class="info">型号：{{item.type}}</view>
			</view>
			<view class="grid">
				 <view class="info">尺寸：{{item.size}}</view>
				 <view class="info">产地：{{item.production}}</view>
			</view>
			 <view class="grid">
			    <view class="info">材质：{{item.texture}}</view>
				<view class="info">颜色：{{item.color}}</view>
			</view>
			<view class="grid">
				<text class="info product-emphasis">数量：<text>{{item.number}}</text></text>
				<view class="info product-emphasis">零售价：<text>￥{{item.retailPrice}}</text></view>
			</view>
		</view>
		<view class="product-actions">
			<view class="product-action product-remove" @click.stop="deleteProduct(item.productId)" v-if="!isEditable">
				<text class="iconfont">&#xe612;</text>
				<text class="product-action-label">移除</text>
			</view>
			<view class="product-action product-gallery" @click.stop="previewImage(item)">
				<view class="gallery-icon">
					<view class="gallery-dot"></view>
					<view class="gallery-mountain gallery-mountain-left"></view>
					<view class="gallery-mountain gallery-mountain-right"></view>
					<text class="gallery-count" v-if="item.productImages && item.productImages.length">{{item.productImages.length}}</text>
				</view>
				<text class="product-action-label">查看</text>
			</view>
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
		// 查看产品图片，支持左右滑动预览。
		previewImage(item) {
			const images = Array.isArray(item.productImages) ? item.productImages : [];
			const urls = images.filter(img => img && typeof img.productUrl === 'string' && img.productUrl.trim())
				.map(img => {
					const url = img.productUrl.trim();
					return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
				});
			if (!urls.length) {
				uni.showToast({ title: '暂无更多图片', icon: 'none' });
				return;
			}
			uni.previewImage({ current: urls[0], urls, indicator: 'number', loop: true });
		},
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
		deleteProduct(productId){
			let orderProductList = this.orderForm.orderProductList;
			let index = orderProductList.findIndex(item => item.productId == productId);
			if (index !== -1) {
				orderProductList.splice(index, 1);
			}
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
					return {
						productId: item.productId,
						number: item.number,
						productImages: item.productImages || []
					}
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
	min-height: 44px;
	padding: 8px 12px 8px 8px;
	box-sizing: border-box;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}

.item .title{
	flex-shrink: 0;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	color:red;
	font-size: 12px;
	margin-left: -5px;
}
.item input{
	flex: 1;
	min-width: 0;
	text-align: right;
	margin-left: 12px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item .time{
	flex: 1;
	min-width: 0;
	margin-left: 12px;
	text-align: right;
	font-size: 15px;
	color: #333;
	text-rendering: optimizeLegibility;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
}
.cusomer_address{
	border-bottom: 5px solid #efeef4ff;
}
.choice_porduct{
	min-height: 40px;
	padding-bottom: 4px;
}
.add_product{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 24px;
	margin-left: auto;
	margin-right: 4px;
	flex-shrink: 0;
	box-sizing: border-box;
	background-color: #fff;
	color: #00a7e2;
	font-size: 14px;
	line-height: 20px;
}

.product{
	position: relative;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	box-sizing: border-box;
}
.product-content{
	width: 100%;
	min-width: 0;
	padding: 4px 0 4px 8px;
	box-sizing: border-box;
}
.grid {	
 	display: flex;
	align-items: center;
	min-height: 24px;
	line-height: 20px;
}
.info {
  width: 50%;
	min-width: 0;
  font-size: 14px;
  color: #333;
  white-space: nowrap;  
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  text-rendering: optimizeLegibility;
}
.product-emphasis{
	color: #e96225ff;
}

.product-actions{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	width: 64px;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 7px 4px;
	box-sizing: border-box;
}
.product-action{
	pointer-events: auto;
	width: 48px;
	min-height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #00a7e2ff;
}
.product-remove .iconfont{
	color: #00a7e2ff;
	font-size: 22px;
	line-height: 24px;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #00a7e2ff;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #00a7e2ff;
	border-radius: 3px;
	box-sizing: border-box;
}
.gallery-dot{
	position: absolute;
	top: 4px;
	left: 5px;
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background-color: #00a7e2ff;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #00a7e2ff;
	border-top: 1.5px solid #00a7e2ff;
	transform: rotate(45deg);
	box-sizing: border-box;
}
.gallery-mountain-left{
	left: 4px;
}
.gallery-mountain-right{
	right: 3px;
	width: 7px;
	height: 7px;
}
.gallery-count{
	position: absolute;
	top: -7px;
	right: -8px;
	min-width: 14px;
	height: 14px;
	padding: 0 3px;
	border-radius: 7px;
	box-sizing: border-box;
	background-color: #00a7e2ff;
	color: #fff;
	font-size: 9px;
	line-height: 14px;
	text-align: center;
}

/* 微信小程序窄屏：保持操作区可点击，同时尽量给产品信息留出宽度 */
@media screen and (max-width: 375px) {
	.product-content{
		padding-left: 6px;
	}
	.product-actions{
		width: 58px;
		padding-left: 2px;
		padding-right: 2px;
	}
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
	padding-right: 0;
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

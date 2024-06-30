<template>
<view class="head"></view>

<scroll-view scroll-y style="height: calc(100vh - 35px);">
	<view class="item">
		<image class="img" style="width: 19px;" :src="getImgUrl('static/image/cusomer/cusomer_name.png')"></image>
		<view class="title">客户姓名</view>	
		<text class="iconfont">&#xe639;</text>
		<input  :focus='customerNameFocus'  @blur='customerNameFocus = false'  v-model="customer.customerName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户姓名">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_gender.png')"></image>
		<view class="title">客户性别</view>
		<text class="iconfont">&#xe639;</text>
		<view class="gender">			
			<radio-group class="radio-group" @change="radioChange">
			  <radio class="radio1" value = '1' color="#38c1b9">
				  <text class="radio-text" :style="{'color':customer.sex === '1'?'#fff':'#333'}">男</text>
			  </radio>
			  <radio class="radio2" value = '2' color="#38c1b9">
				  <text class="radio-text" :style="{'color':customer.sex === '2'?'#fff':'#333'}">女</text>
			  </radio>
			</radio-group>
		</view>
	</view>
	<view class="item">
		<image class="img" style="margin-top: 3px;" :src="getImgUrl('static/image/cusomer/customer_phone.png')"></image>
		<view style="margin-left: 0;" class="title">客户电话</view>			
		<input  v-model="customer.phone" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>
		<view class="title">客户地址</view>
		<input  v-model="customer.address" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
	</view>
	<view class="item">
		<image class="img" style="margin-top: 3px;" :src="getImgUrl('static/image/cusomer/degree.png')"></image>
		<view class="title">意向程度</view>
		<view class="starLen">
			<image class="star" @tap='changeStar(1)' :src="customer.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			<image class="star" @tap='changeStar(2)' :src="customer.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			<image class="star" @tap='changeStar(3)' :src="customer.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
		</view>
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/quoted_price.png')" mode=""></image>
		<text class="title">报价:</text>
		<input v-model="customer.quotation" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入您向客户的报价">
	</view>
	<view class="item" @click="remarksAddOrEdit()">
		<image class="img" style="margin-top: 1px;" :src="getImgUrl('static/image/cusomer/arrive.png')" mode=""></image>
		<text class="title">备注:</text>			
		<input v-model="customer.remark" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入备注" >
	</view>			
	<view class="product-count">
		<view  class="product-total-number">货品数量:({{productNumberTotal}})</view>
		<view  class="product-retail-price">总计金额:¥{{productRetailPriceTotal}}</view>
	</view>
	<view class="product"  v-for="(item,index) in customer.customerProducts" :key="index">
		<image class="img" :src="getImgUrl('static/image/茶几.png')" mode=""></image>				
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
				<text class="info">颜色：{{item.color}}</text>
				<text class="info">材质：{{item.texture}}</text>	
			</view>
			<view class="grid">									
				<text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
				<text class="info">数量：{{item.number}}</text>	
			</view>
		</view> 
	</view>			
	<view class="add_img" @click="addCustomerProduct()">
		<image :src="getImgUrl('static/image/red_add.png')" mode=""></image>				
	</view>
</scroll-view>
		
<view class="footer">
	<view class="btn"  @click="addCustomer()">保存</view>	
</view>
	
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	import useCustomerStore from '@/store/modules/customer.js'
	export default {
		data() {
			return {
				fullStarUrl:'static/image/cusomer/star.png',
				nullStarUrl:'static/image/cusomer/empty.png',
				customer:{customerProducts:[]},//客户数据
				customerNameFocus:true
			}
		},
		setup() {
			const customerStore = useCustomerStore();				
			return { customerStore } 
		 },
		methods: {
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			//意向程度
			changeStar(val){
				this.customer.grade=val;
			},		
			addCustomer(){
				if(!this.customer.customerName){
					 this.$nextTick(() => {
					       this.customerNameFocus = true
					 })
					uni.showToast({
				        title: '客户姓名不能为空',
				        icon: 'none'
				    });
					return
				}
				if(!this.customer.sex){
					uni.showToast({
						title: '请选择客户性别',
						icon: 'none'
					});
					return
				}
			 	let customerObj=JSON.parse(JSON.stringify(this.customer));
				let productInfo = customerObj.customerProducts.map(product =>{
					return {productId:product.productId,number:product.number}
				})
				customerObj.customerProducts = productInfo;				
				post("customer/insertAddCustomer",JSON.stringify(customerObj),'application/json').then(res =>{
					if(200 == res.code){
						uni.showToast({
							title: '添加意向客户成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			getCustomerProduct(){				
				console.log("-------888------")
				let customerProducts = this.customer.customerProducts; // 新增页面产品信息	
				let products = this.customerStore.products;// 产品选择页面带过来的数据	
				for (let i = 0; i < products.length; i++) {
					let foundMatch = false;
					for (let j = 0; j < customerProducts.length; j++) {
						if (customerProducts[j].productId === products[i].productId) {
							customerProducts[j].number = products[i].number;
							foundMatch = true;
							break;
						}
					}
					if (!foundMatch) {
						customerProducts.unshift(products[i]);
					}
				}
			},
			addCustomerProduct(){
				console.log(JSON.stringify("1111"))				
				let arrProduct = this.customer.customerProducts;
				//useCustomerStore().addProduct(arrProduct);
				this.customerStore.addProduct(arrProduct);
				uni.navigateTo({
					url:'/pages/customer/customer_product'
				})
			},
			radioChange(evt){
				this.customer.sex = evt.detail.value;
			}
		},
		onLoad(option) {
			
		},
		computed:{
			productRetailPriceTotal(){
				 let productRetailPriceTotal = 0;		  
				 if(typeof(this.customer.customerProducts) !="undefined"){
					for(let i= 0 ;i< this.customer.customerProducts.length; i++) {
						productRetailPriceTotal += parseFloat(this.customer.customerProducts[i].retailPrice) * parseFloat(this.customer.customerProducts[i].number);
					}
				 }
				return productRetailPriceTotal;
			},
			productNumberTotal(){
				 let productNumberTotal = 0;		  
				 if(typeof(this.customer.customerProducts) !="undefined"){
					for(let i= 0 ;i< this.customer.customerProducts.length; i++) {
						productNumberTotal += parseFloat(this.customer.customerProducts[i].number);
					}
				 }
				return productNumberTotal;
			}
		}
	}
</script>

<style>

.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
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
	margin-left: 1px;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	color: red;	
	font-size: 12px;
	margin-left: -5px;
}
.item input{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;	
	text-rendering: optimizeLegibility;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
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
	border-color: #38c1b9 !important;
}
/deep/ .gender .radio-group .radio1,.radio2{
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
	border-color: #38c1b9 !important;
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

.starLen{
	display: flex;
	margin-left: auto;
}
.star{
	width: 17px;
	height: 17px;
	padding: 0 17px;
}


.product-count{
	display: flex;
	justify-content: space-between;
	font-size: 15px;
	padding: 10px 20px;
	border-bottom: 2px solid #efeef3ff;
	margin-bottom: 5px;
}
.product{
	display: flex;	
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 10rpx;
	margin-bottom: 15rpx;
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
.delete{
	position: absolute;
	right: 10px;
}
.delete .iconfont{
	color: #02a5e6ff;	
	font-size: 20px;
}

.add_img {
	position: relative;
    border: 1px solid #CCCCCC;    
    width: 40px;
	height: 40px;
	text-align: center;
	margin-left: auto;
	margin-right: 20px;
}
.add_img image {
    width: 35px;
    height: 35px;
	margin-top: 3px; 
}
.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #38c1b9;	
	color: #daf2fbff;
	width: 100%;
}


</style>

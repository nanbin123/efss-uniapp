<template>
<view class="head"></view>

<scroll-view scroll-y style="height: calc(100vh - 35px);">
	<view class="item">
		<view class="title">客户姓名</view>	
		<text class="iconfont">&#xe639;</text>
		<input  :focus='customerNameFocus'  @blur='customerNameFocus = false'  v-model="customer.customerName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户姓名">
	</view>
	<view class="item">
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
		<view class="title">客户电话</view>
		<input  v-model="customer.phone" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
	</view>
	<view class="item">
		<view class="title">客户地址</view>
		<input  v-model="customer.address" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
	</view>
	<view class="item">
		<view class="title">意向程度</view>
		<view class="starLen">
			<image class="star" @tap='changeStar(1)' :src="customer.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			<image class="star" @tap='changeStar(2)' :src="customer.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			<image class="star" @tap='changeStar(3)' :src="customer.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
		</view>
	</view>
	<view class="item">
		<text class="title">报价:</text>
		<input v-model="customer.quotation" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入您向客户的报价">
	</view>
	<view class="item">
		<text class="title">备注:</text>			
		<input v-model="customer.remark" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入备注" >
	</view>			
	<view class="product-count">
		<view  class="product-total-number">货品数量:({{productNumberTotal}})</view>
		<view  class="product-retail-price">总计金额:¥{{productRetailPriceTotal}}</view>
	</view>
	<view class="product" v-for="(item, index) in customer.customerProducts" :key="item.productId || index">
		<view class="product-content">
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
			<view class="product-action product-remove" @click.stop="deleteProduct(item.productId)">
				<i class="iconfont">&#xe612;</i>
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
	import useProductStore from '@/store/modules/product.js' 
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
			const productStore = useProductStore();				
			return { productStore } 
		 },
		methods: {
			previewImage(item) {
			  if (!item.productImages || item.productImages.length === 0) {
			    uni.showToast({ title: '暂无更多图片', icon: 'none' })
			    return
			  }
			  const urls = item.productImages.map(img => {
			    let url = img.productUrl
			    return this.BASEURL + (url.startsWith('/') ? url.substring(1) : url)
			  })
			    uni.previewImage({
			      current: 0,        // 从第一张开始
			      urls: urls,        // 所有图片地址
			      indicator: 'number', // 显示 1/3 数字指示器
			      loop: true         // 循环切换
			    })
			  },
			deleteProduct(productId){
				this.customer.customerProducts = this.customer.customerProducts.filter(item => item.productId != productId);
				this.productStore.addProduct(this.customer.customerProducts);
			},
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
					return {
						productId: product.productId,
						number: product.number,
						productImages: product.productImages || []
					}
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
				let products = JSON.stringify(this.productStore.products);				
				this.customer.customerProducts = JSON.parse(products);
			},
			addCustomerProduct(){
				let arrProduct = this.customer.customerProducts;
				this.productStore.addProduct(arrProduct);
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

<style scoped>

.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
}

.item{
	display: flex;	
	padding: 8px 0 8px 8px;
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
/deep/ .gender .wx-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
	border-color: #38c1b9 !important;
}
/deep/ .gender .radio-group .radio1 .wx-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
/deep/ .gender .radio-group .radio2  .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}

/deep/ .gender .wx-radio-input.wx-radio-input-checked::before{
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
	align-items: stretch;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	box-sizing: border-box;
}
.product-content{
	flex: 1;
	min-width: 0;
	padding: 8px 0 8px 8px;
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
	width: 64px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 7px 4px;
	box-sizing: border-box;
}
.product-action{
	width: 48px;
	min-height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #38c1b9;
}
.product-remove .iconfont{
	color: #38c1b9;
	font-size: 22px;
	line-height: 24px;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #38c1b9;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #38c1b9;
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
	background-color: #38c1b9;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #38c1b9;
	border-top: 1.5px solid #38c1b9;
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
	background-color: #38c1b9;
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
	.info{
		font-size: 13px;
	}
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

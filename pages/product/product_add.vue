<template>

	<view class="head"></view>

	
	<view class="item">			
		<text class="title">品名</text>
		<text class="iconfont">&#xe639;</text>	
		<input v-model="product.productName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入品名">
	</view>
	<view class="item">
		<text class="title">型号:</text>
		<input v-model="product.type" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入型号">
	</view>
	<view class="item">
		<text class="title">尺寸:</text>
		<input v-model="product.size" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入尺寸">
	</view>
	<view class="item">
		<text class="title">产地:</text>
		<input v-model="product.production" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入产地">
	</view>
	<view class="item">
		<text class="title">颜色:</text>
		<input v-model="product.color" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入颜色">
	</view>
	<view class="item product_texture">
		<text class="title">材质:</text>
		<input v-model="product.texture" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入材质">
	</view>

	<view class="item">
		<text class="title">库存:</text>
		<input v-model="product.stock" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入库存">
	</view>
	<view class="item">
		<text class="title">采购价:</text>
		<input v-model="product.purchasePrice" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入采购价">
	</view>
	<view class="item">
		<text  class="title">零售价:</text>
		<input  confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入零售价">
	</view>
	<view class="item" @click="chooseCategory()">
		<text class="title">类别:</text>
		<input v-model="product.category" 
		:style="'backgroundImage:url('+getImgUrl('static/image/common/right.png')+')'" 
		class="type" disabled="true" type="text"  placeholder-class="input-placeholder" placeholder="请选择类别">
	</view>
		
	<view style="height: 33px;background-color: #fff;">
		<button class="btn" @click="productAdd" >保存</button>
	</view>

	
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				product:{
					productName:"",
					type:"",
					size:"",
					production:"",
					productType:"",
					color:"",
					texture:"",
					stock:0,
					retailPrice:"",
					purchasePrice:"",
					category:"",
					productCategoryId:""
				}
			}
		},
		methods: {
			productAdd(){
				post("product/insertProduct",this.product).then(res =>{
					if(200 == res.code){
						uni.hideLoading();
						uni.showToast({
							title: '添加产品成功',
							icon: 'none',
							duration: 2000
						})  
					}
				})
			},
			chooseCategory(){
				uni.navigateTo({
					url: '/pages/product/category'
				});
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(){
			
		}
	}
</script>

<style>
/* @import "../../style/icon/iconfont.css"; */

.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
}

/* .product{	
	margin: 5px;
	border-radius: 5px;
	background-color: #fff;
} */
.item{
	display: flex;	
	padding: 10px 0 5px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}

.item .title{
	margin-left: 10px;
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
.product_texture{
	border-bottom: 5px solid #efeef4ff;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
}

.btn {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #02a5e6ff;
	border: 0;
	color: #f4f7ffff;
	border-radius: 0;
	font-size: 15px;	
    line-height: 33px;
}
.item .type{
	padding-right:30px;	
	background-repeat: no-repeat;
	background-position: 99%;
	 background-size: 10px 15px;
}
</style>

<template>
	<view  class="wrap">
		<view class="product">
			<view class="item">			
				<text class="title">品名:</text>
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
			<view class="item">
				<text class="title">材质:</text>
				<input v-model="product.texture" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入材质">
			</view>
		</view>
		<view class="product">
			<view class="item">
				<text class="title">库存:</text>
				<input v-model="product.stock" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入库存">
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
				<input v-model="product.category" class="type" disabled="true" confirm-type="next" type="text"  placeholder-class="input-placeholder" placeholder="请选择类别" >
			</view>
		</view>
		<view style="height: 33px;background-color: #fff;">
			<button class="btn" @click="productAdd" >保存</button>
		</view>
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
			}
		},
		onLoad(){
			
		}
	}
</script>

<style>
.wrap uni-input{
	height: 2.5em;
	line-height: 2.5em;
}
.wrap{
	position: absolute;
	width: 100%;
	background:  #efeef4ff;
}
.product{	
	margin: 5px;
	border-radius: 5px;
	background-color: #fff;
}
.item{
	display: flex;	
	padding: 20rpx 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;	
}

.item .title{
	padding: 0 20rpx;
	font-size: 35rpx;
	color: #333;
}
.item input{
	flex-grow: 1;
	padding-right: 10rpx;
	text-align: right;
}
.input-placeholder{
	font-size: 35rpx;
	text-align: right;	
	color: #aaa;
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
	background-image:url("../../static/image/common/right.png");
	background-repeat: no-repeat;
	background-position: 99%;
}
</style>

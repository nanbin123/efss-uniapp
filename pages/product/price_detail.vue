<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 45px);">
		<view class="item">
			<text class="title">品名</text>
			<text class="iconfont">&#xe639;</text>
			<input v-model="product.productName" :focus='productNameFocus'  @blur='productNameFocus = false' :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text class="title">型号:</text>
			<input v-model="product.type" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text class="title">尺寸:</text>
			<input v-model="product.size" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text class="title">产地:</text>
			<input v-model="product.production" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text class="title">颜色:</text>
			<input v-model="product.color" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text class="title">材质:</text>
			<input v-model="product.texture" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>
		<view class="item">
			<text  class="title">零售价:</text>
			<input v-model="product.retailPrice" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder">
		</view>

		<view class="product-image">
			<text  class="product-title">上传产品图片</text>
			<view class="product-image-img">
				<view class="product-image-item" v-for="(item, index) in product.productImages">
					<image @tap="onPreviewImage(index)"  :src="getProductImgUrl(item.productUrl)" class="proeuct-item-img"></image>
					<view  v-if="!isEditImg" @tap="onDeleteThis(item,index)" class="product-image-remove">
						<text>X</text>
					</view>
				</view>
				<image @tap="onChooseImage" class="product-image-add"  :src="getImgUrl('static/image/receipt/upload-voucher.png')" ></image>
			</view>
		</view>
	</scroll-view>
</template>

<script>
import {get,post,uploadFiles} from "../../components/utils/request.js"
export default {
	data() {
			return {
				isEditable: true,
				isEditImg:false,
				productNameFocus:true,
				product:{}
			}
	},
	methods: {
		onChooseImage(){
			if(!this.isEditImg){
				uni.chooseImage({
					count: 9,//最多可以选择的图片张
					sizeType: ['original', 'compressed'],//original 原图，compressed 压缩图
					sourceType: ['album', 'camera'],//album 从相册选图，camera 使用相机
					success: (res) => {
						if (res.tempFiles.length > 0) {
							let tempFilePaths = [];
							for (var i = 0; i < res.tempFilePaths.length; i++) {
								uploadFiles("product/addPriceImage",res.tempFiles[i].path,{productId:this.product.id}).then(res =>{
									if(200 == res.code){
										let that = this;
										that.product.productImages = that.product.productImages.concat(res.data);
										uni.hideLoading();
									}
								})
							}
						}
					}
				});
			}
		},
		onPreviewImage(index) {
			let imageUrl=[];
			for (var i = 0; i < this.product.productImages.length; i++) {					
				let productUrl = this.getProductImgUrl(this.product.productImages[i].productUrl)
				imageUrl.push(productUrl)
			}
			uni.previewImage({
				current: index,
				urls:imageUrl
			});
		},
		//删除指定图片
		onDeleteThis(item,index){			
			uni.showModal({
				title: '提示',
				content: '您确定删除吗？',
				success: (res)=> {
					if(res.confirm) {
						post("product/deletePriceImage",{"id":item.id}).then(res =>{
							if(200 == res.code){
								this.product.productImages.splice(index, 1);
							}
						})
					}
				}
			});
		},
		getProductImgUrl(image){
			// 处理上传的图片比baseUrl多一个/
			let baseUrl = this.BASEURL;
			let baseSubUrl =  baseUrl.substring(0, baseUrl.length - 1);				
			return baseSubUrl+image;
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	onLoad(option){
		post("product/selectPriceById",{"id":option.id}).then(res =>{
			if(200 == res.code){
				this.product = res.data;
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

.item .title{
	margin-left: 8px;
	font-size: 15px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
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
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
}
.item .type{
	padding-right:30px;	
	background-repeat: no-repeat;
	background-position: 99%;
	 background-size: 10px 15px;
}
.product-image{
	padding: 7px;	
}
.proeuct-item-img{
	display: block;
	width: 100%;
	height: 100px;
}
.product-title{
	font-size: 18px;
	font-weight: 600;
}
.product-image-img{
	display: flex;
	flex-wrap: wrap;
}
.product-image-add{
	width: 80px;
	height: 80px;
	margin-top: 10px;
	margin-left: 20px;
}
.product-image-item{
	position: relative;
	margin-top: 15px;
	margin-right:15px;
	flex: 0 calc(33.3% - 15px);	
}
.product-image-item{
	display: block;
	width: 100%;
	height: 100px;
}
.product-image-remove{
	background-color: #D1372C;
	color: #fff;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	opacity: 0.8;
	position: absolute;
	z-index: 2;
	cursor: pointer;
	box-sizing: border-box;
	top: 0;
	right: 0;
	border-radius: 0 0 0 100%;
}
.product-image-remove text{
	transform: scale(0.8);
	position: absolute;
	right: 3px;
}




</style>

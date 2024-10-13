<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y style="height: calc(100vh - 90px);">
		<view class="item">			
			<text class="title">品名</text>
			<text class="iconfont">&#xe639;</text>
			<input v-model="product.productName" :focus='customerNameFocus'  @blur='customerNameFocus = false' :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入品名">
		</view>
		<view class="item">
			<text class="title">型号:</text>
			<input v-model="product.type" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入型号">
		</view>
		<view class="item">
			<text class="title">尺寸:</text>
			<input v-model="product.size" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入尺寸">
		</view>
		<view class="item">
			<text class="title">产地:</text>
			<input v-model="product.production" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入产地">
		</view>
		<view class="item">
			<text class="title">颜色:</text>
			<input v-model="product.color" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入颜色">
		</view>
		<view class="item product_texture">
			<text class="title">材质:</text>
			<input v-model="product.texture" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入材质">
		</view>

		<view class="item">
			<text class="title">库存:</text>
			<input v-model="product.stock" :disabled="isEditable" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入库存">
		</view>
		<view class="item">
			<text class="title">采购价:</text>
			<input v-model="product.purchasePrice" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入采购价">
		</view>
		<view class="item">
			<text  class="title">零售价:</text>
			<input v-model="product.retailPrice" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入零售价">
		</view>
		<view class="item">
			<text class="title">类别:</text>
			<input v-model="product.productCategoryName" @click="chooseCategory()" :style="'background-image:url('+getImgUrl('static/image/common/right.png')+')'" 			
			class="type" :disabled="isEditable" type="text"  placeholder-class="input-placeholder" placeholder="请选择类别">
		</view>
	</scroll-view>
	
	<view class="bottom-bar">
		  <text class="delete" @click="deleteProduct()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		  <text class="edit"  @click="editProduct()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>


	
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
export default {
	data() {
			return {
				isEditable: true,
				customerNameFocus:true,
				product:{}
			}
	},
	methods: {
		editProduct(){
			if(this.isEditable == true){
				this.isEditable = false
			}else if(this.isEditable == false){
				if(!this.product.productName){
					 this.$nextTick(() => {
						   this.customerNameFocus = true
					 })
					uni.showToast({
						title: '品名不能为空',
						icon: 'none'
					});
					return
				}
				let  product = JSON.stringify(this.product);				
				post("product/updateProductById",product,'application/json').then(res =>{
					if(200 == res.code){
						this.isEditable = true
						uni.showToast({
						  title: '修改产品成功',
						  icon: 'none', 
						  duration: 2000 
						});
					}
				})
			}
		},
		deleteProduct(){
			let that = this
			if(this.isEditable == true){
				uni.showModal({
				  title: '提示',
				  content: '是否删除产品',
				  success: (res)=> {						 
					if (res.confirm) {
						post("product/deleteProductById",{"id":that.product.id}).then(res =>{
							if(200 == res.code){
								this.isEditable = true;
								that.product ={};
								uni.showToast({
								  title: '删除产品成功',
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
		chooseCategory(){
			if(!this.isEditable){
				uni.navigateTo({
					url: '/pages/product/category'
				});
			}
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	onLoad(option){
		post("product/selectProductById",{"id":option.id}).then(res =>{
			if(200 == res.code){
				this.product = res.data;
			}
		})
	}
}
</script>

<style>
/* @import "../../style/icon/iconfont.css"; */

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
.product_texture{
	border-bottom: 5px solid #efeef4ff;
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
	height: 39px;
	line-height: 39px;
	text-align:right;
	color: #00a7e2ff;
	margin-right: 10px;
}


</style>

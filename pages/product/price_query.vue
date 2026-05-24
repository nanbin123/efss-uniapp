<template>
	<view class="head"></view>

	<view class="item">
		<text class="title">品名</text>
		<input v-model="productForm.productName" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入品名">
	</view>
	<view class="item">
		<text class="title">型号</text>
		<input v-model="productForm.type" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入型号">
	</view>
	<view class="item">
		<text class="title">尺寸</text>
		<input v-model="productForm.size" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入尺寸">
	</view>
	<view class="item">
		<text class="title">产地</text>
		<input v-model="productForm.production" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入产地">
	</view>
	<view class="item">
		<text class="title">颜色</text>
		<input v-model="productForm.color" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入颜色">
	</view>
	<view class="item product_texture">
		<text class="title">材质</text>
		<input v-model="productForm.texture" confirm-type="next" type="text" placeholder-class="input-placeholder"
			placeholder="请输入材质">
	</view>
	<view class="item">
		<text class="title">零售价</text>
		<input  v-model="productForm.retailPrice"  type="text" placeholder-class="input-placeholder" placeholder="请输入零售价">
	</view>

	<view class="bottom-bar">
		<view class="clear-btn" @click="clearFilters">清空所有筛选条件</view>
		<view class="search-btn" @click="search">查询</view>
	</view>
</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'
	export default {
		data() {
			return {
				productForm: {
					productName: "",
					type: "",
					size: "",
					production: "",
					productType: "",
					color: "",
					texture: "",
					stock: "",
					retailPrice: "",
					purchasePrice: "",
					productNameOrType: ""
				}
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return {
				moreSearchStore
			}
		},
		methods: {
			search() {
				let product = this.productForm;
				this.moreSearchStore.addMoreSearch(product);
				let pages = getCurrentPages();				
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1,
						 success: (event) => {
							pages[pages.length - 2].$vm.getProductList();
						}
					})
				}
			},
			clearFilters() {
				let _this = this;
				Object.keys(this.productForm).forEach(function(key){					
					_this.productForm[key]="";
				})
			},
			getImgUrl(image) {
				return this.BASEURL + image;
			},
			isEmpty(str) {
				return typeof str === 'undefined' || '' === str;
			}
		},
		onShow() {			
			this.productForm = this.moreSearchStore.moreSearch;
		}
	}
</script>

<style scoped>
	.head {
		height: 5px;
		width: 100%;
		background-color: #efeef3ff;
	}

	.item {
		display: flex;
		padding: 10px 0 5px 0;
		border-bottom: 1px solid #f1f1f1ff;
		align-items: center;
		background-color: #fff;
	}

	.item .title {
		margin-left: 10px;
		font-size: 15px;
		color: #333;
		white-space: nowrap;
		text-rendering: optimizeLegibility;
	}

	.item input {
		flex-grow: 1;
		padding-right: 12px;
		text-align: right;
		text-rendering: optimizeLegibility;
	}

	.time {
		margin-left: auto;
		text-align: right;
		padding-right: 12px;
	}

	.item .input-placeholder {
		font-size: 15px;
		text-align: right;
		color: #aaa;
		text-rendering: optimizeLegibility;
	}

	.starLen {
		display: flex;
		margin-left: auto;
	}

	.star {
		width: 17px;
		height: 17px;
		padding: 0 17px;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.clear-btn,
	.search-btn {
		text-align: center;
		padding: 7px;
		border-radius: 5px;
		font-size: 15px;
		margin: 10px;
	}

	.clear-btn {
		background-color: #fff;
		border: 1px solid #00a7e2ff;
		color: #00a7e2ff;
		width: 35%;
	}

	.search-btn {
		background-color: #00a7e2ff;
		color: #fff;
		width: 30%;
	}
</style>
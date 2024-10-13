<template>
	<view class="head">
		<view class="search">
			<view class="same_search">
				<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"
					v-model="searchProduct.productNameOrType" confirm-type="search" type="text" placeholder="搜索品名或型号" />
			</view>
			<view class="more_search"  @click="moreSearch()">
				<i class="iconfont">&#xe69b;</i>
			</view>
		</view>
	</view>

	<scroll-view  scroll-y="true" :show-scrollbar="false" :enhanced="true"  id="scrollList" style="height: calc(100vh - 90px);" @scrolltolower="onReachBottom">
		<navigator class="content" v-for="(item,index) in productList" :url="'/pages/product/product_detail?id='+item.id">
			<view class="item">
				<text class="info">品名：{{item.productName}}</text>
				<text class="info">型号：{{item.type}}</text>
			</view>
			<view class="item">
				<text class="info">尺寸：{{item.size}}</text>
				<text class="info">产地：{{item.production}}</text>
			</view>
			<view class="item">
				<text class="info">类别：{{item.productCategoryName}}</text>
				<text class="info">颜色：{{item.color}}</text>
			</view>
			<view class="item">
				<text class="info">材质：{{item.texture}}</text>
				<text class="info">库存：<text style="color: #1aa1cfff;font-size: 14px;">{{item.stock}}</text></text>
			</view>
			<view class="item">
				<text class="info">零售价：<text
						style="color: #d6a950ff; font-size: 14px;">￥{{item.retailPrice}}</text></text>
				<text class="info">采购价：<text
						style="color: #1aa1cfff; font-size: 14px;">￥{{item.purchasePrice}}</text></text>
			</view>
		</navigator>
	</scroll-view>
	

	<view class="footer">
		<navigator url="/pages/product/product_add">
			添加产品
		</navigator>
	</view>


</template>
<script>
	import {
		get,
		post
	} from "../../components/utils/request.js"
	import useProductStore from '@/store/modules/product.js'
	export default {
		data() {
			return {
				productList: [],						
				searchProduct:{productNameOrType: ""},
				status: 'more',	
			}
		},
		setup() {
			const productStore = useProductStore();
			return {
				productStore
			}
		},
		methods: {
			moreSearch(){
				let searchProduct = JSON.parse(JSON.stringify(this.searchProduct));
				searchProduct.productNameOrType="";
				this.productStore.addMoreSearchProduct(searchProduct);
				uni.navigateTo({
					url:'/pages/product/product_query'
				})
			},
			onReachBottom() {
				if (this.totalCount > this.productList.length) {
					let searchProduct = this.searchProduct;
					searchProduct.pageNum = ++searchProduct.pageNum;
					this.getProductList(searchProduct).then(res => {
						this.totalCount = res.total;
						this.productList = this.productList.concat(res.rows);
					})
				} else if (this.totalCount == this.productList.length) {
					this.status = "noMore"
				}
			},
			getProductList(searchProduct) {
				console.log(JSON.stringify(searchProduct))
				return post("product/selectListProduct", searchProduct);
			},
			getImgUrl(image) {
				return this.BASEURL + image;
			},
			isEmpty(str) {
				return typeof str === 'undefined' || '' === str;
			}
		},

		watch: {
			'searchProduct.productNameOrType':function(val) {				
				if (!this.isEmpty(val)) {
					this.searchProduct = {"pageNum":1,"productNameOrType":val};
					this.getProductList(this.searchProduct).then(res => {
						this.totalCount = res.total
						this.productList = res.rows
					})
				}
			}
		},
		onLoad() {
			this.productStore.clearProductStore();
		},
		onShow() {
			let product = this.productStore.moreSearchProduct;
			this.searchProduct = JSON.parse(JSON.stringify(product));
			this.searchProduct.pageNum = 1;	
			this.getProductList(this.searchProduct).then(res => {
				this.totalCount = res.total
				this.productList = res.rows
			})
		}
	}
</script>

<style>
.head{
	height: 60px;
}
.head .search {
	width: 100%;
	border-top: 5px solid #efeef3ff;
	position: fixed;
	height: 45px;
	padding: 5px 0;
	z-index: 999;
	background-color: #ffffff;
	display: flex;
}

.head .search .same_search {
	flex: 1;
}

.head .search .same_search .search_input {
	height: 41px;
	background-repeat: no-repeat;
	background-position: 98%;
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;
	padding-left: 10px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 5px;
}

.more_search {
	height: 39px;
	width: 39px;
	margin-top: 2px;
	border-radius: 3px;
	text-align: center;
	line-height: 39px;
	background-color: #00a7e2ff;
	margin-left: 5px;
	margin-right: 7px;
}

.iconfont {
	color: #ffffff;
	font-size: 18px;
}

.content{
	border-bottom: 2px solid #efeef3ff;
	padding: 10px 5px 0 7px;
}
.item{
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
}
.info {
    width: 50%;
    color: #030303ff;
    font-size: 14px; 
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}
/* 隐藏滚动条，但仍然允许滚动 */
/* .load-more-container {
  overflow: auto;
  scrollbar-width: none; 
} */
.footer {
	height: 30px;
	font-size: 16px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;
	color: #fff;
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
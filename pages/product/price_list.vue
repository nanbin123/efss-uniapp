<template> 
<z-paging  ref="paging" v-model="productList" @query="queryList">
	<template #top>
		<view class="head">
			<view class="search">
				 <view class="same_search">
					<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索品名或型号"/>
				</view>
				<view class="more_search" @click="moreSearch()">
					<i class="iconfont">&#xe69b;</i>
				</view>
			</view>
		</view>
	</template>
	
	<navigator class="content" v-for="(item,index) in productList" :url="'/pages/product/price_detail?id='+item.id">
		<view class="product">
			<!-- <view class="left">
				<image class="left_img" :src="getImgUrl('static/image/red_add.png')"></image>
				<view class="left_text">点击添加图片</view>			
			</view> -->
			<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
			<view class="right"> 
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
					<text class="info">零售价：<text style="color: #d6a950ff; font-size: 15px;">￥{{item.retailPrice}}</text></text>
				</view>	
			</view>
		</view>
	</navigator>
</z-paging>

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'
	export default {
		data() {
			return {
				productList:[],
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数				
				searchVal:"",
				searchProduct:{},
			}
		},
		setup() {
			const moreSearchStore= useMoreSearchStore();
			return {moreSearchStore}
		},
		methods: {
			getProductList(){//高级查询
				let product = this.moreSearchStore.moreSearch;				
				this.searchProduct =  product;
				this.$refs.paging.reload();
			},
			refreshProductList(){
				post("product/selectListProduct",this.searchProduct).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				this.searchProduct.pageNum = pageNo;
				this.refreshProductList();
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			moreSearch(){
				uni.navigateTo({
					url:'/pages/product/price_query'
				}) 
			},
		},
		watch:{
			searchVal(newVal, oldVal){
				this.searchProduct.productNameOrType = newVal;
				this.$refs.paging.reload();
			}
		},
		onLoad(){
			this.moreSearchStore.clearMoreSearchStore();
		},
	}
</script>

<style scoped>

.head {
	height: 60px;
}

.head .search {
	width: 100%;
	border-top: 5px solid #efeef3ff;
	height: 45px;
	padding: 5px 0;
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
.more_search .iconfont {
	color: #ffffff;
	font-size: 18px;
}

.product{
	display: flex;
	align-items: center;
	background-color: #fff; 
	border-bottom: 1px solid #cbcbcbff;
	padding: 2px 2px 2px 2px; 
}
.product .img{
	width: 70px;
	height: 80px;	
}
.left{
	width: 20%;
	height: 72px;
	background-color: #f2f2f2ff;	
    text-align: center;
}
.left_text{
	font-size: 10px;	
	padding: 2px;
	text-align: center;
	margin-top: 5px;
	color: #a3a3a1ff;
}
.left_img {
    width: 20px;
    height: 20px;	
	margin-top: 15px;	
}
.right{
	width: 80%;
	margin-left: 2px;
}
.grid {	
 	display: flex;	
	line-height: 20px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 15px;
   white-space: nowrap; /* 文字不换行 */
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 以省略号形式显示 */
}

</style>

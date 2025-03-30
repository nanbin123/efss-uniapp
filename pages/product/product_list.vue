<template>
	<z-paging ref="paging" v-model="productList" @query="queryList">
		<template #top>
			<view class="head">
				<view class="search">
					<view class="same_search">
						<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"
							v-model="searchVal" type="text" placeholder="搜索品名或型号" />
					</view>
					<view class="more_search"  @click="moreSearch()">
						<i class="iconfont">&#xe69b;</i>
					</view>
				</view>
			</view>
		</template>
	
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
		
		<template #bottom>
			<view class="footer">
				<navigator url="/pages/product/product_add">
					添加产品
				</navigator>
			</view>
		</template>
		
	</z-paging>
</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'
	export default {
		data() {
			return {
				productList: [],						
				searchProduct:{},
				searchVal:'',
			}
		},
		setup() {
			const moreSearchStore= useMoreSearchStore();
			return {moreSearchStore}
		},
		methods: {
			getProductList(){//高级查询  
				let customer = this.moreSearchStore.moreSearch;				
				this.searchProduct =  customer;
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
			moreSearch(){
				uni.navigateTo({
					url:'/pages/product/product_query'
				}) 
			},
			getImgUrl(image) {
				return this.BASEURL + image;
			},
			isEmpty(str) {
				return typeof str === 'undefined' || '' === str;
			}
		},
		watch:{
			searchVal(newVal, oldVal) {
				this.searchProduct.productNameOrType = newVal;
				this.$refs.paging.reload();
				
			}
		},
		onLoad() {			
			this.moreSearchStore.clearMoreSearchStore();
		}
	}
</script>

<style scoped>
.head{
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
.footer {
	height: 30px;
	font-size: 16px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;
	color: #fff;
	bottom: 0;
	width: 100%;
}
</style>
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
	
	<view class="content" v-for="(item,index) in productList" :key="item.id">
		<view class="product">
			<navigator class="right" :url="'/pages/product/price_detail?id='+item.id">
				<view class="grid">
					<view class="info">品名：{{item.productName}}</view>
					<view class="info">型号：{{item.type || '未填写'}}</view>
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
			</navigator>
			<view class="product-actions">
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
	</view>
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
			async previewImage(item) {
				const res = await post("product/selectPriceById", { id: item.id });
				if (!res || res.code !== 200 || !res.data) return;
				item.productImages = res.data.productImages;
				const images = Array.isArray(item.productImages) ? item.productImages : [];
				const urls = images.filter(img => img && typeof img.productUrl === 'string' && img.productUrl.trim())
					.map(img => {
						const url = img.productUrl.trim();
						return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
					});
				if (!urls.length) {
					uni.showToast({ title: '暂无更多图片', icon: 'none' });
					return;
				}
				uni.previewImage({ current: urls[0], urls, indicator: 'number', loop: true });
			},
			getProductList(){//高级查询
				let product = this.moreSearchStore.moreSearch;				
				this.searchProduct =  product;
				this.$refs.paging.reload();
			},
			async refreshProductList(){
				const res = await post("product/selectListProduct", this.searchProduct);
				// complete 内部有延时，必须等待完成，不能仅等待一次 nextTick。
				await this.$refs.paging.complete(res.rows);
				await this.$nextTick();
				const ids = new Set(res.rows.map(item => item.id));
				const items = this.productList.filter(item => ids.has(item.id));
				await this.loadProductImages(items);
			},
			async loadProductImages(items) {
				// 限制并发，避免分页加载时同时发出过多图片详情请求。
				let nextIndex = 0;
				const loadNext = async () => {
					while (nextIndex < items.length) {
						const item = items[nextIndex++];
						try {
							const res = await post('product/selectPriceById', { id: item.id });
							if (res && res.code == 200 && res.data) {
								item.productImages = Array.isArray(res.data.productImages) ? res.data.productImages : [];
							}
						} catch (error) {
							// 单个产品加载失败不影响其余产品，点击查看时仍可重试。
						}
					}
				};
				await Promise.all(Array.from({ length: Math.min(4, items.length) }, loadNext));
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
	position: relative;
	display: flex;
	align-items: center;
	background-color: #fff; 
	border-bottom: 1px solid #cbcbcbff;
	padding: 2px 2px 2px 2px; 
}
.right{
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
   flex: 0 0 50%;
   min-width: 0;
   box-sizing: border-box;
   width: 50%;
   color: #030303ff;
   font-size: 15px;
   white-space: nowrap; /* 文字不换行 */
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 以省略号形式显示 */
}

.product-actions{
	position: absolute;
	right: 2px;
	top: 50%;
	transform: translateY(-50%);
	width: 64px;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
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
	color: #00a7e2ff;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #00a7e2ff;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #00a7e2ff;
	border-top: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
	color: #fff;
	font-size: 9px;
	line-height: 14px;
	text-align: center;
}

</style>

<template>
<z-paging  ref="paging" v-model="productList" @query="queryList">

	<template #top>
		<view class="head">
			<view class="search">
				 <view class="same_search">
					<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="输入货品名称查找"/>
				</view>
				<view  class="more_search" @click="moreSearch()">
					<i class="iconfont">&#xe69b;</i>
				</view>
			</view>
		</view>
	 </template>
		
		
	<view class="product" v-for="(item,index) in productList" :key="index">
		<view class="right" @click="selectProduct(item)">
			<view class="grid">
				<text class="info">品名：{{item.productName}}</text>
				<text class="info">型号：{{item.type}}</text>
			</view>
			<view class="grid">
				<text class="info">尺寸：{{item.size}}</text>
				<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
			</view>
			<view class="grid">
				<text class="info">材质：{{item.texture}}</text>
				<text class="info">颜色：{{item.color}}</text>
				
			</view>
			<view class="grid">
				<text class="info" style="color: #e96225ff;">数量：<text >{{item.inventoryQuantity}}</text></text>	
				<text class="info">零售价：<text
					style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
			</view>
		</view>
		<view class="product-actions">
			<checkbox-group class="product-select" @change="onCheckchange($event,item)">
				<label class="select-hit-area">
					<checkbox class="product-checkbox" value="selected" color="#1687ff" :checked="item.selected" @click.stop />
				</label>
			</checkbox-group>
			<button class="preview-button"
				:aria-label="getProductImageCount(item) ? '查看产品图片，共' + getProductImageCount(item) + '张' : '暂无产品图片'"
				:hover-class="getProductImageCount(item) ? 'preview-button-active' : 'none'"
				@click.stop="previewImage(item)">
				<template v-if="getProductImageCount(item)">
					<view class="photo-frame">
						<view class="photo-sun"></view>
						<view class="photo-mountain"></view>
						<view class="photo-mountain photo-mountain-right"></view>
						<text class="photo-count">{{getProductImageCount(item) > 99 ? '99+' : getProductImageCount(item)}}</text>
					</view>
					<text class="preview-label">查看</text>
				</template>
				<template v-else>
					<view class="photo-frame photo-frame-empty">
						<view class="photo-empty-line"></view>
					</view>
					<text class="preview-label">暂无</text>
				</template>
			</button>
		</view>
	</view>

	<template #bottom>
		<view class="bottom">
			<view class="liebiao">				
				<i class="iconfont">&#xe608;</i>				
				<view class="support-circle">
					<text class="support-num">{{totalNumber}}</text>
				</view>
			</view>
			<view class="total-amount">
				<view>入库金额:</view><text class="total-amount-money">￥{{totalMoney}}</text>
			</view>
			<view class="confirm" @click="confirm()">
				选好了
			</view>
		</view>
	</template>
</z-paging>
</template>

<script>
import {get,post} from "../../components/utils/request.js"
import useProductStore from '@/store/modules/product.js'
import useMoreSearchStore from '@/store/modules/moreSearch.js'
export default {
	data() {
		return {
			searchVal:'',
			productList: [],
			totalMoney: 0,
			totalNumber:0,
			evenatChannel:null,
			searchWarehousingProduct:{}
		}
	},
	setup() {
		const productStore = useProductStore();
		const moreSearchStore= useMoreSearchStore();
		return { productStore,moreSearchStore} 
	 },
	methods: {
		getProductImageUrls(item) {
			const images = Array.isArray(item.productImages) ? item.productImages : [];
			return images.filter(image => image && typeof image.productUrl === 'string' && image.productUrl.trim())
				.map(image => {
					const url = image.productUrl.trim();
					return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, '') + '/' + url.replace(/^\/+/, '');
				});
		},
		getProductImageCount(item) {
			return this.getProductImageUrls(item).length;
		},
		previewImage(item) {
			const urls = this.getProductImageUrls(item);
			if (!urls.length) {
				uni.showToast({ title: '暂无更多图片', icon: 'none' });
				return;
			}
			uni.previewImage({ current: 0, urls, indicator: 'number', loop: true });
		},
		getProductList(){//高级查询
			let product = this.moreSearchStore.moreSearch;				
			this.searchWarehousingProduct = product;
			this.$refs.paging.reload();
		},
		refreshWarehousingProductList(){
			post("warehousing/selectListWarehousingEntryProduct", this.searchWarehousingProduct).then(res => {
				if (res.code == 200) {
					let productData = res.data;
					var products = this.productStore.products;
					for (var i = 0; i < productData.length; i++) {
						let productId = productData[i].productId;
						let newProducts = products.filter(item => item.productId === productId);
						let isSelected = newProducts.length>0?true:false
						productData[i].selected = isSelected;
						if(isSelected){
							productData[i].inventoryQuantity = newProducts[0].inventoryQuantity;
						}
					} 
					this.$refs.paging.complete(productData);					
				}
			})
		},
		queryList(pageNo, pageSize) {
			this.searchWarehousingProduct.pageNum = pageNo;
			this.refreshWarehousingProductList();
		},
		selectProduct(item){
			item.selected = !item.selected;
			if(item.selected === true){
				this.add(item);
			}else if(item.selected === false){
				this.subtraction(item);
			}
		},
		onCheckchange(e,item){
			item.selected = e.detail.value.includes("selected");
			 if(item.selected === true){
				this.add(item);
			 }else if(item.selected === false){
				this.subtraction(item);
			} 
		},
		subtraction(item) {
			item.inventoryQuantity=0;
			this.totalNumber--;
			this.totalMoney = parseFloat(this.totalMoney)-parseFloat(item.retailPrice);
			this.productStore.subtraction(item.productId)
		},
		add(item) {
			item.inventoryQuantity++;
			this.totalNumber++;
			this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);
			this.productStore.add(item);
		},
		confirm(){
			let pages = getCurrentPages();
			if(pages.length >1){
				uni.navigateBack({
					delta:1,
					success:(event) =>{
						pages[pages.length -2].$vm.getWarehousingProduct();
					}
				})
			}
		},
		moreSearch(){
			uni.navigateTo({
				url:'/pages/warehousing/warehousing_product_query'
			}) 
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	watch: {
 		searchVal(newVal, oldVal) {
			this.searchWarehousingProduct.productName = newVal;
			this.$refs.paging.reload()
		}
	},
	onShow(option){
		let products = this.productStore.products;
		//计算总条数
		this.totalNumber = products.reduce((accumulator, currentObject) => {
		   return Number(accumulator) + Number(currentObject.inventoryQuantity);
		}, 0);
		//计算总金额
		this.totalMoney = products.reduce((accumulator, currentObject) => {
		   return Number(accumulator) + Number(currentObject.retailPrice) * Number(currentObject.inventoryQuantity);
		}, 0); 
	},
	onLoad() {
		this.moreSearchStore.clearMoreSearchStore();
	}
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
	background-color: #00b6aaff;
	margin-left: 5px;
	margin-right: 7px;
}
.more_search .iconfont {
	color: #ffffff;
	font-size: 18px;
}

.product {
	display: flex;
	align-items: stretch;
	box-sizing: border-box;
	background-color: #fff;
	border-bottom: 1px solid #ddd;
	padding: 5px 8px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.right {
	flex: 1;
	min-width: 0;
}
.grid {
	display: flex;
	align-items: center;
	min-height: 21px;
	line-height: 21px;
}
.grid .info {
	width: 50%;
	min-width: 0;
	box-sizing: border-box;
	padding-right: 4px;
	color: #030303ff;
	font-size: 13px;
	white-space: nowrap;
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 显示省略号 */
	text-rendering: optimizeLegibility;
}
.product-actions {
	width: 40px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}
.product-select, .select-hit-area {
	width: 40px;
	height: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.product-checkbox {
	display: flex;
	align-items: center;
	justify-content: center;
}
/* 微信小程序和 H5 的原生勾选框统一为 28px 正方形。 */
.product-checkbox /deep/ .wx-checkbox-input,
.product-checkbox /deep/ .uni-checkbox-input {
	width: 28px;
	height: 28px;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #c9cbd0;
	border-radius: 4px;
	background: #fff;
}
.product-checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked::before,
.product-checkbox /deep/ .uni-checkbox-input.uni-checkbox-input-checked::before {
	font-size: 20px;
}
.preview-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	flex-shrink: 0;
	width: 40px;
	height: 42px;
	min-width: 40px;
	padding: 6px 0 0;
	margin: 0;
	box-sizing: border-box;
	border: none;
	border-radius: 4px;
	background: transparent;
	color: #00a7e2;
	overflow: visible;
	line-height: 1;
}
.preview-button::after { border: none; }
.preview-button-active { background: #eafaff; }
.photo-frame {
	position: relative;
	flex-shrink: 0;
	width: 28px;
	height: 22px;
	box-sizing: border-box;
	border: 1px solid #00a7e2;
	border-radius: 3px;
	background: #fff;
}
.photo-sun {
	position: absolute;
	left: 5px;
	top: 4px;
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: #00a7e2;
}
.photo-mountain {
	position: absolute;
	left: 4px;
	top: 11px;
	width: 10px;
	height: 10px;
	box-sizing: border-box;
	border-top: 1px solid #00a7e2;
	border-left: 1px solid #00a7e2;
	transform: rotate(45deg);
}
.photo-mountain-right {
	left: 14px;
	top: 10px;
	width: 8px;
	height: 8px;
}
.photo-count {
	position: absolute;
	right: -6px;
	top: -7px;
	min-width: 16px;
	height: 16px;
	padding: 0 3px;
	box-sizing: border-box;
	border-radius: 8px;
	background: #00a7e2;
	color: #fff;
	font-size: 10px;
	line-height: 16px;
	text-align: center;
	white-space: nowrap;
}
.preview-label {
	margin-top: 2px;
	font-size: 10px;
	line-height: 12px;
	color: #00a7e2;
}
.photo-frame-empty {
	width: 26px;
	border-style: dashed;
	border-color: #45c4f0;
	background: #f5fcff;
}
.photo-empty-line {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 10px;
	width: 10px;
	height: 1px;
	background: #00a7e2;
}

.bottom {
	background: #fff;
	border-top: 1px solid #cbcbcbff;
	bottom: 0;
	width: 100%;
	height: 45px;
	display: flex;
}

.bottom .liebiao {
	display: flex;
	margin-left: 15px;
	line-height: 52px;
	position: relative;
}
.iconfont{
	color: #00b6aaff;
	font-size: 35px;
}

.support-circle {
	width: 17px;
	height: 17px;
	background-color: red;
	border-radius: 50%;
	position: absolute;
	left: 25px;
	top: 5px;
}

.support-num {
	display: block;
	font-size: 10px;
	height: 17px;
	line-height: 17px;
	color: #ccc;
	text-align: center;
}

.total-amount {
	display: flex;
	margin-left: 20px;
	line-height: 49px;
	color: #030303ff;
	font-size: 16px;
}

.total-amount-money {
	margin-left: 10px;
	color: #00b6aaff;
}

.confirm {
	height: 45px;
	width: 100px;
	background-color: #00b6aaff;
	color: #fff;
	line-height: 45px;
	text-align: center;
	margin-left: auto;
}

.popup_content {
	position: relative;
	width: 260px;
	height: 120px;
	background-color: white;	
	overflow: auto;
 } 
 .popup_title {
 	 font-size: 15px;	
	 text-align: center;
	 margin: 5px; 	
 }
 .popup_item {
 	 display: flex;	
 	 margin: 10px 15px;
 }
 .popup_item_title{
 	white-space: nowrap;
 	font-size: 15px;
 	color: #070707ff;
 }
 .popup_item_text{
 	border-bottom: 1px solid #f1f1f1ff;
 	flex-grow: 1;
 	text-align: center;
 	white-space: nowrap;
 }
 .popup_item_text input{
 	font-size: 15px;
 	color: #070707ff;
 }

.popup_product_foot {
	width: 260px;
	position: absolute;
	bottom: 0;
	left: 0;
    height: 40px;
	line-height: 40px;
	color: #070707ff;
	font-size: 15px;
	display: flex;
    border-top: 1px solid #f1f1f1ff;
}

.cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
}
.determine{
	text-align: center;
	width: 50%;
}

</style>

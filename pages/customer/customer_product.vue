<template>
<z-paging  ref="paging" v-model="productList" @query="queryList">
	<template #top>
		<view class="head">
			<view class="search">
				 <view class="same_search">
					<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="输入货品名称查找"/>
				</view>
				<view class="more_search" @click="moreSearch()">
					<i class="iconfont">&#xe69b;</i>
				</view>
			</view>
		</view>
	</template>
	

	<view class="product" v-for="(item,index) in productList" :key="index">
		<!-- <image class="img" :src="getImgUrl('static/image/茶几.png')"></image> -->
		<image class="img" :src="getProductImg(item)" mode="aspectFill" 
			@click="previewImage(item)"></image>
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
				<text class="info" style="color: #e96225ff;">数量：<text >{{item.number}}</text></text>	
				<text class="info">零售价：<text
						style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
			</view>
			<view class="product_number">
				<checkbox-group  @change="onCheckchange($event,item)">
					<checkbox value="selected" @click.stop :checked="item.selected"/>
				</checkbox-group>
			</view>
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
				<view>总计金额:</view><text class="total-amount-money">￥{{totalMoney}}</text>
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
				productList: [],
				searchProduct:{},
				searchVal: "",
				totalMoney: 0,
				totalNumber:0,
				customerId:""
			}
		},
		setup() {
			const productStore = useProductStore();
			const moreSearchStore= useMoreSearchStore();
			return {productStore,moreSearchStore}
		 },
		methods: {
			//获取商品第一张图片（空数组时显示默认图）
			getProductImg(item) {
			  if (item.productImages && item.productImages.length > 0) {
			    let url = item.productImages[0].productUrl
			    return this.BASEURL + (url.startsWith('/') ? url.substring(1) : url)
			  }
			  return this.getImgUrl('static/image/茶几.png')
			},
			// 点击放大预览，支持左右滑动切换所有图片
			previewImage(item) {
			  if (!item.productImages || item.productImages.length === 0) {
			    uni.showToast({ title: '暂无更多图片', icon: 'none' })
			    return
			  }
			  const urls = item.productImages.map(img => {
			    let url = img.productUrl
			    return this.BASEURL + (url.startsWith('/') ? url.substring(1) : url)
			  })
			    uni.previewImage({
			      current: 0,        // 从第一张开始
			      urls: urls,        // 所有图片地址
			      indicator: 'number', // 显示 1/3 数字指示器
			      loop: true         // 循环切换
			    })
			  },
			getProductList(){//高级查询
				let product = this.moreSearchStore.moreSearch;				
				this.searchProduct =  product;
				this.$refs.paging.reload();
			},
			refreshProductList(){
				post("customer/selectListCustomerProduct", this.searchProduct).then(res => {
					if (res.code == 200) {
						let productData = res.rows;
						var products = this.productStore.products;
						for (var i = 0; i < productData.length; i++) {
							let productId = productData[i].productId;
							let newProducts = products.filter(item => productId && item.productId === productId);
							let isSelected = newProducts.length>0?true:false
							productData[i].selected = isSelected;
							if(isSelected){
								productData[i].number = newProducts[0].number;
							}
						}
						this.$refs.paging.complete(res.rows);				
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.searchProduct.pageNum = pageNo;
				this.refreshProductList();
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
			add(item) {
				item.number++;
				this.totalNumber++;
				this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);				
			},
			subtraction(item) {
				item.number=0;
				this.totalNumber--;
				this.totalMoney = parseFloat(this.totalMoney)-parseFloat(item.retailPrice);
			},
			confirm(){
				var productChooseArray = this.productList.filter(function(item){
					return item.selected == true;
				});
				this.productStore.addProduct(productChooseArray);
				let pages = getCurrentPages();
				if(pages.length >1){
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							pages[pages.length -2].$vm.getCustomerProduct();
						}
					})
				}
			},
			moreSearch(){
				uni.navigateTo({
					url:'/pages/customer/customer_product_query'
				}) 
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},

		watch: {
			searchVal(newVal, oldVal){
				this.searchProduct.productName = newVal;
				this.$refs.paging.reload();
			}
		},
		onShow() {
			let products = this.productStore.products;
			//计算总条数
			this.totalNumber = products.reduce((accumulator, currentObject) => {
			   return accumulator + currentObject.number;
			}, 0);		
			//计算总金额
			this.totalMoney = products.reduce((accumulator, currentObject) => {
			   return accumulator + currentObject.retailPrice * currentObject.number;
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
	background-color: #00a7e2ff;
	margin-left: 5px;
	margin-right: 7px;
}
.more_search .iconfont {
	color: #ffffff;
	font-size: 18px;
}


	
.product {
	display: flex;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 5px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.img{
	width: 60px;
	height: 65px;
}
.right {
	flex: 1;
	margin-left: 5px;
	position: relative;
}
.grid {
	display: flex;
	line-height: 17px;
}
.grid .info {
	width: 50%;
	color: #030303ff;
	font-size: 13px;
	white-space: nowrap;  
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 显示省略号 */
	text-rendering: optimizeLegibility;
}
.product_number {
	position: absolute;
	bottom: 30%;
	right: 1px;
}
.product_number .number {
	font-size: 15px;
	width: 20px;
	text-align: center;
}

	.bottom {
		background: #fff;
		border-top: 1px solid #cbcbcbff;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 45px;
		display: flex;
	}

	.bottom .liebiao {
		display: flex;
		margin-left: 15px;
		line-height: 45px;
		position: relative;
	}

	.bottom .liebiao .iconfont{
		color: #02a5e6ff;
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
		color: rgb(26, 161, 207);
	}

	.confirm {
		height: 45px;
		width: 100px;
		background-color: rgb(26, 161, 207);
		color: #fff;
		line-height: 45px;
		text-align: center;
		margin-left: auto;
	}
</style>
<template>
<z-paging  ref="paging" v-model="productList" @query="refreshData">
 	<template #top>
		<view class="head">
			<view class="search">
				 <view class="same_search">
					<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="输入货品名称查找"/>
				</view>
				<navigator  class="more_search" url="">
					<i class="iconfont">&#xe69b;</i>
				</navigator>
			</view>
		</view>
	</template>
	
	<view class="product" v-for="(item,index) in productList" :key="item.id">
		
		<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
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
					<checkbox value="selected" :checked="item.selected"/>
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
export default {
	data() {
		return {
			productList: [],
			searchVal: "",
			totalMoney: 0,
			totalNumber:0,
			searchProduct:{}
		}
	},
	setup() {
		const productStore = useProductStore();
		return { productStore }
	 },
	methods: {
		refreshData(pageNo, pageSize){
			this.searchProduct.pageNum = pageNo;
			post("order/selectListOrderProduct", this.searchProduct).then(res => {									
				if (res.code == 200) {
					var productData = res.rows;
					var products = this.productStore.products;
					for (var i = 0; i < productData.length; i++) {
						let productId = productData[i].productId;
						let newProducts = products.filter(item => item.productId === productId);
						let isSelected = newProducts.length>0?true:false
						productData[i].selected = isSelected;
						if(isSelected){
							productData[i].number = newProducts[0].number;
						}
					}					
					this.$refs.paging.complete(productData);
				
				}
			})
		},
		onCheckchange(e,item){
			item.selected = e.detail.value.includes("selected");
			 if(item.selected === true){
				this.add(item);
			 }else if(item.selected === false){
				this.subtraction(item);
			 } 
		},
		selectProduct(item){
			item.selected = !item.selected;
			if(item.selected === true){
				this.add(item);
			}else if(item.selected === false){
				this.subtraction(item);
			}
		},
		subtraction(item) {			
			item.number=0;
			this.totalNumber--;
			this.totalMoney = parseFloat(this.totalMoney)-parseFloat(item.retailPrice);
			this.productStore.subtraction(item.productId)
		},
		add(item) {
			item.number++;
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
						pages[pages.length -2].$vm.getOrderProduct();
					}
				})
			}
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		},
	},		
	watch: {
		searchVal(newVal, oldVal) {
			this.searchProduct.productNameOrType = newVal;
			this.$refs.paging.reload();
			
		}
	},
	onShow(option){
		let products = this.productStore.products;
		//计算总条数
		this.totalNumber = products.reduce((accumulator, currentObject) => {
		   return Number(accumulator) + Number(currentObject.number);
		}, 0);		
		//计算总金额
		this.totalMoney = products.reduce((accumulator, currentObject) => {
		   return Number(accumulator) + Number(currentObject.retailPrice) * Number(currentObject.number);
		}, 0); 
	}
}
</script scoped>

<style>
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
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 5px;
	
/* 	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale; */
}
.product .img{
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
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}
/* .grid :first-child{
	width: 40%;
}
 */
.product_number {
	position: absolute;
	bottom: 30%;
	right: 1px;
	/* width: 80px;
	display: flex;		
	align-items: center;
	text-align: center; */
}
.product_number .number {
	font-size: 15px;
	width: 20px;
	text-align: center;
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
	line-height: 50px;
	position: relative;
}
.bottom .liebiao .iconfont{
	color: #02a5e6ff;
	font-size: 33px;
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
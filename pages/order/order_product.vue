<template>
	
		<view class="head">
			<view class="search">
				 <view class="same_search">
					<input class="search_input" :style="'backgroundImage:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索订单号或客户姓名"/>
				</view>				
			</view>
		</view>
				
		<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 155px);" @scrolltolower="onReachBottom">
			<view class="container" v-for="(item,index) in productList" :key="index">
				<view class="left">
					<image class="left_img" :src="getImgUrl('static/image/red_add.png')"></image>
					<view class="left_text">点击添加图片</view>
				</view>
				<view class="right">
					<view class="grid">
						<text class="info">品名：{{item.productName}}</text>
						<text class="info">型号：{{item.type}}</text>
					</view>
					<view class="grid">
						<text class="info">尺寸：{{item.size}}</text>
						<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
					</view>
					<view class="grid">
						<text class="info">类别：{{item.productType}}</text>
						<text class="info">颜色：{{item.color}}</text>
					</view>
					<view class="grid">
						<text class="info">材质：{{item.texture}}</text>
						<text class="info">零售价：<text
								style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
					</view>
					<view class="grid">
						<view class="info"></view>
						<view class="product_number">
							<view class="reduce" @click="reduce(item)">-</view>
							<view :bind="transformNumber(item)">
								<input disabled="disabled" type="number" v-model="item.number">
							</view>
							<view class="add" @click="add(item)">+</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>		
	
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

<script>
	import {get,post} from "../../components/utils/request.js"
	import useOrderStore from '@/store/modules/order.js' 
	export default {
		data() {
			return {
				productList: [],				
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数
				totalCount:0,				
				searchVal: "",
				totalMoney: 0,
				totalNumber:0
			}
		},
		setup() {
		    const orderStore = useOrderStore();	
			const orderStoreProducts = this.orderStore.products;	
		    return { orderStoreProducts }
		 },
		 computed:{

		 },		
		methods: {
			transformNumber(item){
				let products = this.orderStoreProducts;				 
				let filterProduct = products.filter(product => product.productId == item.productId)				
				let number = filterProduct.map(product => product.number)					
				if(typeof number[0] != 'undefined') {
					item.number = number[0];
				}
			},
			refreshData(){
				post("order/selectListOrderProduct", {
					"pageNum": this.pageNum}).then(res => {
					let that = this;							
					if (res.code == 200) {
						this.productList =res.rows;						
						this.totalCount = res.total;
						uni.hideLoading();					
					}
					if (this.totalCount == this.productList.length) {
						this.status = "noMore"
					}
				})
			},
			reduce(item) {
				if (item.number <= 0) {
					uni.showToast({
						title: '数值不能小于0',
						icon: "none"
					})
					return;
				}
				item.number = item.number - 1;
				this.totalNumber--;
				this.totalMoney = parseFloat(this.totalMoney)-parseFloat(item.retailPrice);			 
			},
			add(item) {
				item.number = item.number + 1;				
				this.totalNumber++;
				this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);		
			},
			confirm(){
				var productChooseArray = this.productList.filter(function(item){
					return item.number>0;
				});				
				this.orderStore.addProduct(productChooseArray);
				let pages = getCurrentPages();
				if(pages.length >1){
					uni.navigateBack({
						delta:1,
						success:(event) =>{
							pages[pages.length -2].getOrderProduct();
						}
					})
				}
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			onReachBottom() {
				if (this.totalCount > this.productList.length) {
					this.pageNum++;
					post("order/selectListOrderProduct", {"pageNum": this.pageNum}).then(res => {						
						this.productList = this.productList.concat(res.rows)
					})
				} else if (this.totalCount == this.productList.length) {
					uni.showToast({
					   title: '没有更多数据了',
					   duration: 3000,
					   icon: 'none'
					});
				}
			}
		},		
		watch: {
			searchVal(val) {
				this.pageNum = 1;
				post("order/selectListOrderProduct",{"pageNum": this.pageNum,"productNameOrType": val,"customerId":this.customerId
				}).then(res => {
					this.totalCount = res.total
					this.productList = res.rows;					
					if (this.totalCount == this.productList.length) {
						this.status = "noMore"
					}
				})
			}
		},
		onLoad(option) {
			 this.refreshData();
		},
		onShow(option){
			let products = this.orderStore.products;
			//计算总条数
			this.totalNumber = products.reduce((accumulator, currentObject) => {
			   return accumulator + currentObject.number;
			}, 0);
			//计算总金额
			this.totalMoney = products.reduce((accumulator, currentObject) => {
			   return accumulator + currentObject.retailPrice * currentObject.number;
			}, 0);
		}
	}
</script>

<style>
@import "../../static/icon/iconfont.css";
page{
  height: 100%
}
.head{
	height: 65px;	
}

.head .search{
	border-top: 5px solid #efeef3ff; 
	position: fixed; 
	width: 100%;
	height: 45px;
	padding: 5px 0;	
	z-index: 999;
	background-color: #ffffff;	
	display: flex;
}
.head .same_search{	
	width:100%;
}
 .search_input{	
	height: 45px;
	/* background-image:url("../../static/image/search.png"); */
	background-repeat: no-repeat;
	background-position: 98%;	
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;	
	color:'#606266';	
	padding-left:  20px;
	padding-right: 60px;
	font-size: 15px;
	margin:  0 20px; 
}

.container {
	display: flex;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 7px;
}

.left {
	width: 20%;
	height: 88px;
	background-color: #f2f2f2ff;
	text-align: center;
}

.left_text {
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

.right {
	width: 80%;
	margin-left: 5px;
}

.grid {
	display: flex;
	line-height: 14px;
}

.info {
	width: 50%;
	color: #030303ff;
	font-size: 13px;
	white-space: nowrap;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.product_number {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #cdcdcdff;
	border-radius: 4px;
	width: 40%;
	height: 22px;
	text-align: center;
	
}

.reduce {
	padding: 0 10px;
	height: 22px;
	line-height: 22px;
	border-right: 1px solid #cdcdcdff;
	color: #010101ff;
	font-weight: 500;
}

.add {
	padding: 0 10px;
	height: 22px;
	line-height: 22px;
	border-left: 1px solid #cdcdcdff;
	color: #010101ff;
}

.product_number input {
	font-size: 13px;
}


.bottom {	
	background: #fff;
	border-top: 1px solid #cbcbcbff;
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 45px;
	display: flex;
	z-index: 999;
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
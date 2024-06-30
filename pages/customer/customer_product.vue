<template>

	<view class="head">
		<view class="search">
			 <view class="same_search">
				<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索品名或型号"/>
			</view>				
		</view>
	</view>
	<scroll-view scroll-y id="scrollList" style="height: calc(100vh - 155px);" @scrolltolower="onReachBottom">
	<view class="product" v-for="(item,index) in productList" :key="index">
		<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
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
		</view>
		<view class="product_number">
			<view class="reduce" @click="reduce(item)">-</view>
			<view class="number" :bind="transformNumber(item)" >{{item.number}}</view>
			<view class="add" @click="add(item)">+</view>
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
	import useCustomerStore from '@/store/modules/customer.js'
	export default {
		data() {
			return {
				productList: [],				
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数				
				reload: false,				
				searchVal: "",
				totalMoney: 0,
				totalNumber:0,
				evenatChannel:null,
				customerId:""
				
			}
		},
		setup() {
			const customerStore = useCustomerStore();
			const customerStoreProducts = customerStore.products;	
			return { customerStoreProducts,customerStore }
		 },
		methods: {
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
			transformNumber(item){
				let products = this.customerStoreProducts;
				let filterProduct = products.filter(product => product.productId == item.productId)
				let number = filterProduct.map(product => product.number)					
				if(typeof number[0] != 'undefined') {
					item.number = number[0];
				}
			},
			refreshData(){
				post("customer/selectListCustomerProduct", {"pageNum": this.pageNum}).then(res => {											
					if (res.code == 200) {
						this.productList =res.rows;						
						this.totalCount = res.total;
						uni.hideLoading();					
					}
				})
			},
			confirm(){
				var productChooseArray = this.productList.filter(function(item){
					return item.number>0;
				});
				this.customerStore.addProduct(productChooseArray);
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
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			onReachBottom() {
				if (this.totalCount > this.productList.length) {
					this.pageNum++;
					post("customer/selectListCustomerProduct", {"pageNum": this.pageNum}).then(res => {
						this.productList = this.productList.concat(res.rows)
					})
				} else if (this.totalCount == this.productList.length) {
					uni.showToast({
					   title: '没有更多数据了',
					   duration: 3000,
					   icon: 'none'
					});
				}
			},
		},

		watch: {
			searchVal(val) {
				this.pageNum = 1;
				post("product/selectListCustomerProduct",{"pageNum": this.pageNum,"productNameOrType": val}).then(res => {
					this.totalCount =  res.data.total
					this.productList = res.data.products;
					uni.hideLoading();
					if (this.totalCount == this.productList.length) {
						this.status = "noMore"
					}
				})
			}
		},
		onLoad(option) {
			 this.refreshData();
		},
		onShow() {
			let products = this.customerStoreProducts;
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
	.product {
		position: relative;
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #cbcbcbff;
		padding-bottom: 10rpx;
		margin-bottom: 15rpx;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.img{
		width: 80px;
		height: 80px;	
	}
	.right {
		flex: 1;
		margin-left: 5px;
	}
	.grid {
		display: flex;
		line-height: 20px;
	}
	.grid .info {	
		color: #030303ff;
		font-size: 14px;
		color: #333;
		white-space: nowrap;  
		overflow: hidden; /* 超出部分隐藏 */
		text-overflow: ellipsis; /* 显示省略号 */
		text-rendering: optimizeLegibility;
	}
	.grid :first-child{
		width: 40%;
	}


	.product_number {
		position: absolute;
		bottom: 50%;
		right: 10px;
		width: 80px;
		display: flex;		
		align-items: center;
		text-align: center;
	}

	.reduce {		
		min-height: 25px;
		min-width: 25px;
		text-align: center;
		line-height: 20px;
		background-color: rgb(26, 161, 207);
		color: #fff;	
		border-radius: 50%;
	}

	.add {
		min-height: 25px;
		min-width: 25px;
		text-align: center;
		line-height: 22px;
		background-color: rgb(26, 161, 207);
		color: #fff;	
		border-radius: 50%;
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
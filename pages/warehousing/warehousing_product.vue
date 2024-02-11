<template>
	<view class="wrap">
		<view class="head">
			<view class="search">
				<input class="search_input" v-model="searchVal" confirm-type="search" type="text"
					placeholder="搜索品名或型号" />
			</view>
		</view>
		<view class="content" v-for="(item,index) in productList" :key="index">
			<view class="left">
				<image class="left_img" :src="getImgUrl('static/image/red_add.png')" ></image>
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
						<view>
							<input disabled="disabled" type="number" v-model="item.receivedQuantity">
						</view>
						<view class="add" @click="add(item)">+</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType"
			v-if="productList.length > 0" />
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
	</view>
</template>

<script>
	import {
		get,
		post
	} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				productList: [],
				//selectProductList: [],//选择的产品
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数				
				reload: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多~',
					contentrefresh: '正在加载更多~',
					contentnomore: '我是有底线的~'
				},
				iconType: 'auto', // 图标样式 
				searchVal: "",
				totalMoney: 0,
				totalNumber:0,
				evenatChannel:null,
				warehousingEntryId:""
				
			}
		},
		methods: {
			reduce(item) {
				if (item.receivedQuantity <= 0) {
					uni.showToast({
						title: '数值不能小于0',
						icon: "none"
					})
					return;
				}
				item.receivedQuantity = item.receivedQuantity - 1;
				this.totalNumber--;
				this.totalMoney = parseFloat(this.totalMoney)-parseFloat(item.retailPrice);			 
			},
			add(item) {
				item.receivedQuantity = item.receivedQuantity + 1;
				this.totalNumber++;
				this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);				
			},
			confirm(){
				var productChooseArray = this.productList.filter(function(item){
					return item.receivedQuantity>0;
				});			
				let productArray = new Array();
				for (var i = 0; i < productChooseArray.length; i++) {
					let  product= new Object();
					product.warehousingEntryId = this.warehousingEntryId;
					product.productId = productChooseArray[i].id;
					product.number = productChooseArray[i].number;				
					productArray.push(product);
				}
				post("warehousing/insertWarehousingEntryProduct", {"productJson":JSON.stringify(productArray)}).then(res => {
					uni.hideLoading();
					let pages = getCurrentPages();
					if(pages.length >1){
						let prevPage = pages[pages.length -2];
						uni.navigateBack({
							delta:1,
							success:(event) =>{
								prevPage.getList();
							}
						})
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onReachBottom() {
			if (this.totalCount > this.productList.length) {
				this.pageNum++;
				post("warehousing/selectListWarehousingEntryProduct", {
					"pageNum": this.pageNum,"warehousingEntryId":this.warehousingEntryId
				}).then(res => {
					this.productList = this.productList.concat(res.data.products)					
					uni.hideLoading();
				})
			} else if (this.totalCount == this.productList.length) {
				this.status = "noMore"
			}
		},
		watch: {
			searchVal(val) {
				this.pageNum = 1;
				post("warehousing/selectListWarehousingEntryProduct",{"pageNum": this.pageNum,"productNameOrType": val,"warehousingEntryId":this.warehousingEntryId
				}).then(res => {
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
			this.warehousingEntryId = option.warehousingEntryId			
			post("warehousing/selectListWarehousingEntryProduct", {
				"pageNum": this.pageNum,"warehousingEntryId":this.warehousingEntryId}).then(res => {
				let that = this;				
				that.totalCount = res.data.total				
				if (that.totalCount > 0) {
					this.productList =res.data.products;
					this.totalNumber =res.data.totalNumber;
					this.totalMoney  =res.data.totalMoney;
					uni.hideLoading();					
				}
				if (this.totalCount == this.productList.length) {
					this.status = "noMore"
				}
			})
			
		}
	}
</script>

<style>
	@import "../../static/icon/iconfont.css";

	
	.wrap {
		width: 100%;
		height: 100%;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.head {
		height: 85px;
	}

	.head .search {
		border-top: 5px solid #efeef3ff;
		position: fixed;
		width: 100%;
		height: 60px;
		padding-top: 10px;
		padding-bottom: 10px;
		z-index: 999;
		background-color: #ffffff;
	}

	.search_input {
		padding-right: 60px;
		background-image: url("../../static/image/search.png");
		background-repeat: no-repeat;
		background-position: 98%;
		height: 60px;
		border: 1px solid #f2f2f2;
		border-radius: 100rpx;
		background-color: red;
		text-align: left;
		font: sist 14px;
		color: '#606266';
		background-color: #ffffff;
		padding-left: 20px;
		font-size: 28rpx;
		margin-left: 20px;
		margin-right: 20px;
	}

	.content {
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #cbcbcbff;
		padding-bottom: 10rpx;
		margin-bottom: 15rpx;
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
		font-size: 12px;
		white-space: nowrap;
	}

	.product_number {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #cdcdcdff;
		border-radius: 5rpx;
		width: 40%;
		text-align: center;
		margin-top: 5px;
	}

	.reduce {
		padding: 0 25rpx;
		height: 36rpx;
		line-height: 30rpx;
		border-right: 1px solid #cdcdcdff;
		color: #010101ff;
		font-weight: 500;
	}

	.add {
		padding: 0 25rpx;
		height: 36rpx;
		line-height: 33rpx;
		border-left: 1px solid #cdcdcdff;
		color: #010101ff;
	}

	.product_number input {
		font-size: 26rpx;
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
		line-height: 52px;
		position: relative;
	}
	.iconfont{
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
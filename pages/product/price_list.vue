<template>
<view class="wrap">	

	<view class="head">
		 <view class="search">
			<input class="search_input"  v-model="searchVal" confirm-type="search" type="text" placeholder="搜索品名或型号"/>
		</view>
	</view>
	<view class="content"  v-for="(item,index) in productList" :key="index">
		<view class="left">
			<image class="left_img" src="../../static/image/red_add.png"></image>
			<view class="left_text">点击添加图片</view>			
		</view>
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
				<text class="info">类别：{{item.productType}}</text>
				<text class="info">颜色：{{item.color}}</text>				
			</view>
			<view class="grid">
				<text class="info">材质：{{item.texture}}</text>			
			    <text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
			</view>	
		</view>
	</view>
			<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="productList.length > 0"/>
			
		</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				productList:[],
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数				
				reload: false,				
				status: 'more',	
				contentText: {				
						contentdown: '上拉加载更多~',				
						contentrefresh: '正在加载更多~',				
						contentnomore: '我是有底线的~'
				 },				
				 iconType: 'auto',    // 图标样式 
				 searchVal:""
			}
		},
		methods: {

		},
		onReachBottom() {
			if(this.totalCount > this.productList.length){
				this.pageNum++;				
				post("product/selectListProduct",{"pageNum":this.pageNum}).then(res =>{					
					 this.productList = this.productList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.productList.length){								 
				 this.status = "noMore"				
			}
		},
		watch:{
			searchVal(val){				
				post("product/selectListProductPrice",{"pageNum":this.pageNum,"productNameOrType":val}).then(res =>{
					this.totalCount = res.total
					this.productList = res.rows
					uni.hideLoading();				
					 if(this.totalCount == this.productList.length){					 
						 this.status = "noMore"
						
					 }
				})
			}
		},
		onLoad(){
			post("product/selectListProduct",{"pageNum":this.pageNum}).then(res =>{				
				this.totalCount = res.total				
				 if(this.totalCount >0){
					this.productList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.productList.length){					 
					 this.status = "noMore"
				 }
			})
		},
	}
</script>

<style>

.wrap {
	width: 100%;
	height: 100%;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.head{
	height: 85px;	
}
.head .search{
	border-top: 5px solid #efeef3ff; 
	position: fixed;
	width: 100%;
	height:60px;
	padding-top: 10px;
	padding-bottom: 10px;
	z-index: 999;
	background-color: #ffffff;
}
.search_input{
	padding-right:60px;
	background-image:url("../../static/image/search.png");
	background-repeat: no-repeat;
	background-position: 98%;
	height: 60px;
	border: 1px solid #f2f2f2;
	border-radius: 100rpx;
	background-color: red;
	text-align: left;
	font: sist 14px;
	color:'#606266';
	background-color: #ffffff;
	padding-left: 20px;	
	font-size: 28rpx;
	margin-left:  20px; 
	margin-right: 20px;
}

.content{
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 10rpx;
	margin-bottom: 15rpx;
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


</style>

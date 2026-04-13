<template> 
<z-paging  ref="paging" v-model="productList" @query="queryList">
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

	<view class="product"  v-for="(item,index) in productList" :key="index">
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
				<text class="info">类别：{{item.productType}}</text>
				<text class="info">颜色：{{item.color}}</text>				
			</view>
			<view class="grid">
				<text class="info">材质：{{item.texture}}</text>			
			    <text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
			</view>	
		</view>
	</view>

</z-paging>





</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				productList:[],
				pageNum: 1, // 当前页
				pageSize: 10, // 每页条数				
				 searchVal:""
			}
		},
		methods: {
			getImgUrl(image){
			   return this.BASEURL+image;
			},
			queryList(pageNo, pageSize) {				
				post("product/selectListProduct",{"pageNum":pageNo}).then(res =>{					
					 this.$refs.paging.complete(res.rows);
				})
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
	margin-left: 5px;
}
.grid {	
 	display: flex;	
	line-height: 17px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 13px;
   white-space: nowrap; /* 文字不换行 */
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 以省略号形式显示 */
}

</style>

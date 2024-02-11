<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<view class="">
		<view class="item">
			<image style="margin-top: 1px;margin-right: -2px;" class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')" ></image>
			<text class="title">入库单号:</text>			
			<uni-forms-item>
				<input v-model="warehousingEntry.warehousingNumber" type="text" disabled="disabled"/>
			</uni-forms-item>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')"></image>
			<text class="title">记录日期:</text>	
			<text class="content"></text>
			<uni-forms-item>
				<input v-model="warehousingEntry.recordDate" type="text" />
			</uni-forms-item>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/supplier.png')"></image>
			<text class="title">供应商:</text>
			<uni-forms-item>
				<input v-model="warehousingEntry.supplier" type="text" />
			</uni-forms-item>
		</view>	
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
			<text class="title">备注 :</text>	
			<uni-forms-item>
				<input v-model="warehousingEntry.remark" type="text" />
			</uni-forms-item>
		</view>
	</view>
	
	<view class="bottom-bar">
	    <view class="clear-btn" @click="clearFilters">清空所有筛选条件</view>
	    <view class="search-btn" @click="search">查询</view>
	</view>
</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				warehousingEntry:{}
			}
		},
		methods: {	
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad() {			

		}	
	}
</script>

<style>
.wrap{
	width: 100%;	
}
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.item{
	display: flex;
	align-items: center;	
	padding-left: 10px;
	padding-right: 10px;
	padding-bottom: 2px;
	padding-top: 2px;
	border-bottom: 1px solid #efeef3ff;
}
.img{
	width: 23px;
	height: 20px;	
}
.title{	
	white-space: nowrap;
	padding: 0 10px;
	font-size: 20px;
	color: #333;
}
.content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.item .uni-forms-item{
	width: 100%;
	margin-bottom:0;
	margin-left: auto;	
}
.item .uni-forms-item uni-input{
	display: inline;
	font-size: 18px;
	text-align: right;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center; 
  background-color: #fff;
}

.clear-btn, .search-btn { 
  text-align: center;
  padding: 10px 0;
  border-radius: 5px; 
  width: 35%;
  margin: 20px 5%;
}

.clear-btn {
  background-color: #fff;
  border: 1px solid #409eff; 
  color: #409eff; 
  
}

.search-btn {
  background-color: #409eff;
  color: #fff; 
}


</style>

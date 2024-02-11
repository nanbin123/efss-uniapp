<template>
	<view style="position: relative;height: 100%;width: 100%;">
		<view class="item customer_name">			
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_name.png')" ></image>
			<view class="title">客户姓名</view>
			<view class="content">
				<input  confirm-type="next" type="text"	placeholder-class="input-placeholder"  placeholder="请输入姓名"/>
			</view>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/customer_phone.png')" ></image>
			<view class="title">客户电话</view>
			<view class="content">
				<input  confirm-type="next" type="text"	placeholder-class="input-placeholder"  placeholder="请输入电话"/>
			</view>
		</view>
		<view class="item">					
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>			
			<view class="title">客户地址</view>		
			<view class="content">
				<input  confirm-type="next" type="text"	placeholder-class="input-placeholder"  placeholder="请输入地址"/>
			</view>
		</view>
		<view class="item order_number">
			<image class="img" :src="getImgUrl('static/image/cusomer/order_number.png')"></image>
			<view class="title">订单号</view>		
			<view class="content">
				<input  confirm-type="next" type="text"	placeholder-class="input-placeholder"  placeholder="请输入订单号"/>
			</view>
		</view>
		<view class="item">			
			<image class="img" :src="getImgUrl('static/image/cusomer/start_time.png')"></image>
			<view class="title">记录开始时间</view>
			<view class="content">
				<view  @tap="toggle('start_date')" class="time" :style="{color:startTime=='请选择'?'#a0a0a0':'#333'}">{{startTime}}</view>
				<cPicker mode='date' @confirm="startHand" ref="start_date"></cPicker>
			</view>
		</view>	
		<view class="item">			
			<image class="img" :src="getImgUrl('static/image/cusomer/end_time.png')"></image>
			<view class="title">记录终止时间</view>
			<view class="content">
				<view  @tap="toggle('end_date')" class="time" :style="{color:endTime=='请选择'?'#a0a0a0':'#333'}">{{endTime}}</view>
				<cPicker mode='date' @confirm="endHand" ref="end_date"></cPicker>
			</view>
		</view>		
		<view class="item">			
			<image class="img" :src="getImgUrl('static/image/cusomer/degree.png')"></image>
			<view class="title">意向程度</view>
			<view class="content starLen">				
				<image class='star'  @touchmove='changeStar(1)' @tap='changeStar(1)' mode="aspectFill" :src="score>0?fullStarUrl:nullStarUrl"/>	
				<image class='star' @touchmove='changeStar(2)' @tap='changeStar(2)' mode="aspectFill" :src="score>1?fullStarUrl:nullStarUrl"/>
				<image class='star' @touchmove='changeStar(3)' @tap='changeStar(3)' mode="aspectFill" :src="score>2?fullStarUrl:nullStarUrl"/>
			</view>
		</view>
		<navigator  class="btn" url="/pages/cusomer/cusomer_list">
			<button>查询客户</button>
		</navigator>
	</view>
	
</template>

<script>
	
	import cPicker from "../../components/c-picker/c-picker.vue"	
	import {
		picker
	} from "../../components/mixins/picker.js"
	
	
	export default {
		components: {
			cPicker
		},
		data() {
			return {
				startTime:'请选择',
				endTime:'请选择',			
				fullStarUrl: '../../static/image/cusomer/star.png', //满星图片
				nullStarUrl: '../../static/image/cusomer/empty.png', //空星图片
				score: 0
			}
		},
		methods: {
			toggle(val) {
				this.$refs[val].show();
			},
			startHand(value) {
				this.startTime = value.result							
			},
			endHand(value) {
				this.endTime = value.result							
			},
			changeStar(val) {
				this.score = val
			},
			getDate() {
				var time = new Date();
				const y = time.getFullYear();
				const m = (time.getMonth() + 1 + "").padStart(2, "0");
				const d = (time.getDate() + "").padStart(2, "0");
				var timing = `${y}-${m}-${d}`;
				this.startTime=timing
				this.endTime=timing
				
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		}
	}
</script>

<style>
.item {
	display: flex;
	align-items: center;	
	border-bottom: 1px solid #f1f1f1ff;
	padding: 20rpx 0;	
	font-size: 40rpx;	
	background-color: #fff;
	color: #333;
}
.img {
	padding-left: 20rpx;
	width: 20px;
	height: 20px;
	vertical-align: middle;
}
.title {	
	padding: 0 15px;	
	white-space: nowrap;
}
.content {
	flex-grow: 1;
	padding-right: 30rpx;
}
.content input{
	
	text-align: right;
}
.customer_name{
	border-top: 5px solid #efeef6ff;
}
.order_number{
	border-bottom: 5px solid #efeef6ff;
}
.input-placeholder {	
	font-size: 40rpx;	
	text-align: right;
	color: #aaa;
}
.time {
	text-align: right;
	color: #aaa;	
}
.starLen{
    display: flex;
	justify-content: space-between;
	padding: 0 80rpx;	
} 
.star{
     width:50rpx;
     height:50rpx;
}
.btn{
	position: relative;
	top: 100rpx;
	width: 70%;
	margin:0 auto;
}
.btn button{
	background-color: #02a5e6ff;
	border: 0;
	color: #f4f7ffff;
}

</style>

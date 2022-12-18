<template>
	<view style="position: relative;width: 100%;height: 100%;">
		<view class="item cusomer_name">
			<image class="img" src="../../static/image/cusomer/cusomer_name_add.png"></image>
			<view class="title">客户姓名</view>
			<view class="content">
				<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/cusomer_gender.png"></image>
			<view class="title">客户性别</view>			
			<view class="content">
				<view  @tap="toggle('selector')" class="gender" :style="{color:gender=='请选择'?'#a0a0a0':'#333'}">{{gender}}</view>
				<cPicker @confirm="hand" name="ll" mode="selector"  ref="selector" :selectList="selectList"></cPicker>
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/customer_phone.png"></image>
			<view class="title">客户电话</view>
			<view class="content">
				<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入电话">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/quoted_price.png" mode=""></image>
			<text class="title">报价:</text>
			<view class="content">
				<input confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入报价">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/cusomer_address.png"></image>
			<view class="title">客户地址</view>
			<view class="content">
				<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入地址">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/degree.png"></image>
			<view class="title">意向程度</view>
			<view class="content starLen">
				<image class="star" @tap='changeStar(1)' :src="score>0?fullStarUrl:nullStarUrl"></image>
				<image class="star" @tap='changeStar(2)' :src="score>1?fullStarUrl:nullStarUrl"></image>
				<image class="star" @tap='changeStar(3)' :src="score>2?fullStarUrl:nullStarUrl"></image>
			</view>
		</view>
		<view class="remarks">
			<textarea maxlength="200" placeholder="请输入备注:" placeholder-class="textarea-placeholder" @input="handInput"></textarea>
			<label for="forFocus" class="textarea-count ">{{textateaL}}/{{maxlength}}</label>
		</view>
		<view class="btn">
			<button>保存</button>
		</view>
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
				fullStarUrl:'../../static/image/cusomer/star.png',
				nullStarUrl:'../../static/image/cusomer/empty.png',
				score:0,
				textateaL: 0,
				maxlength:200,
				gender:'请选择',
				selectList: [{
						ll: "男",
						value: 1
					},
					{
						ll: "女",
						value: 2
					}
				]
			}
		},
		methods: {
			changeStar(val){				
				this.score=val;
			},
			handInput(value) {
				let val = value.detail.value;
				this.textateaL = val.length;
			},
			toggle(val) {				
				this.$refs[val].show();
			},
			hand(value) {
				this.gender = value.result							
			}
		}
	}
</script>

<style>
.item{
	display: flex;	
	padding: 20rpx 0;
	border-bottom: 1px solid #f1f1f1ff;
	font-size: 35rpx;
	align-items: center;
	background-color: #fff;
	color: #333;
}
.img{
	padding-left: 20rpx;
	width: 20px;
	height: 20px;	
}
.title{
	padding: 0 20rpx;
}
.content{
	flex-grow: 1;
	padding-right: 30rpx;
}
.content input{
	text-align: right;
}
.input-placeholder{
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.textarea-placeholder{
	font-size: 40rpx;
	text-align: left;
	color: #aaa;
	padding: 30rpx;
}
.cusomer_name{
	border-top: 5px solid #efeef4ff;
}
.starLen{
	display: flex;
	justify-content: space-around;
}
.star{
	width: 50rpx;
	height: 50rpx;
}
.remarks{
	overflow: hidden;
	position: relative;
	border-top: 5px solid #efeef4ff;
	border-bottom: 1px solid #f1f1f1ff;	
	padding: 30rpx;
}

.remarks textarea {
	height: 300rpx;	
	width: 100%;	
	font-size: 40rpx;
	color: #333;
}
.textarea-count {
	position: absolute;
	font-size: 24rpx;
	line-height: 32rpx;
	bottom: 10rpx;
	right: 0px;
	color: #999;
}
.gender {
	font-size: 40rpx;
	text-align: right;
	color: #aaa;	
}
.btn{
	width: 80%;
	position: relative;
	top: 100rpx;
	margin: 0 auto;
}
.btn button{
	background-color: #00a7e2ff;
	border: 0;
	color: #daf2fbff;	
}
</style>

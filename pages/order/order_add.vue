<template>
<view class="wrap">
	<view class="item cusomer_name">
		<image class="img" src="../../static/image/order/cusomer_name_add.png"></image>
		<text class="title">客户姓名:</text>
		<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/cusomer_gender.png"></image>
		<view class="title">客户性别:</view>
		<view class="gender">
			<view  @tap="toggle('selector')" :style="{color:gender=='请选择'?'#a0a0a0':'#333'}">{{gender}}</view>
			<cPicker @confirm="hand" name="ll" mode="selector"  ref="selector" :selectList="selectList"></cPicker>
		</view>
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/cusomer_phone.png"></image>
		<text class="title">客户电话:</text>
		<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入电话">
	</view>
	<view class="item cusomer_address">
		<image class="img" src="../../static/image/order/cusomer_address.png"></image>
		<text class="title">客户地址:</text>
		<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入地址">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/total_amount.png"></image>
		<text class="title">订单总金额:</text>
		<input disabled="disabled" value="100.00">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/order_actual_amount.png"></image>
		<text class="title">实收金额:</text>
		<input confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入收款金额">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/discount.png"></image>
		<text class="title">折扣:</text>
		<input disabled="disabled" value="80%">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/order/delivery_time.png"></image>
		<text class="title">送货时间:</text>
		<view class="deliveryTime">
			<view  @tap="toggle('start_date')" :style="{color:deliveryTime=='请选择'?'#a0a0a0':'#333'}">{{deliveryTime}}</view>
			<cPicker mode='date' @confirm="deliveryHand" ref="start_date"></cPicker>
		</view>
	</view>
	<view class="item choice_porduct">
		<image class="img" src="../../static/image/order/choice.png"></image>
		<text class="title">选择产品</text>
		<image class="add_product" src="../../static/image/add.png"></image>
	</view>
	
	<!-- 1、touchstart事件：当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发。
	2、touchmove事件：当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
	3、touchend事件：当手指从屏幕上离开的时候触发。
	4、touchcancel事件：当系统停止跟踪触摸的时候触发 -->
	<view v-for="(item, index) in csListArrl"	:key="index" :data-index="index" class="product-item" 
		@touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd"  :style="'right:'+item.right+'px'">
			<view class="product">
				<view class="product_img">
					<image src="../../static/image/茶几.png" mode=""></image>
				</view>
				<view class="product_content">
					<view class="grid">
						<view class="info">品名：长茶几</view>
						<view class="info">型号：7707-C</view>
					</view>
					<view class="grid">
						<view class="info">类别：茶几</view>
						<view class="info">颜色：胡桃色</view>
						<view class="info">材质：楸木</view>
					</view>
					 <view class="grid">
						<view class="info">尺寸：1400*800*500</view>
						<view class="info">产地：东莞</view>
					</view>
					<view class="grid">
						<view class="info" style="color: #e96225ff;">零售价：<text style="color: #e96225ff;">￥1300</text></view>
					</view>
				</view>	
				<view class="product_number">
					<view class="reduce" @click="reduce">-</view>
					<view>
						<input type="number" v-model="total" @input="countVal">			
					</view>
					<view class="add" @click="add">+</view>
				</view>
			</view>
			<view class="remove" @click="delData(item)">删除</view>					
	</view>
	
	
	
	<view class="btn">
		<button>确认</button>
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
				gender:'请选择',
				selectList: [{
						ll: "男",
						value: 1
					},
					{
						ll: "女",
						value: 2
					}
				],
				deliveryTime:'请选择',
				//列表数据，可根据自己的业务获取
				csListArrl:[{
					
				}],
			}
		},
		methods: {
			toggle(val) {
				this.$refs[val].show();
			},
			hand(value) {
				this.gender = value.result							
			},
			deliveryHand(value) {
				this.deliveryTime = value.result							
			}
		}
	}
</script>

<style>
.wrap{
	position: relative;
	width: 100%;
	height: 100%;
}
.item{
	display: flex;	
	padding: 20rpx 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
	
}
.item .img{
	padding-left: 20rpx;
	width: 20px;
	height: 20px;	
}
.item .title{
	padding: 0 20rpx;
	font-size: 35rpx;
	color: #333;
}
.item input{
	flex-grow: 1;
	padding-right: 30rpx;
	text-align: right;
}
.cusomer_name{
	border-top: 5px solid #efeef4ff;
}
.cusomer_address{
	border-bottom: 5px solid #efeef4ff;
}
.item .input-placeholder{
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.item .gender {
	flex-grow: 1;
	padding-right: 30rpx;
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.item .deliveryTime {
	flex-grow: 1;
	padding-right: 30rpx;
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.choice_porduct{
	position: relative;
}
.add_product{
	width: 25px;
	height: 25px;
	position: absolute;
	right: 20px;
}

.product-item {
    width: 100%;    
    position: relative;
    margin: 0 auto;
}
.remove {
    margin-left:-5%;
    width: 80px;
    height: 100%;
    background-color: #dd544eff;
    color: #FFFFFF;
    position: absolute;
    top: 0;
    right: -80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
.product{
	display: flex;
	align-items: center;	
    width: 100%;   
    margin: 0 auto;
    border-bottom: 1px solid #C0C0C0;
	position: relative;
}
.product_img{
	width: 150rpx;
	height: 150rpx;	
	margin-left:10rpx;
}
.product_img image {
	 width: 150rpx;
	 height: 150rpx;	 
}

.product_content{
	width: 100%;
	padding: 20rpx;
}
.grid {
	width: 100%;
	font-size: 25rpx; 
	display: flex;	
	justify-content: space-between;
	margin-bottom: 3px;
	color: #acacacff;
}
.product_number{
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #cdcdcdff;
	border-radius: 5rpx;
	width: 150rpx;
	height: 38rpx;
	text-align: center;
	position: absolute;
	right: 20rpx;
	bottom: 10rpx;
}
.reduce{
	padding: 0 15rpx;
	height: 36rpx;
	line-height: 30rpx;
	border-right: 1px solid #cdcdcdff;
	color: #010101ff;
	font-weight: 500;
}
.add{
	padding: 0 15rpx;
	height: 36rpx;
	line-height: 33rpx;
	border-left: 1px solid #cdcdcdff;
	color: #010101ff;
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

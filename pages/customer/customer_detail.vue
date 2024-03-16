<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 80px);">
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_name.png')"></image>
			<view class="title">客户姓名</view>	
			<text class="iconfont">&#xe639;</text>
			<input  :focus='customerNameFocus'  @blur='customerNameFocus = false'  v-model="customer.customerName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户姓名">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_gender.png')"></image>
			<view class="title">客户性别</view>
			<text class="iconfont">&#xe639;</text>
			<view class="gender">			
				<radio-group class="radio-group" @change="radioChange">
				  <radio class="radio1" value = '1' color="#38c1b9">
					  <text class="radio-text" :style="{'color':customer.sex === '1'?'#fff':'#333'}">男</text>
				  </radio>
				  <radio class="radio2" value = '2' color="#38c1b9">
					  <text class="radio-text" :style="{'color':customer.sex === '2'?'#fff':'#333'}">女</text>
				  </radio>
				</radio-group>
			</view>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/customer_phone.png')"></image>
			<view class="title">客户电话</view>			
			<input  v-model="customer.phone" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>
			<view class="title">客户地址</view>
			<input  v-model="customer.address" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/degree.png')"></image>
			<view class="title">意向程度</view>
			<view class="starLen">
				<image class="star" @tap='changeStar(1)' :src="customer.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
				<image class="star" @tap='changeStar(2)' :src="customer.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
				<image class="star" @tap='changeStar(3)' :src="customer.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			</view>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/quoted_price.png')"></image>
			<text class="title">报价</text>
			<input v-model="customer.quotation" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入您向客户的报价">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/remark.png')"></image>
			<text class="title">备注</text>			
			<input v-model="customer.remark" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入备注" >
		</view>
		<view class="item" @click="arriveAdd()">
			<image class="img" :src="getImgUrl('static/image/cusomer/arrive.png')"></image>
			<text class="title">到店记录</text>
			<text class="iconfont arriveAdd">&#xe6f3;</text>
		</view>
		
		<view v-for="(item,index) in customer.listCustomerArrival" :id="item.id">
			<view class="arrive_container">
				<view class="arrive_content_line" >
					<text class="arrive_content_info">到店时间：{{item.arrivalTime}}</text>
					<text class="arrive_content_info">停留时间：{{item.arrivalLength}}分钟</text>
				</view>
				<view class="arrive_content_line">
					<text class="arrive_content_info" style="width: 100%;">到店记录：{{item.arrivalRecord}}</text>					
				</view>
			</view>
		</view>
		
		<view class="item" @click="trackAdd()">
			<image class="img" :src="getImgUrl('static/image/cusomer/track.png')"></image>
			<text class="title">跟踪记录</text>
			<text class="iconfont arriveAdd">&#xe6f3;</text>
		</view>
			
			
<!-- 	<view class="arrive"> -->

<!-- 	</view> -->
	
	<!-- <view class="arrive" style="border-bottom: 8px solid #efeef3ff;">	 -->	
		<view  v-for="(item,index) in customer.listCustomerTailAfter" :id="item.id">
			<view class="arrive_content_line1" >
				<text>{{item.arrivalTime}}</text>
				<text>{{item.arrivalLength}}分钟</text>
			</view>
			<view class="arrive_content_line2">
				<text>{{item.arrivalRecord}}</text>
			</view>
		</view>
	<!-- </view> -->
	
	<view class="product" v-for="(item, index) in customer.customerProducts">		
		<image  class="product_img" :src="getImgUrl('static/image/茶几.png')" mode=""></image>
		<view class="product_content">
			<view class="grid">
				<view class="info">品名：{{item.productName}}</view>
				<view class="info">型号：{{item.type}}</view>
			</view>
			<view class="grid">
				<view class="info">类别：{{item.productType}}</view>
				<view class="info">颜色：{{item.color}}</view>
				
			</view>
			 <view class="grid">
				 <view class="info">材质：{{item.texture}}</view>
				 <view class="info">尺寸：{{item.size}}</view>					
			</view>
			<view class="grid">
				<view class="info">产地：{{item.production}}</view>
				<view class="info" style="color: #e96225ff;">零售价：<text style="color: #e96225ff;">￥{{item.retailPrice}}</text></view>
			</view>
			<view class="grid">
				<view class="info"></view>
				<view class="product_number">
					<view class="reduce" @click="reduce(item)">-</view>
					<view>
						<input disabled="disabled" type="number" :value="item.number" @input="countVal">
					</view>
					<view class="add" @click="add(item)">+</view>
				</view>
			</view>
		</view>	
	</view>
			<!-- <view class="remove" @click="delData(item)">删除</view>					
	</view> -->

	<view class="add_img_total">
		<view class="add_img" @click="addCustomerProduct()">
			<image :src="getImgUrl('static/image/red_add.png')"></image>			
		</view>
		<view class="total">
			合计:{{productRetailPriceTotal}}
		</view>
	</view>
</scroll-view>
<!-- 	<view class="foot">
			<view class="track">跟踪</view>
			<view class="order">下单</view>
		</view> -->

<!--到店时间弹窗-->
<view>
	<view :hidden="arrivalHidden" class="popup_content">
		<view class="popup_title">{{addOrEditArrival}}</view>
		<view class="popup_item">
		   <text class="popup_item_title">到店时间</text>
		   <view class="popup_item_text">
				<view  @tap="toggle('arrival_date')" class="time" :style="{color:arrivalFormData.arrivalTime=='yyyy-MM-dd	'?'#a0a0a0':'#333'}">{{arrivalFormData.arrivalTime}}</view>
				<cPicker mode='date' @confirm="arrivalTimeHand" ref="arrival_date"></cPicker>
		   </view>
		</view>
		<view class="popup_item">
		   <text class="popup_item_title">停留时间</text>
		   <view class="popup_item_text">
			 <input v-model="arrivalFormData.arrivalLength" type="number"/>
		   </view>
		    <text class="minute">分钟</text>
		 
		</view>
		<view class="arrival_record">
			<textarea v-model="arrivalFormData.arrivalRecord" maxlength="200" placeholder="请输入到店记录" placeholder-class="textarea-placeholder"></textarea>
		</view>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelArrival()">取消</view>
			<view class="determine" @click="submitArrival()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="arrivalHidden" @click="hideDiv()"></view>
</view>

<!--跟踪记录弹窗-->
<view>
	<view :hidden="trackHidden" class="popup_content">
		<view class="popup_title">添加跟踪时间</view>
		<view class="popup_item">
		   <text class="popup_item_title">跟踪时间</text>
		   <view class="popup_item_text">			
			 <view  @click="tailAfterToggle('tail_after_date')" :style="{color:tailAfterFormData.arrivalTime=='yyyy-MM-dd'?'#a0a0a0':'#333'}">{{tailAfterFormData.arrivalTime}}</view>
			 <cPicker mode='date' @confirm="tailAfterTimeHand" ref='tail_after_date'></cPicker>
		   </view>
		</view> 
		<view class="popup_item">
		   <text class="popup_item_title">跟踪时长</text>
		   <view class="popup_item_text">
			 <input  v-model="tailAfterFormData.arrivalLength"  type="number" />				 
		   </view>
		   <text class="minute">分钟</text>
		</view>
		<view class="arrival_record">
			<textarea v-model="tailAfterFormData.arrivalRecord" maxlength="200" placeholder="请输入跟踪记录" placeholder-class="textarea-placeholder"></textarea>
		</view>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelTrack()">取消</view>
			<view class="determine" @click="submitTrack()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="trackHidden" @click="hideDiv()"></view>
</view>

</template>

<script>
	import cPicker from "../../components/c-picker/c-picker.vue"
	import {picker} from "../../components/mixins/picker.js"
	import {get,post} from "../../components/utils/request.js"
	export default {
		components: {
			cPicker
		},
		data() {
			 const currentDate = this.getDate({
				format: true
			})
			return {
				 total:1,
				 selectList: [{
				 		ll: "男",
				 		value: 1
				 	},
				 	{
				 		ll: "女",
				 		value: 2
				 	}
				 ],	
				fullStarUrl:'../../static/image/cusomer/star.png',
				nullStarUrl:'../../static/image/cusomer/empty.png',				
				//左滑默认宽度
				delBtnWidth: 80,
				//到店记录弹窗
				arrivalHidden:true,
				//跟踪记录
				trackHidden:true,				
				//客户数据
				customer:{},
				addOrEditArrival:'添加到店时间',
				arrivalFormData:{
					id:"",
					customerId:"",
					arrivalTime:currentDate,
					arrivalLength:"",
					arrivalRecord:"",
					arrivalType:"arrival"
				},
				tailAfterFormData:{
					id:"",
					customerId:"",
					arrivalTime:currentDate,
					arrivalLength:"",
					arrivalRecord:"",
					arrivalType:"arrival"
				},
				customerId:""//存放列表传来的意向客户id
			}
		},
		methods: {
			 getDate() {				
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//客户性别选择
			toggle(val) {				
				this.$refs[val].show();
			},
			tailAfterToggle(val) {				
				this.$refs[val].show();
			},
			hand(value) {
				this.gender = value.result							
			},
			arrivalTimeHand(value) {
				this.arrivalFormData.arrivalTime = value.result							
			},
			tailAfterTimeHand(value) {
				this.tailAfterFormData.arrivalTime = value.result							
			},
			//意向程度
			changeStar(val){
				this.customer.grade=val;
			},
			//开始触摸滑动
			drawStart(e) {
				var touch = e.touches[0];
				this.startX = touch.clientX;
			},
			//删除方法
			delData(item){
				let customerId=item.id;
				let that = this;
				uni.showModal({
					title: '提示',
					content: "确认移除意向产品？",
					success: function (res) {
					if (res.confirm) {
						post("customer/updateCustomerProductDelflag",{"id":customerId}).then(res =>{
							if(200 == res.code){
								that.customer.customerProducts = that.customer.customerProducts.filter((item) => {
								          return !customerId.includes(item.id)
								})								
								uni.showToast({
									title:'操作成功',
									icon:"none"
								})
							}else{
								uni.showToast({
									title:'操作失败',
									icon:"none"
								})
								uni.hideLoading();
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
					}
				});
			},
			reduce(item){
				if(item.number<=1){
					uni.showToast({						
						title:'数值不能小于1',
						icon:"none"
					})
					return;
				}
				post("customer/updateCustomerProductNumberReduce",{"id":item.id}).then(res =>{
					if(200 == res.code){
						item.number = item.number - 1;
						uni.hideLoading();
					}else{
						uni.showToast({
							title:'操作失败',
							icon:"none"
						})						
						uni.hideLoading();
					}
				})
			},
			add(item){				
				post("customer/updateCustomerProductNumberAdd",{"id":item.id}).then(res =>{
					if(200 == res.code){
						item.number = item.number + 1;
						uni.hideLoading();
					}else{
						uni.showToast({
							title:'操作失败',
							icon:"none"
						})			
						uni.hideLoading();
					}
				}) 
			},
			countVal(e){
				if(this.total == 0){
					this.total =1				
				}			
			},
			//到店记录跟踪记录弹窗遮罩	
			hideDiv(){
				this.arrivalHidden = true;
			},
			//提交到店记录
			submitArrival(){
				this.arrivalFormData.customerId = this.customer.id
				post("customer/insertCustomerArrival",this.arrivalFormData).then(res =>{
					if(200 == res.code){
						for(let key in this.arrivalFormData){
							this.arrivalFormData[key] = ''
						}						
						this.arrivalFormData['arrivalTime'] = this.getDate({
							format: true
						})
						uni.hideLoading();
						uni.showToast({
							title: '添加到店记录成功',
							icon: 'none',
							duration: 2000
						})
						this.arrivalHidden = true;
						this.getList()
					}
				})
			},
			//添加到店记录
			arriveAdd(){
				this.arrivalHidden = false;
			},
			cancelArrival(){
				this.arrivalHidden = true;
			},	
			//添加跟踪记录
			trackAdd(){
				this.trackHidden = false;
			},
			cancelTrack(){
				this.trackHidden = true;
			},
			//提交跟踪记录 
			submitTrack(){
				this.tailAfterFormData.customerId = this.customer.id
				post("customer/insertCustomerTailAfter",this.tailAfterFormData).then(res =>{
					if(200 == res.code){
						for(let key in this.tailAfterFormData){
							this.tailAfterFormData[key] = ''
						}						
						this.tailAfterFormData['arrivalTime'] = this.getDate({
							format: true
						})
						uni.hideLoading();
						uni.showToast({
							title: '添加到店记录成功',
							icon: 'none',
							duration: 2000
						})
						this.trackHidden = true;
						this.getList()
					}
				})
			},
			getList(){
				post("customer/selectCustomerById",{"id":this.customerId}).then(res =>{
					if(200 == res.code){
						this.customer = res.data
						uni.hideLoading();
					}
				}) 
			},
			addCustomerProduct(){
				let that = this
				uni.navigateTo({
					url:'/pages/cusomer/customer_product?customerId='+this.customerId
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
			let url = location.href;
			this.customerId = url.substr(url.indexOf('?') + 1).split("=")[1]; //截取?后面的内容作为字符串
			post("customer/selectCustomerById",{"id":this.customerId}).then(res =>{
				if(200 == res.code){
					this.customer = res.data;
				}
			}) 
		},
		computed:{
			productRetailPriceTotal(){
				 let productRetailPriceTotal = 0;		  
				 if(typeof(this.customer.customerProducts) !="undefined"){
					for(let i= 0 ;i< this.customer.customerProducts.length; i++) {
						productRetailPriceTotal += this.customer.customerProducts[i].retailPrice;
					}
				 }
				return productRetailPriceTotal;
			}
		}
	}
</script>

<style>
@import "../../static/icon/iconfont.css";
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}

.item{
	display: flex;	
	padding: 10px 0 5px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .img{
	padding-left: 10px;
	width: 20px;
	height: 20px;	
}
.item .title{
	font-size: 15px;
	color: #333;
	margin-left: 10px;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	color: red;	
	font-size: 12px;
	margin-left: -5px;
}
.item input{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item .arriveAdd{
	color: #00a7e2ff;
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	font-size: 20px;
}
.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
	text-rendering: optimizeLegibility;
}

.starLen{
	display: flex;
	margin-left: auto;
}
.star{
	width: 17px;
	height: 17px;
	margin: 0 17px;
}

/* 客户性别 */
.gender{
	margin-left: auto;
	padding-right: 15px;
}
 /deep/ .gender .radio-group svg {
	display: none  !important;
}
/deep/ .gender .uni-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
	border-color: #38c1b9;
}
.gender .radio-group .radio1,.radio2{
	position: relative !important;
}
/deep/.gender .radio-group .radio1 .uni-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
 /deep/ .gender .radio-group .radio2  .uni-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
.radio-text{
	position: absolute;
	left: 20px;
	top: 2px;
	font-size: 12px;	
	line-height: 25px;	
}
/*适用于 微信小程序*/
.gender .wx-radio-input {
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
}

.gender .wx-radio-input.wx-radio-input-checked::before{
 font-size:0; /* 对勾大小 */
}

.arrive_container{	
	border-bottom: 2px solid #efeef3ff;
	padding: 10px 10px 0 10px;
	
}
.arrive_content_line{
	font-size: 30px;
	color: #333;
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
}
.arrive_content_info{
	width: 50%;
	color: #030303ff;
	font-size: 15px; 
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
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
    width: 100%;   
    border-bottom: 1px solid #C0C0C0;
}
.product_img{
	width: 170rpx;
	height: 170rpx;	
	margin:10rpx 10rpx 15rpx 10rpx;
}
.product_img image {
	 width: 170rpx;
	 height: 170rpx;	 
}

.product_content{
	width: 100%;
	margin-top: 6rpx;
}
.grid {	
	font-size: 25rpx; 
	display: flex;
	
}
 .info{
	width: 50%;
	color: #acacacff;
	white-space: nowrap;
}
.product_number{
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #cdcdcdff;
	border-radius: 5rpx;
	width: 40%;
	text-align: center;
	margin-top: 5px;
}
.reduce{
	padding: 0 25rpx;
	height: 36rpx;
	line-height: 30rpx;
	border-right: 1px solid #cdcdcdff;
	color: #010101ff;
	font-weight: 500;
}
.add{
	padding: 0 25rpx;
	height: 36rpx;
	line-height: 33rpx;
	border-left: 1px solid #cdcdcdff;
	color: #010101ff;
}
.product_number input{
	font-size: 26rpx;	
}
.add_img_total{
	display: flex;
	justify-content: space-between;
}
.add_img {
   border: 1px solid #CCCCCC;    
   width: 40px;
   height: 40px;
   text-align: center;
   margin-top: 10px;
   margin-left: 10px;
}
.add_img image {
   width: 35px;
   height: 35px;
   margin-top: 3px; 
	
}
.total{
	padding-right: 20px;
	padding-top: 20px;
	font-size: 20px;
	color: #666666ff;
}
.foot {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
    height: 100rpx;
	color: #00A7E2;	
    border-top: 1px solid #CCCCCC;
	border-bottom: 1px solid #CCCCCC;
    font-size: 20rpx;
	display: flex;	
	text-align: center;	
}
.track{
	font-size: 35rpx;	
	width: 50%;
	height: 100rpx;
	line-height: 100rpx;
	border-right: 1px solid #CCCCCC;
}
.order{
	font-size: 35rpx;
	width: 50%;	
	height: 100rpx;
	line-height: 100rpx;
}


/**
 * 遮罩层 到店时间弹窗
 */
.popup_overlay {
	 position: fixed;
	 top: 0%;
	 left: 0%;
	 width: 100%;
	 height: 100%;
	 background-color: #b3b3b3ff;
	 z-index: 1001;
	 -moz-opacity: 0.8;
	 opacity: .80;
	 filter: alpha(opacity=88);
 }
 .popup_content {
	 position: fixed;
	 top: 50%;
	 left: 50%;
	 width: 350px;
	 height: 300px;
	 margin-left: -175px;
	 margin-top: -150px;
	 border-radius: 20rpx;
	 background-color: white;
	 z-index: 1002;
	 overflow: auto;
 }

 .popup_title {	 
	 font-size: 18px;	 
	 text-align: center;
	 margin: 15px 0;
 }

 .popup_item {
	 display: flex;	
	 margin: 10px 15px;
 }
 .popup_item_title{
	white-space: nowrap;
	font-size: 15px;
	color: #070707ff;
 }
.popup_item_text{
	border-bottom: 1px solid #f1f1f1ff;
	flex-grow: 1;
	text-align: center;
	white-space: nowrap;
}
.popup_item_text input{
	font-size: 15px;
	color: #070707ff;
}
.input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #f1f1f1ff;	
	margin-right: 8px;
}
.minute{
	font-size: 15px;
	color: #070707ff;
	white-space: nowrap;
}
.arrival_record{
	margin: 0 15px;
	padding:10px;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}
.remark_text{
	width: 350px;
	height: 150px;	
	margin: 0 auto;
	margin-top: 10px;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
	padding:20rpx;
	
}
.arrival_record textarea{
	 height: 100px;
	 width: 300px;
}
.textarea-placeholder{
	font-size: 15px;
	text-align: left;
	color: #aaa;	
}

.arrival_foot {
	width: 350px;
	position: absolute;
	bottom: 0;
	left: 0;
    height: 40px;
	line-height: 40px;
	color: #070707ff;
	font-size: 15px;
	display: flex;
    border-top: 1px solid #f1f1f1ff;
}
.cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
}
.determine{	
	text-align: center;
	width: 50%;
}
</style>
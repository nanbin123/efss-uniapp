<template>
	<view style="position: relative;width: 100%;height: 100%;">
		<view class="item cusomer_name">
			<image class="img" src="../../static/image/cusomer/cusomer_name_add.png"></image>
			<view class="title">客户姓名</view>
			<view class="content">
				<input  v-model="customer.customerName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/cusomer_gender.png"></image>
			<view class="title">客户性别</view>
			<view class="gender">			
				<radio-group class="radio-group" @change="radioChange">
				  <radio class="radio1" value = '1' color="#38c1b9">
					  <text class="radio-text" :style="{'color':customer.sex === '1'?'#fff':'#333'}">男</text><!-- color:#38c1b9; -->
				  </radio>
				  <radio class="radio2" value = '2' color="#38c1b9">
					  <text class="radio-text" :style="{'color':customer.sex === '2'?'#fff':'#333'}">女</text>
				  </radio>
				</radio-group>
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/customer_phone.png"></image>
			<view class="title">客户电话</view>
			<view class="content">
				<input  v-model="customer.phone" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入电话">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/cusomer_address.png"></image>
			<view class="title">客户地址</view>
			<view class="content">
				<input  v-model="customer.address" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入地址">
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/degree.png"></image>
			<view class="title">意向程度</view>
			<view class="content starLen">
				<image class="star" @tap='changeStar(1)' :src="customer.grade>0?fullStarUrl:nullStarUrl"></image>
				<image class="star" @tap='changeStar(2)' :src="customer.grade>1?fullStarUrl:nullStarUrl"></image>
				<image class="star" @tap='changeStar(3)' :src="customer.grade>2?fullStarUrl:nullStarUrl"></image>
			</view>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/cusomer/quoted_price.png" mode=""></image>
			<text class="title">报价:</text>
			<view class="content">
				<input v-model="customer.quotation" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入报价">
			</view>
		</view>
<!-- 		<view class="remarks">
			<textarea v-model="customer.remark" maxlength="200" placeholder="请输入备注:" placeholder-class="textarea-placeholder" @input="handInput"></textarea>
			<label for="forFocus" class="textarea-count ">{{textateaL}}/{{maxlength}}</label>
		</view> -->
		<view class="item remarks" @click="remarksAddOrEdit()">
			<image class="img" src="../../static/image/cusomer/arrive.png" mode=""></image>
			<text class="title">备注:</text>	
			<view class="content">
				<input v-model="customer.remark" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入备注" >
			</view>
		</view>
		<view class="product-content">
			<view class="product-count">
				<view  class="product-total-number">货品数量:({{productNumberTotal}})</view>
				<view  class="product-retail-price">总计金额:¥{{productRetailPriceTotal}}</view>
			</view>
		<view class="product"  v-for="(item,index) in customer.customerProducts" :key="index">
				<view class="left">
					<image class="left_img" src="../../static/image/茶几.png" mode=""></image>
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
					<view class="grid">
						<text class="info">数量：{{item.number}}</text>	
					</view>	
				</view> 
			</view>
		</view>
		
		<view class="add_img" @click="addCustomerProduct()">
			<image src="../../static/image/red_add.png" mode=""></image>
			<view>点击添加产品</view>
		</view>
		
		<view class="btn" @click="addCustomer()">
			<button>保存</button>
		</view>
	</view>
	
	<!--备注弹窗-->
	<view>
		<view :hidden="remarkHidden" class="remark_content">
			<textarea v-model="customer.remark" class="remark_text" maxlength="200" placeholder="请输入备注" placeholder-class="textarea-placeholder"></textarea>
			<view class="arrival_foot">
				<view class="cancel" @click="cancelRemark()">取消</view>
				<view class="determine" @click="submitRemark()">确定</view>
			</view>
		</view>
		<view class="popup_overlay" :hidden="remarkHidden" @click="hideRemark()"></view>
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				fullStarUrl:'../../static/image/cusomer/star.png',
				nullStarUrl:'../../static/image/cusomer/empty.png',
				score:0,
				textateaL: 0,
				maxlength:200,				
				selectList: [{
						ll: "男",
						value: 1
					},
					{
						ll: "女",
						value: 2
					}
				],
				//客户数据
				customer:{					
					grade:'1'
				},				
				//备注弹窗
				remarkHidden:true,
				//列表数据，可根据自己的业务获取
				csListArrl:[{
					
				}]
			}
		},
		methods: {
			//意向程度
			changeStar(val){
				this.customer.grade=val;
			},
/* 			//备注
			handInput(value) {
				let val = value.detail.value;
				this.textateaL = val.length;
			}, */
			//备注弹窗
			remarksAddOrEdit(){
				this.remarkHidden = false;
			},
			cancelRemark(){
				this.remarkHidden = true;
			},
			submitRemark(){
				this.remarkHidden = true;
			},
			hideRemark(){
				this.remarkHidden = true;
			},
			addCustomer(){
				let customerObj=JSON.parse(JSON.stringify(this.customer));
				delete customerObj.customerProducts
				post("customer/addUpdateCustomer",customerObj).then(res =>{
 					if(200 == res.code){
						uni.hideLoading();
						uni.showToast({
							title: '添加意向客户成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			getList(){
				let that = this;
				post("customer/selectAddCustomerById",{"id":that.customer.id}).then(res =>{
					if(200 == res.code){
						that.customer.customerProducts = res.data.customerProducts
						uni.hideLoading();
					}
				}) 
			},
			addCustomerProduct(){
				let that = this
				uni.navigateTo({
					url:'/pages/cusomer/customer_product?customerId='+that.customer.id
				})
			},
			radioChange(evt){
				this.customer.sex = evt.detail.value;
			}
		},
		onLoad(option) {
			post("customer/insertAddCustomer").then(res =>{
				if(200 == res.code){
					this.customer.id = res.data
					uni.hideLoading();
				}
			})
		},
		computed:{
			productRetailPriceTotal(){
				 let productRetailPriceTotal = 0;		  
				 if(typeof(this.customer.customerProducts) !="undefined"){
					for(let i= 0 ;i< this.customer.customerProducts.length; i++) {
						productRetailPriceTotal += parseFloat(this.customer.customerProducts[i].retailPrice) * parseFloat(this.customer.customerProducts[i].number);
					}
				 }
				return productRetailPriceTotal;
			},
			productNumberTotal(){
				 let productNumberTotal = 0;		  
				 if(typeof(this.customer.customerProducts) !="undefined"){
					for(let i= 0 ;i< this.customer.customerProducts.length; i++) {
						productNumberTotal += parseFloat(this.customer.customerProducts[i].number);
					}
				 }
				return productNumberTotal;
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
.gender{
	margin-left: auto;
	padding-right: 30px;
}
/deep/ .gender .radio-group .uni-radio-wrapper svg {
	display: none;
}
/deep/ .gender .uni-radio-wrapper{
	position: relative;
}	
/deep/ .gender .uni-radio-wrapper .uni-radio-input {
	border-radius: 0;
	width: 70px;
	height: 30px;
	margin-right:0;
}
/deep/ .gender .radio-group .radio1 .uni-radio-wrapper .uni-radio-input {
	border-right: 0 !important;
	border-top-left-radius: 8%;
	border-bottom-left-radius:8%
}
/deep/ .gender .radio-group .radio2 .uni-radio-wrapper .uni-radio-input {	
	border-top-right-radius: 8%;
	border-bottom-right-radius:8%
}
.radio-text{
	position: absolute;
	left: 20px;
	font-size: 20px;	
	line-height: 25px;
}

.input-placeholder{
	font-size: 22px;
	text-align: right;
	color: #aaa;
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
	min-width: 0;
	border-bottom: 8px solid #efeef3ff;
}

/* .remarks{
	overflow: hidden;
	position: relative;
	border-top: 5px solid #efeef4ff;
	border-bottom: 1px solid #f1f1f1ff;	
	padding: 30rpx;
}

.remarks textarea {
	height: 100rpx;	
	width: 100%;	
	font-size: 40rpx;
	color: #333;
} */
.textarea-count {
	position: absolute;
	font-size: 24rpx;
	line-height: 32rpx;
	bottom: 10rpx;
	right: 0px;
	color: #999;
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
 /* 备注弹窗 */
 .remark_content{
 	 position: fixed;
 	 top: 50%;
 	 left: 50%;
 	 width: 510rpx;
 	 height: 350rpx;
 	 margin-left: -255rpx;
 	 margin-top: -275rpx;
 	 border-radius: 20rpx;
 	 background-color: white;
 	 z-index: 1002;
 	 overflow: auto;
 }
 .remark_text{
 	width: 390rpx;
 	height: 190rpx;	
 	margin: 0 auto;
 	margin-top: 32rpx;
 	border:1px solid #f1f1f1ff;
 	border-radius: 5px;
 	padding:10rpx;
 }
 .arrival_foot {
 	width: 500rpx;
 	position: absolute;
 	bottom: 0;
 	left: 0;
     height: 60rpx;
 	line-height: 60rpx;
 	color: #070707ff;
 	font-size: 30rpx;
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
 /**
  * 遮罩层
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
.textarea-placeholder{
	font-size: 28rpx;
	text-align: left;
	color: #aaa;	
}

.product-count{
	display: flex;
	justify-content: space-between;
	padding: 10px 50px;
	border-bottom: 2px solid #efeef3ff;
	margin-bottom: 5px;
}
.product{
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 10rpx;
	margin-bottom: 15rpx;
}
.left{
	width: 70px;
	height: 70px;	
}
.left_img {
	width: 70px;
	height: 70px;
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
   font-size: 15px;
   white-space: nowrap;  
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

.add_img {
    border: 1px solid #CCCCCC;    
    width: 75px;
	height: 75px;
    margin-top: 5px;
    margin-left: 5px;
	text-align: center;
	margin-left: auto;
	margin-right: 20px;
}
.add_img image {
    width: 50px;
    height: 50px;
	margin-top: 3px; 
	
}
.add_img view {   
    color: #e96225ff;
    font-size: 6px;
    text-align: center;
}


</style>

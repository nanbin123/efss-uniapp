<template>	
	<view class="head"></view>	
	<scroll-view scroll-y style="height: calc(100vh - 41px);">
		<view class="item">
			<image class="img" style="width: 19px;" :src="getImgUrl('static/image/cusomer/cusomer_name.png')"></image>
			<view class="title">客户姓名</view>	
			<text class="iconfont">&#xe639;</text>
			<input :focus='customerNameFocus'  @blur='customerNameFocus = false'  v-model="customer.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户姓名'">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_gender.png')"></image>
			<view class="title">客户性别</view>
			<text class="iconfont">&#xe639;</text>
			<view class="gender">
				<radio-group class="radio-group"  @change="radioChange">
				  <radio class="radio1" color="#38c1b9"  :disabled="isEditable" :style="{'background-color':customer.sex === '1'?'#38c1b9':'#fff'}" value = '1' :checked="customer.sex === '1'">
					  <text class="radio-text"  :style="{'color':customer.sex === '1'?'#fff':'#333'}">男</text>
				  </radio>
				  <radio class="radio2"  :disabled="isEditable" color="#38c1b9" :style="{'background-color':customer.sex === '2'?'#38c1b9':'#fff'}" value = '2' :checked="customer.sex === '2'">
					  <text class="radio-text" :style="{'color':customer.sex === '2'?'#fff':'#333'}">女</text>
				  </radio>
				</radio-group>
			</view>
		</view>
		<view class="item">
			<image class="img" style="margin-top: 3px;" :src="getImgUrl('static/image/cusomer/customer_phone.png')"></image>
			<view class="title">客户电话</view>
			<input :focus='phoneFocus' @blur="checkPhone"  v-model="customer.phone" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>
			<view class="title">客户地址</view>
			<input  v-model="customer.address" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
		</view>
		<view class="item">
			<image class="img" style="margin-top: 3px;" :src="getImgUrl('static/image/cusomer/degree.png')"></image>
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
			<input v-model="customer.quotation" :disabled="isEditable" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入您向客户的报价">
		</view>
		<view class="item">
			<image class="img" style="margin-top: 1px;" :src="getImgUrl('static/image/cusomer/remark.png')"></image>
			<text class="title">备注</text>			
			<input v-model="customer.remark" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入备注" >
		</view>
		<view class="item" @click="arriveAdd()" style="border-bottom: 0;">
			<image class="img" style="margin-top: 2px;" :src="getImgUrl('static/image/cusomer/arrive.png')"></image>
			<text class="title">到店记录</text>
			<image class="arriveAdd" :src="getImgUrl('static/image/add.png')"></image>
		</view>
		
		<view v-for="(item,index) in customer.listCustomerArrival" :id="item.id">
			<view class="arrive_container">
				<view class="arrive_content_line" @click="editCustomerArrival(item)">
					<text class="arrive_content_info">到店时间：{{item.arrivalTime}}</text>
					<text class="arrive_content_info">停留时间：{{item.arrivalLength}}分钟</text>
				</view>
				<view class="arrive_content_line">
					<text class="arrive_content_info" style="width: 100%;">到店记录：{{item.arrivalRecord}}</text>					
				</view>
				<view class="removeArrive" @click.stop="deleteCustomerArrival(item.id)" v-show="!isEditable">
					<i class="iconfont">&#xe612;</i>
				</view>
			</view>
		</view>
		
		<view class="item" @click="trackAdd()" style="border-bottom: 0;">
			<image class="img" :src="getImgUrl('static/image/cusomer/track.png')"></image>
			<text class="title">跟踪记录</text>		
			<image class="arriveAdd" :src="getImgUrl('static/image/add.png')"></image>
		</view>
		
		<view  v-for="(item,index) in customer.listCustomerTailAfter" :id="item.id">
			<view class="arrive_container" @click="editCustomerTailAfter(item)">
				<view class="arrive_content_line" >
					<text  class="arrive_content_info">跟踪时间:{{item.arrivalTime}}</text>
					<text  class="arrive_content_info">跟踪时长:{{item.arrivalLength}}分钟</text>
				</view>
				<view class="arrive_content_line">
					<text class="arrive_content_info" style="width: 100%;">跟踪记录:{{item.arrivalRecord}}</text>
				</view>
				<view class="removeFollowing" @click.stop="deleteCustomerTailAfter(item.id)" v-show="!isEditable">
					<i class="iconfont">&#xe612;</i>
				</view>
			</view>
			
		</view>
	
	<view class="item"  @click="addCustomerProduct()" style="border-bottom: 0;">
		<image class="img" :src="getImgUrl('static/image/cusomer/customer_product.png')"></image>
		<text class="title">预购产品</text>		
		<image class="arriveAdd" :src="getImgUrl('static/image/add.png')"></image>
	</view>
	
	<view class="product" v-for="(item, index) in customer.customerProducts">		
		<image  class="product_img" :src="getImgUrl('static/image/茶几.png')"></image>
		<view class="product-content">
			<view class="grid">
				<view class="info">品名：{{item.productName}}</view>
				<view class="info">型号：{{item.type}}</view>
			</view>
			<view class="grid">
				 <view class="info">尺寸：{{item.size}}</view>
				 <view class="info">产地：{{item.production}}</view>				
			</view>
			 <view class="grid">
			    <view class="info">材质：{{item.texture}}</view>
				<view class="info">颜色：{{item.color}}</view>				
			</view>
			<view class="grid">
				<text class="info" style="color: #e96225ff;">数量：<text >￥{{item.number}}</text></text>	
				<view class="info" style="color: #e96225ff;">零售价：<text style="color: #e96225ff;">￥{{item.retailPrice}}</text></view>
			</view>
		</view>	
		<view class="remove" @click="deleteProduct(item.productId)" v-show="!isEditable">
			<i class="iconfont">&#xe612;</i>
		</view>
	</view>

</scroll-view>
	<view class="bottom-bar">
		  <text class="delete" @click="deleteCustomerForm()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		  <view class="transferOrder" @click="transferOrder()" v-if="isEditable == true">转订单</view>
		  <text class="edit"  @click="editCustomerForm()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>


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
		<view class="popup_title">{{addOrEditArrival}}</view>
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
	import useCustomerStore from '@/store/modules/customer.js'
	import useTransferOrderStore from '@/store/modules/transfer_order.js'
	export default {
		components: {
			cPicker
		},
		data() {
			 const currentDate = this.getDate({
				format: true
			})
			return {
				isEditable: true,				
				fullStarUrl:'static/image/cusomer/star.png',
				nullStarUrl:'static/image/cusomer/empty.png',			
				//到店记录弹窗
				arrivalHidden:true,
				//跟踪记录
				trackHidden:true,				
				customer:{customerProducts:[],listCustomerArrival:[],listCustomerTailAfter:[]},//客户数据
				addOrEditArrival:'',
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
					arrivalType:"tailafter"
				},
				customerId:"",//存放列表传来的意向客户id
				customerNameFocus:true,
				phoneFocus:false
			}
		},
		setup() {
			const customerStore = useCustomerStore();	
			const transferOrderStore = useTransferOrderStore();
			return { customerStore,transferOrderStore } 
		 },
		methods: {
			// 校验电话号码
			checkPhone() {
			  this.phoneFocus = false
			  const reg = /^(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})$/;
			  this.phoneError = !reg.test(this.customer.phone);		  
			  if (this.phoneError) {
				uni.showToast({
				  title: '请输入有效的电话号码',
				  icon: 'none'
				});
			  }
			},	
			//移除指定产品
			deleteProduct(productId){
				let customerProducts = this.customer.customerProducts;
				this.customer.customerProducts = customerProducts.filter(obj => obj.productId != productId);				
			},
			//移除指定跟踪记录
			deleteCustomerTailAfter(id){
				let customerTailAfters = this.customer.listCustomerTailAfter;
				this.customer.listCustomerTailAfter = customerTailAfters.filter(obj => obj.id != id);				
			},
			//移除指定到店记录
			deleteCustomerArrival(id){
				let customerarrivals = this.customer.listCustomerArrival;
				this.customer.listCustomerArrival = customerarrivals.filter(obj => obj.id != id);				
			},
			editCustomerForm(){
				if(this.isEditable == true){
					this.isEditable = false					
				}else if(this.isEditable == false){
					if(!this.customer.customerName){
						 this.$nextTick(() => {
							   this.customerNameFocus = true
						 })
						uni.showToast({
							title: '客户姓名不能为空',
							icon: 'none'
						});
						return
					}
					if(!this.customer.sex){
						uni.showToast({
							title: '请选择客户性别',
							icon: 'none'
						});
						return
					}			
					if(!this.customer.phone){
						 this.$nextTick(() => {
							   this.phoneFocus = true
						 })				
						uni.showToast({
							title: '客户电话不能为空',
							icon: 'none'
						});
						return;
					}else if (this.phoneError) {
						uni.showToast({
						  title: '请输入有效的电话号码',
						  icon: 'none'
						});
						return;
					}
					
					let customerForm=JSON.parse(JSON.stringify(this.customer));
					let customerProductList = customerForm.customerProducts.map(item =>{
						return {productId: item.productId,number:item.number}
					});	
					customerForm.customerProducts = customerProductList;					
					post("customer/updateCustomerById",JSON.stringify(this.customer),'application/json').then(res =>{
						if(200 == res.code){
							this.isEditable = true
							uni.showToast({
							  title: '修改客户成功',
							  icon: 'none', 
							  duration: 2000 
							});
						}
					})
				}
			},
			//客户性别点击触发事件
			radioChange(evt){
				this.customer.sex = evt.detail.value; 
			},
			deleteCustomerForm(){
				let that = this
				if(this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除客户吗？',
					  success: (res)=> {
					    if (res.confirm) {
							post("customer/deleteCustomerById",{"id":that.customer.id}).then(res =>{
								if(200 == res.code){
									this.isEditable = true;
									that.customer ={};
									uni.showToast({
									  title: '删除客户成功',
									  icon: 'none', 
									  duration: 2000 
									});
								}
							})
					    }
					  }
					});
				}else if(this.isEditable == false){
					this.isEditable = true
				}
			},
			getDate() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//时间选择
			toggle(val) {				
				this.$refs[val].show();
			},
			tailAfterToggle(val) {				
				this.$refs[val].show();
			},
			arrivalTimeHand(value) {
				this.arrivalFormData.arrivalTime = value.result							
			},
			tailAfterTimeHand(value) {
				this.tailAfterFormData.arrivalTime = value.result							
			},
			//意向程度
			changeStar(val){
				if(this.isEditable == false){
					this.customer.grade=val;
				}
			},
			//到店记录跟踪记录弹窗遮罩	
			hideDiv(){
				this.arrivalHidden = true;
			},
			guid() {
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			        var r = Math.random() * 16 | 0,
			            v = c == 'x' ? r : (r & 0x3 | 0x8);
			        return v.toString(16);
			    });
			},
			//提交到店记录
			submitArrival(){
				let arrivalFormData=JSON.parse(JSON.stringify(this.arrivalFormData));
				arrivalFormData.customerId = this.customer.id;
				this.arrivalHidden = true;
				let listCustomerArrival = this.customer.listCustomerArrival;
				//添加
				if("添加到店记录"==this.addOrEditArrival){
					arrivalFormData.id = this.guid();
					listCustomerArrival.unshift(arrivalFormData);					
				}else if("修改到店记录"==this.addOrEditArrival){					
					this.customer.listCustomerArrival = listCustomerArrival.map(item => (item.id == arrivalFormData.id ? arrivalFormData : item));
				}
				//清空对象
				let that = this;
				Object.keys(this.arrivalFormData).forEach(function(key){
					if(key!="arrivalTime" && key!="arrivalType"){
						that.arrivalFormData[key]=""
					}
				})
				this.arrivalFormData.arrivalTime = this.getDate();
				
			},
			//添加到店记录
			arriveAdd(){
				if(this.isEditable == false){
					this.addOrEditArrival ="添加到店记录"
					this.arrivalHidden = false;
				}
			},
			cancelArrival(){
				this.arrivalHidden = true;
				//清空对象
				let that = this;
				Object.keys(this.arrivalFormData).forEach(function(key){
					if(key!="arrivalTime" && key!="arrivalType"){
						that.arrivalFormData[key]=""
					}
				})
				this.arrivalFormData.arrivalTime = this.getDate();
			},
			//修改到店记录
			editCustomerArrival(item){
				 this.addOrEditArrival ="修改到店记录"
				 if(this.isEditable == false){
					this.arrivalHidden = false;	
					this.arrivalFormData.id = item.id;
					this.arrivalFormData.customerId = item.customerId;
					this.arrivalFormData.arrivalTime = item.arrivalTime;
					this.arrivalFormData.arrivalLength = item.arrivalLength;
					this.arrivalFormData.arrivalRecord = item.arrivalRecord;
				}
			},
			//添加跟踪记录
			trackAdd(){
				if(this.isEditable == false){
					this.trackHidden = false;
					this.addOrEditArrival ="添加跟踪记录"
				}				
			},
			cancelTrack(){
				this.trackHidden = true;
				//清空表单
				let that = this;
				Object.keys(this.tailAfterFormData).forEach(function(key){
					if(key!="arrivalTime" && key!="arrivalType"){
						that.tailAfterFormData[key]=""
					}
				})
				this.tailAfterFormData.arrivalTime = this.getDate();
			},
			//提交跟踪记录 
			submitTrack(){
				let tailAfterFormData=JSON.parse(JSON.stringify(this.tailAfterFormData));
				tailAfterFormData.customerId = this.customer.id							
				this.trackHidden = true;
				//添加
				let  listCustomerTailAfter = this.customer.listCustomerTailAfter;
				if("添加跟踪记录"==this.addOrEditArrival){
					tailAfterFormData.id = this.guid();
					listCustomerTailAfter.unshift(tailAfterFormData);						
				}else if("修改跟踪记录"==this.addOrEditArrival){					
					this.customer.listCustomerTailAfter = listCustomerTailAfter.map(item => (item.id == tailAfterFormData.id ? tailAfterFormData : item));
				}
				//清空表单
				let that = this;
				Object.keys(this.tailAfterFormData).forEach(function(key){
					if(key!="arrivalTime" && key!="arrivalType"){
						that.tailAfterFormData[key]=""
					}
				})
				this.tailAfterFormData.arrivalTime = this.getDate();
			},
			editCustomerTailAfter(item){
				this.addOrEditArrival ="修改跟踪记录"
				 if(this.isEditable == false){
					this.trackHidden = false;	
					this.tailAfterFormData.id = item.id;
					this.tailAfterFormData.customerId = item.customerId;
					this.tailAfterFormData.arrivalTime = item.arrivalTime;
					this.tailAfterFormData.arrivalLength = item.arrivalLength;
					this.tailAfterFormData.arrivalRecord = item.arrivalRecord;
				}
			},
			getCustomerProduct(){
				let customerProducts = this.customer.customerProducts; // 新增页面产品信息
				let products = this.customerStore.products; // 产品选择页面带过来的数据			
				for (let i = 0; i < products.length; i++) {
					let foundMatch = false;
					for (let j = 0; j < customerProducts.length; j++) {
						if (customerProducts[j].productId === products[i].productId) {
							customerProducts[j].number = products[i].number;
							foundMatch = true;
							break;
						}
					}
					if (!foundMatch) {
						customerProducts.unshift(products[i]);
					}
				}
			},
			addCustomerProduct(){
				if(this.isEditable == false){
					let arrProduct = this.customer.customerProducts;
					this.customerStore.addProduct(arrProduct);
					uni.navigateTo({
						url:'/pages/customer/customer_product'
					})
				}
			},
			/**
			 * 转订单
			 */
			transferOrder(){
				let customerForm = new Object();
				customerForm.customerName = this.customer.customerName;
				customerForm.sex = this.customer.sex;
				customerForm.phone = this.customer.phone;
				customerForm.address = this.customer.address;
				customerForm.id = this.customer.id;
				customerForm.customerProducts = this.customer.customerProducts;
				this.transferOrderStore.addCustomer(customerForm);
				if(this.isEditable == true){
					uni.navigateTo({
						url:'/pages/order/order_add'
					})
				}
			},
			
			
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},

		watch: {

		},
		onLoad(option) {
			this.customerId = option.id;
			post("customer/selectCustomerById",{"id":this.customerId}).then(res =>{
				if(200 == res.code){
					this.customer = res.data;				
				}
			}) 
		},
		computed:{
		
		},
	}
</script>

<style>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;	
}

.item{
	display: flex;	
	padding: 8px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;	
}
.item .title{
	margin-left: 1px;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	color:red;
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
.arriveAdd{
	width: 25px;
	height: 25px;
	position: absolute;
	right: 10px;
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
	border-color: #38c1b9 !important;
}
/deep/ .gender .radio-group .radio1,.radio2{
	position: relative !important;
}
/deep/.gender .radio-group .radio1 {
	border-top-left-radius: 8%;
	border-bottom-left-radius:8%;
}
 /deep/ .gender .radio-group .radio2{
	 border-top-right-radius: 8%;
	 border-bottom-right-radius:8% ;
 }
/deep/.gender .radio-group .radio1 .uni-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
 /deep/ .gender .radio-group .radio2 .uni-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
/deep/ .gender .uni-radio-input-disabled{
	background-color: transparent !important;
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
	border-color: #38c1b9 !important;
}
.gender .radio-group .radio1 .wx-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
.gender .radio-group .radio2 .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
.gender .wx-radio-input-disabled{
	background-color: transparent !important;
}
.gender .wx-radio-input.wx-radio-input-checked::before{
 font-size:0; /* 对勾大小 */
}

.arrive_container{
	position: relative;
	border-bottom: 1px solid #efeef3ff;
	padding: 10px 10px 0 10px;
	
}
.arrive_content_line{
	font-size: 30px;
	color: #333;
	display: flex;
	line-height: 14px;
	
}
.arrive_content_info{
	width: 50%;
	color: #030303ff;
	font-size: 15px; 
	padding-bottom: 10px;
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}


.product{
	position: relative;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 5px;
}
.product_img{
	width: 80px;
	height: 80px; 
}
.product-content{
	flex: 1;
	margin-left: 5px;
}
.grid {	
 	display: flex;
 	line-height: 20px;
}
.info {
  width: 50%;
  color: #030303ff;
  font-size: 14px;
  color: #333;
  white-space: nowrap;  
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  text-rendering: optimizeLegibility;
}
.remove{
	position: absolute;
	right: 10px;
}
.remove .iconfont{
	color: #38c1b9;
	font-size: 20px;
}
.removeFollowing{
	position: absolute;
	right: 12px;
	top: 8px;
}
.removeFollowing .iconfont{
	color: #38c1b9;	
	font-size: 20px;
}
.removeArrive{
	position: absolute;
	right: 12px;
	top: 8px;
}
.removeArrive .iconfont{
	color: #38c1b9;	
	font-size: 20px;
}
.foot {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
    height: 100rpx;
	color: #38c1b9;	
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
	 top: 30px;
	 left: 50%;
	 width: 260px;
	 height: 235px;
	 margin-left: -130px;
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
	padding:7px;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}
.arrival_record textarea{
	 height: 50px;
	 width: 100%;
}
.textarea-placeholder{
	font-size: 15px;
	text-align: left;
	color: #aaa;	
}

.arrival_foot {
	width: 260px;
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



.bottom-bar {  
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 39px;
  background-color: #fff;
  border-top: 1px solid #cbcbcbff;
  display: flex;
  align-items: center; 
   z-index: 999; /* 确保位于最顶层 */
}

.delete {
  flex: 1;
  height: 100%;
  line-height: 39px;
  color: #38c1b9;
  margin-left: 10px;
}
.transferOrder{
	flex: 1;
	height: 100%;
	line-height: 39px;
	text-align:center;
	color: #38c1b9;
}
.edit {
	flex: 1;
	height: 100%;
	line-height: 39px;
	text-align:right;
	color: #38c1b9;
	margin-right: 10px;
}
</style>
<template>	
	<view class="head"></view>	
	<scroll-view scroll-y style="height: calc(100vh - 41px);">
		<view class="item">
			<view class="title">客户姓名</view>	
			<text class="iconfont">&#xe639;</text>
			<input :focus='customerNameFocus'  @blur='customerNameFocus = false'  v-model="customer.customerName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder"  :placeholder="isEditable ? '' : '请输入客户姓名'">
		</view>
		<view class="item">
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
			<view class="title">客户电话</view>
			<input :focus='phoneFocus' @blur="checkPhone"  v-model="customer.phone" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户电话">
		</view>
		<view class="item">
			<view class="title">客户地址</view>
			<input  v-model="customer.address" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入客户地址">
		</view>
		<view class="item">
			<view class="title">意向程度</view>
			<view class="starLen">
				<image class="star" @tap='changeStar(1)' :src="customer.grade>0? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
				<image class="star" @tap='changeStar(2)' :src="customer.grade>1? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
				<image class="star" @tap='changeStar(3)' :src="customer.grade>2? BASEURL+fullStarUrl:BASEURL+nullStarUrl"></image>
			</view>
		</view>
		<view class="item">
			<text class="title">报价</text>
			<input v-model="customer.quotation" :disabled="isEditable" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入您向客户的报价">
		</view>
		<view class="item">
			<text class="title">备注</text>			
			<input v-model="customer.remark" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入备注" >
		</view>
		<view class="item section-header" @click="arriveAdd()">
			<text class="title">到店记录</text>
			<view class="section-add" v-if="!isEditable"><text>添加</text></view>
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
				<view class="removeArrive" @click.stop="deleteCustomerArrival(item.id)" v-if="!isEditable">
					<i class="iconfont">&#xe612;</i>
				</view>
			</view>
		</view>
		
		<view class="item section-header" @click="trackAdd()">
			<text class="title">跟踪记录</text>		
			<view class="section-add" v-if="!isEditable"><text>添加</text></view>
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
				<view class="removeFollowing" @click.stop="deleteCustomerTailAfter(item.id)" v-if="!isEditable">
					<i class="iconfont">&#xe612;</i>
				</view>
			</view>
			
		</view>
	
	<view class="item section-header product-section-title" @click="addCustomerProduct()">
		<text class="title">预购产品</text>		
		<view class="section-add" v-if="!isEditable"><text>添加</text></view>
	</view>
	
	<view class="product" v-for="(item, index) in customer.customerProducts" :key="item.productId || index">
		<view class="product-content" @click="openPopupProductNumber(item)">
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
				<text class="info product-emphasis">数量：<text>{{item.number}}</text></text>
				<view class="info product-emphasis">零售价：<text>￥{{item.retailPrice}}</text></view>
			</view>
		</view>
		<view class="product-actions">
			<view class="product-action product-remove" @click.stop="deleteProduct(item.productId)" v-if="!isEditable">
				<i class="iconfont">&#xe612;</i>
				<text class="product-action-label">移除</text>
			</view>
			<view class="product-action product-gallery" @click.stop="previewImage(item)">
				<view class="gallery-icon">
					<view class="gallery-dot"></view>
					<view class="gallery-mountain gallery-mountain-left"></view>
					<view class="gallery-mountain gallery-mountain-right"></view>
					<text class="gallery-count" v-if="item.productImages && item.productImages.length">{{item.productImages.length}}</text>
				</view>
				<text class="product-action-label">查看</text>
			</view>
		</view>
	</view>

</scroll-view>
	<view class="bottom-bar">
		  <text class="delete" @click="deleteCustomerForm()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		  <view class="transferOrder" @click="transferOrder()" v-if="isEditable == true">转订单</view>
		  <text class="edit"  @click="editCustomerForm()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>


	<!--到店时间弹窗-->
	<uni-popup ref="arrival_popup" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_content">
			<view class="popup_title">{{addOrEditArrival}}</view>
			<view class="popup_item">
			   <text class="popup_item_title">到店时间</text>
			   <view class="popup_item_text">
					<view @tap="toggle('arrival_date')" class="time" :style="{color:arrivalFormData.arrivalTime=='yyyy-MM-dd'?'#a0a0a0':'#333'}">{{arrivalFormData.arrivalTime}}</view>
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
	</uni-popup>

	<!--跟踪记录弹窗-->
	<uni-popup ref="tailafter_popup" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_content">
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
	</uni-popup>
	<!-- 修改产品数量弹窗 -->
	<uni-popup ref="popup_product_number" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_product_number_content">
			<view class="popup_product_number_title">{{popupProduct.productName}}</view>
			<view class="popup_product_number_item">
				<text class="popup_product_number_item_title">数量:</text>
				<view class="popup_product_number_item_text"><input v-model="popupProduct.number" type="number"/></view>
			</view>
			<view class="popup_product_number_foot">
				<view class="cancel" @click="cancelProductNumber()">取消</view>			
				<view class="determine" @click="submitProductNumber()">确定</view>
			</view>
		</view>
	</uni-popup>

</template>

<script>
	import cPicker from "../../components/c-picker/c-picker.vue"
	import {get,post} from "../../components/utils/request.js"
	import useProductStore from '@/store/modules/product.js' 
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
				customer:{customerProducts:[],listCustomerArrival:[],listCustomerTailAfter:[]},//客户数据
				addOrEditArrival:'',
				arrivalFormData:{
					id:"",
					customerId:"",
					arrivalTime:"",
					arrivalLength:"",
					arrivalRecord:"",
					arrivalType:""
				},
				tailAfterFormData:{
					id:"",
					customerId:"",
					arrivalTime:"",
					arrivalLength:"",
					arrivalRecord:"",
					arrivalType:""
				},
				popupProduct:{
					productId:"",
					productName:"",
					number:""
				},
				customerId:"",//存放列表传来的意向客户id
				customerNameFocus:true,
				phoneFocus:false
			}
		},
		setup() {
			const productStore = useProductStore();
			const transferOrderStore = useTransferOrderStore();
			return { productStore,transferOrderStore } 
		 },
		methods: {
			
			//获取商品第一张图片（空数组时显示默认图）
			getProductImg(item) {
			  if (item.productImages && item.productImages.length > 0) {
			    let url = item.productImages[0].productUrl
			    return this.BASEURL + (url.startsWith('/') ? url.substring(1) : url)
			  }
			  return this.getImgUrl('static/image/茶几.png')
			},
			// 点击放大预览，支持左右滑动切换所有图片
			previewImage(item) {
			  if (!item.productImages || item.productImages.length === 0) {
			    uni.showToast({ title: '暂无更多图片', icon: 'none' })
			    return
			  }
			  const urls = item.productImages.map(img => {
			    let url = img.productUrl
			    return this.BASEURL + (url.startsWith('/') ? url.substring(1) : url)
			  })
			    uni.previewImage({
			      current: 0,        // 从第一张开始
			      urls: urls,        // 所有图片地址
			      indicator: 'number', // 显示 1/3 数字指示器
			      loop: true         // 循环切换
			    })
			  },
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
			//提交到店记录
			submitArrival(){
				let arrivalFormData=JSON.parse(JSON.stringify(this.arrivalFormData));
				arrivalFormData.customerId = this.customer.id;				
				let listCustomerArrival = this.customer.listCustomerArrival;
				//添加
				if("添加到店记录"==this.addOrEditArrival){
					listCustomerArrival.unshift(arrivalFormData);					
				}else if("修改到店记录"==this.addOrEditArrival){					
					this.customer.listCustomerArrival = listCustomerArrival.map(item => (item.id == arrivalFormData.id ? arrivalFormData : item));
				}
				//清空对象
				let that = this;
				Object.keys(this.arrivalFormData).forEach(function(key){
					that.arrivalFormData[key]=""
				})
				this.$refs.arrival_popup.close()
			},
			//添加到店记录
			arriveAdd(){
				 if(this.isEditable == false){
					this.addOrEditArrival ="添加到店记录"
					this.arrivalFormData.arrivalTime = this.getDate();
					this.arrivalFormData.arrivalType ="arrival";
					this.$refs.arrival_popup.open('center');					
				}
			},
			cancelArrival(){
				//清空对象
				let that = this;
				Object.keys(this.arrivalFormData).forEach(function(key){					
					that.arrivalFormData[key]="";
				})
				this.$refs.arrival_popup.close()
			},
			//修改到店记录
			editCustomerArrival(item){
				 this.addOrEditArrival ="修改到店记录"
				 if(this.isEditable == false){
					this.$refs.arrival_popup.open('center');
					this.arrivalFormData.id = item.id;
					this.arrivalFormData.arrivalType ="arrival";
					this.arrivalFormData.customerId = item.customerId;
					this.arrivalFormData.arrivalTime = item.arrivalTime;
					this.arrivalFormData.arrivalLength = item.arrivalLength;
					this.arrivalFormData.arrivalRecord = item.arrivalRecord;
				}
			},
			//添加跟踪记录
			trackAdd(){
				if(this.isEditable == false){
					this.addOrEditArrival ="添加跟踪记录"
					this.tailAfterFormData.arrivalTime = this.getDate();
					this.tailAfterFormData.arrivalType ="tailafter";
					this.$refs.tailafter_popup.open('center');
				}				
			},
			cancelTrack(){				
				//清空表单
				let that = this;
				Object.keys(this.tailAfterFormData).forEach(function(key){					
					that.tailAfterFormData[key]=""
				})
				this.$refs.tailafter_popup.close()
			},
			//提交跟踪记录 
			submitTrack(){
				let tailAfterFormData=JSON.parse(JSON.stringify(this.tailAfterFormData));
				tailAfterFormData.customerId = this.customer.id
				//添加
				let  listCustomerTailAfter = this.customer.listCustomerTailAfter;
				if("添加跟踪记录"==this.addOrEditArrival){
					listCustomerTailAfter.unshift(tailAfterFormData);
				}else if("修改跟踪记录"==this.addOrEditArrival){
					this.customer.listCustomerTailAfter = listCustomerTailAfter.map(item => (item.id == tailAfterFormData.id ? tailAfterFormData : item));
				}
				//清空表单
				let that = this;
				Object.keys(this.tailAfterFormData).forEach(function(key){
					that.tailAfterFormData[key]="";
				})
				this.$refs.tailafter_popup.close()
			},
			editCustomerTailAfter(item){
				this.addOrEditArrival ="修改跟踪记录"
				 if(this.isEditable == false){
					this.tailAfterFormData.id = item.id;
					this.tailAfterFormData.arrivalType ="tailafter";
					this.tailAfterFormData.customerId = item.customerId;
					this.tailAfterFormData.arrivalTime = item.arrivalTime;
					this.tailAfterFormData.arrivalLength = item.arrivalLength;
					this.tailAfterFormData.arrivalRecord = item.arrivalRecord;
					this.$refs.tailafter_popup.open('center');
				}
			},
			getCustomerProduct(){
				let products = JSON.stringify(this.productStore.products);
				console.log(JSON.stringify(products))
				this.customer.customerProducts = JSON.parse(products);
			},
			addCustomerProduct(){
				if(this.isEditable == false){
					let customerProductList = this.customer.customerProducts
					if(!!customerProductList){
						this.productStore.addProduct(customerProductList);
					}
					uni.navigateTo({
						url:'/pages/customer/customer_product'
					})
				}
			},
			// 产品修改数量弹窗
			openPopupProductNumber(item){
				this.popupProduct.productName = item.productName;
				this.popupProduct.number = item.number;
				this.popupProduct.productId = item.productId;
				this.$refs.popup_product_number.open('center');
			},
			cancelProductNumber(){
				//清空对象
				let that = this;
				Object.keys(this.popupProduct).forEach(function(key){					
					that.popupProduct[key]="";
				})
				this.$refs.popup_product_number.close('center');
			},
			submitProductNumber(){
				let customerProductList = this.customer.customerProducts;				
				let productId = this.popupProduct.productId;
				let customerProduct = customerProductList.filter(obj =>obj.productId == productId)[0]
				customerProduct.number = this.popupProduct.number;
				this.$refs.popup_product_number.close()
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
					this.customer = res.data || {};
				}
			}) 
		},
		computed:{
		
		},
	}
</script>

<style scoped>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;	
}

.item{
	display: flex;	
	min-height: 44px;
	padding: 8px 12px 8px 8px;
	box-sizing: border-box;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .title{
	flex-shrink: 0;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.product-section-title{
	min-height: 40px;
	padding-bottom: 4px;
}
.item .iconfont{
	color:red;
	font-size: 12px;
	margin-left: -5px;
}
.item input{
	flex: 1;
	min-width: 0;
	text-align: right;
	margin-left: 12px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item.section-header{
	padding-right: 8px;
}
.section-add{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 24px;
	margin-left: auto;
	margin-right: 4px;
	flex-shrink: 0;
	box-sizing: border-box;
	background-color: #fff;
	color: #38c1b9;
	font-size: 14px;
	line-height: 20px;
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
	margin-left: 24px;
	flex-shrink: 0;
}

/* 微信小程序窄屏：压缩星级间距，避免内容挤出屏幕 */
@media screen and (max-width: 375px) {
	.star{
		margin-left: 18px;
	}
}

/* 客户性别 */
.gender{
	margin-left: auto;
	padding-right: 0;
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
/deep/ .gender .wx-radio-input {	
	border-radius: 0 !important;
	width: 50px !important;
	height: 25px !important;
	margin-right:0 !important;
	border-color: #38c1b9 !important;
}
/deep/ .gender .radio-group .radio1 .wx-radio-input {	
	border-right: 0 !important;
	border-top-left-radius: 8% !important;
	border-bottom-left-radius:8% !important;
}
/deep/ .gender .radio-group .radio2 .wx-radio-input {	
	border-top-right-radius: 8% !important;
	border-bottom-right-radius:8% !important;
}
/deep/ .gender .wx-radio-input-disabled{
	background-color: transparent !important;
}
/deep/ .gender .wx-radio-input.wx-radio-input-checked::before{
 font-size:0; /* 对勾大小 */
}

.arrive_container{
	position: relative;
	border-bottom: 1px solid #efeef3ff;
	padding: 4px 10px 0;
	
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
	padding-bottom: 6px;
	white-space: nowrap; /* 文字不换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 以省略号形式显示 */
}


.product{
	position: relative;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	box-sizing: border-box;
}
.product-content{
	width: 100%;
	min-width: 0;
	padding: 4px 0 4px 8px;
	box-sizing: border-box;
}
.grid {	
 	display: flex;
	align-items: center;
	min-height: 24px;
	line-height: 20px;
}
.info {
  width: 50%;
	min-width: 0;
  font-size: 14px;
  color: #333;
  white-space: nowrap;  
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  text-rendering: optimizeLegibility;
}
.product-emphasis{
	color: #e96225ff;
}

.product-actions{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	width: 64px;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 7px 4px;
	box-sizing: border-box;
}
.product-action{
	pointer-events: auto;
	width: 48px;
	min-height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #38c1b9;
}
.product-remove .iconfont{
	color: #38c1b9;
	font-size: 22px;
	line-height: 24px;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #38c1b9;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #38c1b9;
	border-radius: 3px;
	box-sizing: border-box;
}
.gallery-dot{
	position: absolute;
	top: 4px;
	left: 5px;
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background-color: #38c1b9;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #38c1b9;
	border-top: 1.5px solid #38c1b9;
	transform: rotate(45deg);
	box-sizing: border-box;
}
.gallery-mountain-left{
	left: 4px;
}
.gallery-mountain-right{
	right: 3px;
	width: 7px;
	height: 7px;
}
.gallery-count{
	position: absolute;
	top: -7px;
	right: -8px;
	min-width: 14px;
	height: 14px;
	padding: 0 3px;
	border-radius: 7px;
	box-sizing: border-box;
	background-color: #38c1b9;
	color: #fff;
	font-size: 9px;
	line-height: 14px;
	text-align: center;
}

/* 微信小程序窄屏：缩小浮动操作区，产品信息保持全宽 */
@media screen and (max-width: 375px) {
	.item.section-header{
		padding-right: 5px;
	}
	.product-content{
		padding-left: 6px;
	}
	.product-actions{
		width: 58px;
		padding-left: 2px;
		padding-right: 2px;
	}
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
 * 弹窗
 */
 .popup_content {
	 position: relative;
	 width: 260px;
	 height: 235px;
	 background-color: white;
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
  height: 39px;
  line-height: 39px;
  color: #38c1b9;
  margin-left: 10px;
}
.transferOrder{
	flex: 1;
	height: 39px;
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
/* 预购产品修改数量弹窗 */
.popup_product_number_content  {
	position: relative;
	width: 260px;
	height: 120px;
	background-color: white;	
	overflow: auto;
 } 
 .popup_product_number_title {
 	 font-size: 15px;	
	 text-align: center;
	 margin: 5px; 	
 }
 .popup_product_number_item {
 	 display: flex;	
 	 margin: 10px 15px;
 }
 .popup_product_number_item_title{
 	white-space: nowrap;
 	font-size: 15px;
 	color: #070707ff;
 }
 .popup_product_number_item_text{
 	border-bottom: 1px solid #f1f1f1ff;
 	flex-grow: 1;
 	text-align: center;
 	white-space: nowrap;
 }
 .popup_product_number_item_text input{
 	font-size: 15px;
 	color: #070707ff;
 }

.popup_product_number_foot {
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

</style>

<template>
<view class="wrap">
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_name.png')" ></image>
		<text class="title">客户姓名:</text>	
		<input v-model="customer.customerName" class="content" confirm-type="保存" type="text">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_gender.png')" ></image>
		<text class="title">客户性别:</text>		
		<view class="content">
			<view  @tap="toggle('selector')" class="gender" :style="{color:gender=='请选择'?'#a0a0a0':'#333'}">{{customer.sex}}</view>
			<cPicker @confirm="hand" name="ll" mode="selector"  ref="selector" :selectList="selectList"></cPicker>
		</view>
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/customer_phone.png')" ></image>
		<text class="title">客户电话:</text>
		<input  v-model="customer.phone" class="content" confirm-type="保存" type="number">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>
		<text class="title">客户地址:</text>
		<input v-model="customer.address" class="content" confirm-type="保存" type="text">
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/degree.png')" ></image>
		<view class="title">意向程度:</view>
		<view class="content starLen">
			<image class="star" @tap='changeStar(1)' :src="customer.grade>0?fullStarUrl:nullStarUrl"></image>
			<image class="star" @tap='changeStar(2)' :src="customer.grade>1?fullStarUrl:nullStarUrl"></image>
			<image class="star" @tap='changeStar(3)' :src="customer.grade>2?fullStarUrl:nullStarUrl"></image>
		</view>
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/quoted_price.png')" ></image>
		<text class="title">报价:</text>
		<input v-model="customer.quotation" class="content" confirm-type="保存" type="text">
		<text class="input-group-addon">元</text>
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/cusomer/discount.png')"></image>
		<text class="title">折扣:</text>		
		<input v-model="customer.discount" class="content" confirm-type="保存" type="text">
		<text class="input-group-addon">%</text>
	</view>
	<view class="item remarks" @click="remarksAddOrEdit()">
		<image class="img" :src="getImgUrl('static/image/cusomer/arrive.png')" ></image>
		<text class="title">备注:</text>		
		<text class="content"  style="width: 0; overflow: hidden;text-overflow: ellipsis;">{{customer.remark}}</text>
	</view>
	<view class="arrive">
		<view class="arrive_title" @click="arriveAdd()">
			<image class="img" :src="getImgUrl('static/image/cusomer/arrive.png')" ></image>
			<text class="arrive_title_left">到店记录:</text>
			<text class="arrive_title_right">继续添加</text>	
		</view>
		<view v-for="(item,index) in customer.listCustomerArrival" :id="item.id">
			<view class="arrive_content_line1" >
				<text>{{item.arrivalTime}}</text>
				<text>{{item.arrivalLength}}分钟</text>
			</view>
			<view class="arrive_content_line2">
				{{item.arrivalRecord}}
			</view>
		</view>
	</view>
	<view class="arrive" style="border-bottom: 8px solid #efeef3ff;">
		<view class="arrive_title" @click="trackAdd()">
			<image class="img" :src="getImgUrl('static/image/cusomer/arrive.png')"></image>
			<text class="arrive_title_left">跟踪记录:</text>
			<text class="arrive_title_right">继续添加</text>	
		</view>
		<view  v-for="(item,index) in customer.listCustomerTailAfter" :id="item.id">
			<view class="arrive_content_line1" >
				<text>{{item.arrivalTime}}</text>
				<text>{{item.arrivalLength}}分钟</text>
			</view>
			<view class="arrive_content_line2">
				{{item.arrivalRecord}}
			</view>
		</view>
	</view>
	
	<view class="product" v-for="(item, index) in customer.customerProducts">
		<view class="product_img">
			<image :src="getImgUrl('static/image/茶几.png')" mode=""></image>
		</view>
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
			<view>点击添加产品</view>
		</view>
		<view class="total">
			合计:{{productRetailPriceTotal}}
		</view>
	</view>
<!-- 		<view class="foot">
			<view class="track">跟踪</view>
			<view class="order">下单</view>
		</view> -->
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
			 <input v-model="arrivalFormData.arrivalLength" type="number"  />				 
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

<!--备注弹窗-->
<view>
	<view :hidden="remarkHidden" class="remark_content">
		<textarea class="remark_text" maxlength="200" placeholder="请输入备注" placeholder-class="textarea-placeholder"></textarea>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelRemark()">取消</view>
			<view class="determine" @click="submitRemark()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="remarkHidden" @click="hideRemark()"></view>
</view>
</template>

<script>
	import cPicker from "../../components/c-picker/c-picker.vue"
	import {
		picker
	} from "../../components/mixins/picker.js"
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
				//备注
				remarkHidden:true,
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
			//备注
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
					this.customer = res.data
					uni.hideLoading();
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

.wrap{
	width: 100%;	
	border-top: 8px solid #efeef3ff;
}
.item{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx;
	border-bottom: 1px solid #efeef3ff;
}
.img{
	width: 38rpx;
	height: 38rpx;	
}

.title{	
	white-space: nowrap;
	padding: 0 30rpx;
	font-size: 35rpx;
	color: #333;
}
.content{
	font-size: 35rpx;
	color: #333;	
	flex-grow: 1;
	text-align: right;	
	white-space:nowrap;
}
.input-group-addon {
   font-size: 35rpx;
   color: #333;  
}

.starLen{
	display: flex;
	justify-content: space-around;
}
.input-placeholder{
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.arrive{
	border-bottom: 1px solid #efeef3ff;
}
.star{
	width: 50rpx;
	height: 50rpx;
}
.arrive_title{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx;
	color: #acacacff;

}
.arrive_title_left{
	padding: 0 30rpx;
	font-size: 35rpx;	
}
.arrive_title_right{
	font-size: 30rpx;	
	flex-grow: 1;
	text-align: right;
}
.arrive_content_line1{
	display: flex;
	justify-content: space-between;
	padding: 0 30rpx;
	font-size: 35rpx;
	color: #333;
}
.arrive_content_line2{
	padding: 20rpx 30rpx;
	font-size: 30rpx;
	color: #acacacff;
}

.remarks{
	min-width: 0;
	border-bottom: 8px solid #efeef3ff;
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
	/* position: absolute;
	right: 20rpx;
	bottom: 10rpx; */
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
    width: 150rpx;
	height: 150rpx;
    margin-top: 10rpx;
    margin-left: 10rpx;
}
.add_img image {
    width: 80rpx;
    height: 80rpx;
	margin-left: 35rpx;
	margin-top: 15rpx;
	
}
.add_img view {   
    color: #e96225ff;
    font-size: 20rpx;
    text-align: center;
}
.total{
	padding-right: 30rpx;
	padding-top: 20rpx;
	font-size: 35rpx;
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
	 width: 500rpx;
	 height: 550rpx;
	 margin-left: -250rpx;
	 margin-top: -275rpx;
	 border-radius: 20rpx;
	 background-color: white;
	 z-index: 1002;
	 overflow: auto;
 }
 /* 备注弹窗 */
 .remark_content{
 	 position: fixed;
 	 top: 50%;
 	 left: 50%;
 	 width: 500rpx;
 	 height: 350rpx;
 	 margin-left: -250rpx;
 	 margin-top: -275rpx;
 	 border-radius: 20rpx;
 	 background-color: white;
 	 z-index: 1002;
 	 overflow: auto;
 }
 .popup_title {	 
	 font-size: 35rpx;
	 font-weight: 500;
	 text-align: center;
	 margin: 20rpx 0;	
 }

 .popup_item {
	 display: flex;	
	 margin: 30rpx 30rpx;
 }
 .popup_item_title{	 
 	padding-right: 10rpx;
	white-space: nowrap;
	font-size: 30rpx;
	color: #070707ff;
 }
.popup_item_text{	
	border-bottom: 1px solid #f1f1f1ff;
	flex-grow: 0.8;
	text-align: right;	
}
.popup_item_text input{
	font-size: 30rpx;
	color: #070707ff;
	margin-right: 10rpx;
}
.input-placeholder{
	font-size: 28rpx;
	text-align: right;
	color: #f1f1f1ff;	
	margin-right: 10rpx;
}
.minute{
	font-size: 30rpx;
	color: #070707ff;
	white-space: nowrap;
}
.arrival_record{
	margin: 0 30rpx;
	padding:20rpx;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}
.remark_text{
	width: 390rpx;
	height: 190rpx;	
	margin: 0 auto;
	margin-top: 32rpx;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
	padding:20rpx;
	
}
.arrival_record textarea{
	 height: 150rpx;
	 width: 400rpx;
}
.textarea-placeholder{
	font-size: 28rpx;
	text-align: left;
	color: #aaa;	
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
</style>
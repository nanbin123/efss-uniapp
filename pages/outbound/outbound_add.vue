<template>
	<view style="height: 5px;">
		<view class="head-line"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 35px);">
		<view class="item" @click="importOrder()">
			<image class="img" :src="getImgUrl('static/image/outbound/import_order.png')"></image>
			<text class="title">导入订单</text>
			<image class="right-img" :src="getImgUrl('static/image/receipt/add.png')"></image>
		</view>
		<view class="item">
			<image class="img" style="width: 19px;height: 20px;" :src="getImgUrl('static/image/outbound/order_number.png')"></image>
			<text class="title">订单编号:</text>	
			<text class="content">{{outbound.orderNumber}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_name.png')"></image>
			<text class="title">客户姓名:</text>	
			<text class="content">{{outbound.customerName}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/customer_phone.png')"></image>
			<text class="title">客户电话:</text>	
			<text class="content">{{outbound.phone}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_address.png')"></image>
			<text class="title">地址:</text>	
			<text class="content">{{outbound.address}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/outbound/sales_name.png')"></image>
			<text class="title">销售人姓名:</text>	
			<text class="content">{{outbound.orderOperator}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/outbound/sales_telephone.png')"></image>
			<text class="title">销售人电话:</text>	
			<text class="content">{{outbound.orderOperatorPhone}}</text>
		</view>
		<view class="product-details">
			<image class="img" :src="getImgUrl('static/image/outbound/product_details.png')"></image>
			<text class="title">产品明细</text>
		</view>
		
		<view class="product" v-for="(item,index) in outbound.outboundProductList">
			<view class="product-basic">
				<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
				<view class="product-content" @click="open(item)">
					<view class="grid">
						<text class="info">品名：{{item.productName}}</text>
						<text class="info">型号：{{item.type}}</text>
					</view>
					<view class="grid">
						<text class="info">尺寸：{{item.size}}</text>
						<text class="info">产地：{{item.production}}</text>
					</view>
					<view class="grid">
						<text class="info">颜色：{{item.color}}</text>
						<text class="info">材质：{{item.texture}}</text>
					</view>
				</view>	
			</view>
			<view class="product-inventory"  @click="open(item)">
				<text class="info" style="width: 30%;">库存数：100</text>
				<text class="info" style="width: 30%;">待出库：{{item.toBeShippedOutNumber}}</text>
				<text class="info" style="width: 30%;">已出库：{{item.outboundNumber}}</text>
			</view>
		</view>
	</scroll-view>
	
	<view class="footer"  @click="confirm()">
		<view>保存</view>
	</view>
	
	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_content">
			<view class="popup_title">{{popupProduct.productName}}</view>
			<view class="popup_item">
				<text class="popup_item_title">已出库:</text>
				<view class="popup_item_text"><input v-model="popupProduct.outboundNumber" type="number"/></view>
			</view>
			<view class="popup_product_foot">
				<view class="cancel" @click="cancelTrack()">取消</view>			
				<view class="determine" @click="submitTrack()">确定</view>
			</view>
		</view>
	</uni-popup>
	

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				outbound:{},
				popupProduct:{
					orderProductId:"",
					productName:"",
					outboundNumber:""
				}
			}
		},
		methods: {
			importOrder(){
				let that = this
				uni.navigateTo({
					url:'/pages/outbound/import_order'
				})
			},
			open(item){
				this.popupProduct.productName = item.productName;
				this.popupProduct.outboundNumber = item.outboundNumber;
				this.popupProduct.orderProductId = item.orderProductId;
				this.$refs.popup.open('center');
			},
			cancelTrack(){
				this.$refs.popup.close()
			},
			submitTrack(){
				let outboundProductList = this.outbound.outboundProductList;
				let orderProductId = this.popupProduct.orderProductId;
				let outboundProduct = outboundProductList.filter(obj =>obj.orderProductId == orderProductId)[0]
				outboundProduct.outboundNumber = this.popupProduct.outboundNumber;
				this.$refs.popup.close()
			},
			 //确认
			confirm(){
				let outboundObj= new Object();
				outboundObj.orderId = this.outbound.orderId;
 				let productChooseArray = this.outbound.outboundProductList;				
				let outboundProductList = new Array(); 
				for (var i = 0; i < productChooseArray.length; i++) {					
					let outboundProduct= new Object();
					outboundProduct.orderProductId =  productChooseArray[i].id;
					outboundProduct.outboundNumber = productChooseArray[i].outboundNumber;				
					outboundProductList.push(outboundProduct);					
				}
				outboundObj.outboundProductList = outboundProductList;
				post("outbound/insertOutbound", {"outboundJson":JSON.stringify(outboundObj)}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '出库单添加成功',
						icon: 'none',
						duration: 2000
					})
					
				})
			},
			getList(orderId){
				post("outbound/selectOrderById",{"orderFormId":orderId}).then(res =>{
					if(200 == res.code){
						this.outbound = res.data
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		}
	}
</script>

<style scoped>
.head-line{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.item{
	display: flex;
	align-items: center;
	padding: 8px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	background-color: #fff;	
}
.item .right-img{
	margin-left: auto;
	margin-right: 15px;
	width: 25px;
	height: 25px;
}
.item .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;	
}
.item .title{
	margin-left: 3px;
	font-size: 14px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.content{
	white-space: nowrap;
	font-size: 14px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.product-details{
	display: flex;
	align-items: center;
	padding: 8px 0;
	border-top: 7px solid #efeef3ff;
}

.product-details .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;
}
.product-details .title{
	margin-left: 3px;
	font-size: 15px;
	font-weight: 600;
	color: #949494ff;	
}
.product{
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	margin-bottom: 5px;
}
.product .product-basic{
	display: flex;
	align-items: center;
}
.product .product-inventory{
	display: flex;
	align-items: center;
	font-size: 14px;
	color: rgb(233, 98, 37);
	padding-left: 3px;
}
.product .img {
	width: 50px;
	height: 50px;
}
.product .product-content{	
	flex: 1;
	margin-left: 2px;
}
.product .product-content .grid {
 	display: flex;	
	line-height: 17px;
}
.grid .info {
   width: 50%;
   font-size: 14px;
   color: #333;
   white-space: nowrap;  
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 显示省略号 */
   text-rendering: optimizeLegibility;
}
.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;	
	width: 100%;
}

.popup_content {
	position: relative;
	width: 260px;
	height: 120px;
	background-color: white;	
	overflow: auto;
 } 
.popup_content .popup_title {
 	 font-size: 15px;	
	 text-align: center;
	 margin: 5px; 	
 }
.popup_content .popup_item {
 	 display: flex;	
 	 margin: 10px 15px;
 }
.popup_content .popup_item_title{
 	white-space: nowrap;
 	font-size: 15px;
 	color: #070707ff;
 }
.popup_content .popup_item_text{
 	border-bottom: 1px solid #f1f1f1ff;
 	flex-grow: 1;
 	text-align: center;
 	white-space: nowrap;
 }
.popup_content .popup_item_text input{
 	font-size: 15px;
 	color: #070707ff;
 }

.popup_content .popup_product_foot {
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
.popup_content .cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
}
.popup_content .determine{
	text-align: center;
	width: 50%;
}

</style>

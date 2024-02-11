<template>
<view class="wrap">
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<view class="item"   @click="importOrder()">
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
		<text class="content">{{outbound.orderNickName}}</text>	
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/outbound/sales_telephone.png')"></image>
		<text class="title">销售人电话:</text>	
		<text class="content">{{outbound.orderPhonenumber}}</text>	
	</view>	
	<view class="products">
		<view class="product-details">
			<image class="img" :src="getImgUrl('static/image/outbound/product_details.png')"></image>
			<text class="title">产品明细</text>
		</view>
		<view class="product-list" v-for="(item,index) in outbound.outboundProductList">
			<view class="grid">
				<text class="info">品名：{{item.productName}}</text>
				<text class="info">型号：{{item.type}}</text>
				<text class="info">产地：{{item.production}}</text>
			</view>
			<view class="grid">				
				<text class="info">颜色：{{item.color}}</text>
				<text class="info">材质：{{item.texture}}</text>
				<text class="info" style="width: 40%;">尺寸：{{item.size}}</text>
			</view>
			<view class="grid">
				<text class="info">库存数：{{item.number}}</text>
				<text class="info">待出库：{{item.toBeShippedOutNumber}}</text>
				<text class="shipped_out">出库数:</text>
				<view class="product_number">
						<view class="reduce" @click="reduce(item)">-</view>					
						<input disabled="disabled" type="number" :value="item.outboundQuantity" @input="countVal">				
						<view class="add" @click="add(item)">+</view>
				</view>			
				<!-- <text class="info">订货数：{{item.number}}</text>				
				<text class="info">已出库：{{item.outboundNumber}}</text> -->
			</view>			
		</view>
	</view>
	<view class="btn"  @click="confirm()">
		<button>确定</button>
	</view>
</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				outbound:{}
			}
		},
		methods: {
			importOrder(){
				let that = this
				uni.navigateTo({
					url:'/pages/outbound/import_order'
				})
			},
			reduce(item) {
				if (item.outboundQuantity <= 0) {
					uni.showToast({
						title: '数值不能小于0',
						icon: "none"
					})
					return;
				}
				item.outboundQuantity = item.outboundQuantity - 1;					 
			},
			add(item) {
				item.outboundQuantity = item.outboundQuantity + 1;							
			},
			 //确认
			confirm(){
				let outboundObj= new Object();
				outboundObj.orderId = this.outbound.orderId;				
 				let productChooseArray = this.outbound.outboundProductList;
				let outboundProductList = new Array(); 
				for (var i = 0; i < this.outbound.outboundProductList.length; i++) {
					let outboundProduct= new Object();					
					outboundProduct.orderProductId =  productChooseArray[i].id;
					outboundProduct.outboundNumber = productChooseArray[i].outboundQuantity;				
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
						uni.hideLoading(); 
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
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
	padding: 10px;
	border-bottom: 1px solid #efeef3ff;
}
.item .right-img{
	margin-left: auto;
	margin-right: 15px;
	width: 25px;
	height: 25px;
}
.img{
	width: 18px;
	height: 18px;	
}
.title{
	white-space: nowrap;
	padding: 0 15px;
	font-size: 15px;
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
.products{
	border-top: 10px solid #efeef3ff;
}
.product-details{
	display: flex;
	align-items: center;
	padding: 10px 10px 0 10px;
}
.product-details .img{
	padding-right: 10px;
}
.product-details text{
	font-size: 17px;
	font-weight: 600;
	color: #949494ff;	
}
.product-list{
	padding-left:10px;
	padding-top: 10px;
	border-bottom: 1px solid #c5c5c5ff;
}
.grid{
	width: 100%;
	display: flex;
	align-items: center;
	height: 28px;	
}
.grid .info{
	width: 30%;
	color: #333;
	font-size: 15px;	
	white-space: nowrap;
}
.grid .shipped_out{
	color: #333;
	font-size: 15px;	
	white-space: nowrap;
	margin-right: 10px;
}
.product_number{
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #cdcdcdff;
	border-radius: 2px;
	height: 22px;
	width: 120px;
	text-align: center;
}
.reduce{	
	width: 50px;
	height: 22px;
	text-align: center;
	line-height: 20px;
	border-right: 1px solid #cdcdcdff;
	color: #010101ff;
	font-weight: 500;
}
.add{
	width: 50px;
	height: 22px;
	line-height: 20px;
	border-left: 1px solid #cdcdcdff;
	color: #010101ff;
}
.product_number input{
	font-size: 15px;
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

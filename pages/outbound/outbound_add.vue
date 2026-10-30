<template>
	<view style="height: 5px;">
		<view class="head-line"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 49px);">
		<view class="item" @click="importOrder()">
			<text class="title">导入订单</text>
			<image class="right-img" :src="getImgUrl('static/image/receipt/add.png')"></image>
		</view>
		<view class="item">
			<text class="title">订单编号:</text>	
			<text class="content">{{outbound.orderNumber}}</text>	
		</view>
		<view class="item">
			<text class="title">客户姓名:</text>	
			<text class="content">{{outbound.customerName}}</text>	
		</view>
		<view class="item">
			<text class="title">客户电话:</text>	
			<text class="content">{{outbound.phone}}</text>	
		</view>
		<view class="item">
			<text class="title">地址:</text>	
			<text class="content">{{outbound.address}}</text>	
		</view>
		<view class="item">
			<text class="title">销售人姓名:</text>	
			<text class="content">{{outbound.orderOperator}}</text>	
		</view>
		<view class="item">
			<text class="title">销售人电话:</text>	
			<text class="content">{{outbound.orderOperatorPhone}}</text>
		</view>
		<view class="product-details">
			<text class="title">产品明细</text>
		</view>
		
		<view class="product" v-for="(item,index) in outbound.outboundProductList">
			<view class="product-basic">
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
			<view class="product-inventory">
				<text class="info">库存数：100</text>
				<text class="info">待出库：{{item.toBeShippedOutNumber}}</text>
				<text class="info">已出库：{{item.outboundNumber}}</text>
			</view>
			<view class="product-actions">
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
			// 参考订单详情，支持查看产品图片并左右滑动预览。
			previewImage(item) {
				const images = Array.isArray(item.productImages) ? item.productImages : [];
				const urls = images.filter(img => img && typeof img.productUrl === 'string' && img.productUrl.trim())
					.map(img => {
						const url = img.productUrl.trim();
						return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
					});
				if (!urls.length) {
					uni.showToast({ title: '暂无更多图片', icon: 'none' });
					return;
				}
				uni.previewImage({ current: urls[0], urls, indicator: 'number', loop: true });
			},
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
	box-sizing: border-box;
	min-height: 48px;
	padding: 9px 12px;
	border-bottom: 1px solid #f1f1f1ff;	
	background-color: #fff;	
}
.item .right-img{
	margin-left: auto;
	width: 22px;
	height: 22px;
}
.item .title{
	flex-shrink: 0;
	font-size: 14px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.content{
	flex: 1;
	min-width: 0;
	white-space: nowrap;
	font-size: 14px;
	color: #333;	
	margin-left: 10px;
	text-align: right;	
	overflow: hidden;
	text-overflow: ellipsis;
}
.product-details{
	display: flex;
	align-items: center;
	min-height: 44px;
	box-sizing: border-box;
	padding: 9px 12px;
	border-top: 7px solid #efeef3ff;
}

.product-details .title{
	font-size: 15px;
	font-weight: 600;
	color: #949494ff;	
}
.product{
	position: relative;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	margin-bottom: 5px;
}
.product .product-basic{
	display: flex;
	align-items: center;
	padding: 6px 10px 2px;
}
.product .product-inventory{
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: rgb(233, 98, 37);
	padding: 4px 64px 8px 10px;
}
.product .product-content{	
	flex: 1;
	min-width: 0;
	padding-right: 54px;
	box-sizing: border-box;
}
.product .product-content .grid {
	display: flex;
	line-height: 20px;
}
.grid .info {
	flex: 1;
	min-width: 0;
	font-size: 13px;
   color: #333;
   white-space: nowrap;  
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 显示省略号 */
   text-rendering: optimizeLegibility;
	padding-right: 5px;
	box-sizing: border-box;
}
.product-inventory .info{
	flex: 1;
	min-width: 0;
	font-size: 12px;
	white-space: nowrap;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
}
.product-actions{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	pointer-events: none;
}
.product-action{
	pointer-events: auto;
	width: 48px;
	min-height: 48px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #00a7e2ff;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #00a7e2ff;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #00a7e2ff;
	border-top: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
	color: #fff;
	font-size: 9px;
	line-height: 14px;
	text-align: center;
}
.footer{
	height: 44px;
	font-size: 16px;
	text-align: center;
	line-height: 44px;
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

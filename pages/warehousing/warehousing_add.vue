<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y class="form-scroll">
		<view class="item">
			<text class="title">记录日期</text>
			<view @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' @confirm="recordDateHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<text class="title">供应商</text>
			<input v-model="warehousingEntry.supplier" type="text" placeholder="请输入供应商" />
		</view>	
		<view class="item">
			<text class="title">备注</text>
			<input v-model="warehousingEntry.remark" type="text" placeholder="请输入备注" />
		</view>
		<view class="item choice_porduct" @click="addWarehousingProduct()">
			<text class="title">选择产品</text>
			<image class="add_product" :src="getImgUrl('static/image/add.png')"></image>
		</view>
	<view class="product" v-for="(item, index) in warehousingEntry.warehousingEntryProductList" :key="item.productId || index">
		<view class="product-content" @click="open(item)">
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
				<text class="info product-emphasis">数量：<text>{{item.inventoryQuantity}}</text></text>
				<view class="info product-emphasis">零售价：<text>￥{{item.retailPrice}}</text></view>
			</view>
		</view>
		<view class="product-actions">
			<view class="product-action product-remove" @click.stop="deleteProduct(item.productId)">
				<text class="iconfont">&#xe612;</text>
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
	<view class="footer" @click="addWarehousing()">
		<view>保存</view>
	</view>

	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
		<view class="popup_content">
			<view class="popup_title">{{popupProduct.productName}}</view>
			<view class="popup_item">
				<text class="popup_item_title">数量:</text>
				<view class="popup_item_text"><input v-model="popupProduct.inventoryQuantity" type="number"/></view>
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
import cPicker from "../../components/c-picker/c-picker.vue"
import useProductStore from '@/store/modules/product.js' 
export default {
	components: {
		cPicker
	},
	options: {styleIsolation: 'shared'},
	data() {
		return {
			warehousingEntry:{warehousingEntryProductList:[]},
			popupProduct:{
				productId:"",
				productName:"",
				inventoryQuantity:""
			}
		}
	},
	setup() {
		const productStore = useProductStore();				
		return { productStore } 
	 },
	methods: {
		deleteProduct(productId) {
			this.warehousingEntry.warehousingEntryProductList = this.warehousingEntry.warehousingEntryProductList
				.filter(item => item.productId !== productId);
			this.productStore.addProduct(this.warehousingEntry.warehousingEntryProductList);
		},
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

		//选择产品
		addWarehousingProduct(){
			let warehousingEntryProductList = this.warehousingEntry.warehousingEntryProductList
			if(!!warehousingEntryProductList){
				this.productStore.addProduct(warehousingEntryProductList);
			}
			uni.navigateTo({
				url:'/pages/warehousing/warehousing_product'
			})
		},
		getWarehousingProduct(){
			let products = JSON.stringify(this.productStore.products);
			this.warehousingEntry.warehousingEntryProductList = JSON.parse(products);
		},
		//确认提交 订单
		addWarehousing(){
			let warehousingEntryObj=JSON.parse(JSON.stringify(this.warehousingEntry));			
			let productInfo = warehousingEntryObj.warehousingEntryProductList.map(map =>{
				return {
					productId: map.productId,
					inventoryQuantity: map.inventoryQuantity,
					productImages: map.productImages || []
				}
			})
			warehousingEntryObj.warehousingEntryProductList = productInfo
			post("warehousing/insertWarehousingEntry",JSON.stringify(warehousingEntryObj),'application/json').then(res =>{
				if(200 == res.code){					
					uni.showToast({
						title: '添加入库单成功',
						icon: 'none',
						duration: 2000
					})
					this.warehousingEntry = "";
				}
			})
		},
		open(item){
			this.popupProduct.productName = item.productName;
			this.popupProduct.inventoryQuantity = item.inventoryQuantity;
			this.popupProduct.productId = item.productId;
			this.$refs.popup.open('center');			
		},
		cancelTrack(){
			this.$refs.popup.close()
		},
		submitTrack(){
			let warehousingEntryProductList = this.warehousingEntry.warehousingEntryProductList;
			let productId = this.popupProduct.productId;
			let warehousingEntryProduct = warehousingEntryProductList.filter(obj =>obj.productId == productId)[0]
			warehousingEntryProduct.inventoryQuantity = this.popupProduct.inventoryQuantity;
			this.$refs.popup.close()
		},
		recordDateHand(value) {				
			this.warehousingEntry.recordDate = value.result							
		},
		//时间弹窗
		toggle(val) {
			this.$refs[val].show();
		},
		isEmpty(str){
			return typeof str === 'undefined' || '' === str;
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	onLoad() {
		let date = new Date();
		let year = date.getFullYear();
		let month = (date.getMonth() + 1).toString().padStart(2, '0');
		let day = date.getDate().toString().padStart(2, '0');				
		let formattedDate = `${year}-${month}-${day}`;
		this.warehousingEntry.recordDate = formattedDate;
	}
}
</script>

<style scoped>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;	
}
.item{
	display: flex;	
	min-height: 48px;
	box-sizing: border-box;
	padding: 8px 12px;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .title{
	width: 80px;
	flex-shrink: 0;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item input{
	flex: 1;
	min-width: 0;
	height: 32px;
	font-size: 15px;
	text-align: right;	
	text-rendering: optimizeLegibility;
}
.item .time{
	flex: 1;
	min-width: 0;
	line-height: 32px;
	font-size: 15px;
	text-align: right;
}
.content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.item .uni-forms-item{
	width: 100%;
	margin-bottom:0;
	margin-left: auto;	
}
.item .uni-forms-item uni-input{
	display: inline;
	font-size: 18px;
	text-align: right;
}
.choice_porduct{
	margin-bottom: 5px;
}
.add_product{
	width: 25px;
	height: 25px;
	flex-shrink: 0;
	margin-left: auto;
}

.product{
	display: flex;
	align-items: stretch;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	box-sizing: border-box;
}
.product-content{
	flex: 1;
	min-width: 0;
	padding: 8px 0 8px 8px;
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
	width: 64px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 7px 4px;
	box-sizing: border-box;
}
.product-action{
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

/* 微信小程序窄屏：保持操作区可点击，同时尽量给产品信息留出宽度 */
@media screen and (max-width: 375px) {
	.product-content{
		padding-left: 6px;
	}
	.product-actions{
		width: 58px;
		padding-left: 2px;
		padding-right: 2px;
	}
	.info{
		font-size: 13px;
	}
}

.choice{
	display: flex;
	justify-content: space-between;
}
.delivery-status{
	color: #db081bff;
	font-size: 17px;
}
.choice checkbox{
	transform:scale(0.9);
	margin-right: 30px;
}
.form-scroll{
	height: calc(100vh - 5px - 80rpx);
	height: calc(100vh - 5px - 80rpx - env(safe-area-inset-bottom));
}
.footer{
	height: 80rpx;
	box-sizing: content-box;
	padding-bottom: env(safe-area-inset-bottom);
	font-size: 17px;
	font-weight: 500;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #38c1b9;
	color: #ffffff;
	width: 100%;
}

@media screen and (max-height: 700px) {
	.form-scroll{
		height: calc(100vh - 5px - 72rpx);
		height: calc(100vh - 5px - 72rpx - env(safe-area-inset-bottom));
	}
	.footer{
		height: 72rpx;
	}
}

.popup_content {
	position: relative;
	width: 260px;
	max-width: calc(100vw - 32px);
	height: 120px;
	background-color: white;	
	overflow: auto;
 } 
 .popup_title {
 	 font-size: 15px;	
	 text-align: center;
	 margin: 5px; 	
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

.popup_product_foot {
	width: 100%;
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

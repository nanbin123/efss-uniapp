<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<scroll-view scroll-y style="height: calc(100vh - 35px);">
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')"></image>
			<text class="title">记录日期:</text>
			<view @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' @confirm="recordDateHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/supplier.png')"></image>
			<text class="title">供应商:</text>
			<input v-model="warehousingEntry.supplier" type="text" />
		</view>	
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
			<text class="title">备注 :</text>
			<input v-model="warehousingEntry.remark" type="text" />
		</view>
		<view class="item choice_porduct" @click="addWarehousingProduct()">
			<image class="img"  :src="getImgUrl('static/image/warehousing/choose_product.png')"></image>
			<text class="title">选择产品</text>
			<image class="add_product" :src="getImgUrl('static/image/add.png')"></image>
		</view>
		<view class="product"  v-for="(item,index) in warehousingEntry.warehousingEntryProductList">			
			<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
			<view class="product-content" @click="open(item)">
				<view class="grid">
					<text class="info">品名：{{item.productName}}</text>
					<text class="info">型号：{{item.type}}</text>
				</view>
				<view class="grid">
					<text class="info" >尺寸：{{item.size}}</text>
					<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>
				</view>
				<view class="grid">					
					<text class="info">颜色：{{item.color}}</text>
					<text class="info">材质：{{item.texture}}</text>	
				</view>
				<view class="grid">
					<text class="info">零售价：<text style="color: #d6a950ff; font-size: 12px;">￥{{item.retailPrice}}</text></text>
					<text class="info">数量：{{item.inventoryQuantity}}</text>
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
			warehousingEntry:{},
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
				return {productId:map.productId,inventoryQuantity:map.inventoryQuantity}
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
	padding: 8px 0;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;
}
.item .img{
	padding-left: 1px;
	width: 19px;
	height: 19px;	
}
.item .title{
	margin-left: 1px;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}
.item input{
	flex-grow: 1;
	padding-right: 13px;
	text-align: right;	
	text-rendering: optimizeLegibility;
}
.item .time{
	margin-left: auto;
	text-align: right;
	padding-right: 13px;
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
	position: relative;
	margin-bottom: 5px;
	padding-bottom: 5px;
	padding-top: 5px;
}
.add_product{
	width: 25px;
	height: 25px;
	position: absolute;
	right: 20px;
}

.product{
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid #cbcbcbff;
	padding-bottom: 5px;
	margin-bottom: 5px;
}
.product .img {
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


</style>

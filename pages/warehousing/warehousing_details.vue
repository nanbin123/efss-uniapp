<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y :show-scrollbar="false" :enhanced="true" class="details-scroll">
		<view class="item">
			<text class="title">入库单号</text>	
			<text class="content">{{warehousingEntry.warehousingNumber}}</text>	
		</view>
		<view class="item">
			<text class="title">记录日期</text>
			<view  @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择记录日期":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' :pageData="warehousingEntry.recordDate" @confirm="deliveryHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<text class="title">操作人</text>
			<text class="content">{{warehousingEntry.handledBy}}</text>	
		</view>
		<view class="item">
			<text class="title">供应商</text>	
			<text class="content">{{warehousingEntry.supplier}}</text>	
		</view>		
		<view class="item">
			<text  class="title">备注 </text>
			<input v-model="warehousingEntry.remark" class="content" :disabled="isEditable">
		</view>

		
		<view class="products">
			<view class="item products-title">
				<text class="title">产品明细</text>
			</view>
			
			<view class="product-content" v-for="(item,index) in warehousingEntry.warehousingEntryProductList" :key="index">
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
					<checkbox-group class="choice" @change="onCheckchange($event,item)">
						<checkbox value="isInWarehouse" :checked="item.isInWarehouse" :disabled="isDisabled(item.isEdit)" />
					</checkbox-group>
				</view>
					<view class="grid">
						<text class="info">品名：{{item.productName}}</text>
						<text class="info">型号：{{item.type}}</text>
					</view>
					<view class="grid">
						<text class="info">产地：{{item.production}}</text>
						<text class="info">颜色：{{item.color}}</text>
					</view>
					<view class="grid">
						<text class="info">材质：{{item.texture}}</text>
						<text class="info">尺寸：{{item.size}}</text>
					</view>	
					<view class="grid inventory-row">
						<text class="info" style="color: #e96225ff;">数量：1</text>
						<text class="info"  style="color: #e96225ff;">是否入库：{{item.isInWarehouse == true ?'已入库':'未入库'}}</text>

					</view>	
			</view>
		</view>
	</scroll-view>

	<view class="bottom-bar">
		  <text class="delete" @click="deleteWarehousing()">{{ isEditable ? '删除' : '取消'  }}</text>		 
		  <text class="edit"  @click="editWarehousing()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>

</template>
<script>
import {get,post} from "../../components/utils/request.js"
import cPicker from "../../components/c-picker/c-picker.vue"
export default {
	components: {
		cPicker
	},
	options: {styleIsolation: 'shared'},
	data() {
		return {
			isEditable:true,
			warehousingEntry:{warehousingEntryProductList:[]}
		}
	},
	methods: {
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

		isDisabled(itemIsEdit) {
			if(this.isEditable){
				return this.isEditable;
			}else{
				return itemIsEdit;
			}
		},
		onCheckchange(e,item){			
			item.isInWarehouse = e.detail.value.includes("isInWarehouse");
		},
		editWarehousing(){
			if(this.isEditable == true){
				this.isEditable = false					
			}else if(this.isEditable == false){
				const data = this.warehousingEntry.warehousingEntryProductList;
				const groupSum = data.reduce((result, currentItem) => {
					if(currentItem.isInWarehouse === true){ 
						const group = currentItem["id"];
						result[group] = result[group] || { "id": group, "receivedQuantity": 0 };						
						result[group].receivedQuantity++;
					} 
					return result;
				}, {});	
				let warehousingEntry=JSON.parse(JSON.stringify(this.warehousingEntry));
				warehousingEntry.warehousingEntryProductList = Object.keys(groupSum).map(function(key) {
					return groupSum[key];
				});
				post("warehousing/updateWarehousingEntryById",JSON.stringify(warehousingEntry),'application/json').then(res =>{
					if(200 == res.code){
						this.isEditable = true
						uni.showToast({
						  title: '修改入库单成功',
						  icon: 'none', 
						  duration: 2000 
						});
					}
				}) 
			}
		},
		deleteWarehousing(){				
			let _this = this	
			if(_this.isEditable == true){					 
				uni.showModal({
				  title: '提示',
				  content: '是否删除入库单',
				  success: (res)=> {						 
					if (res.confirm) {
						post("warehousing/deleteWarehousingEntryById",{"id":_this.warehousingEntry.id}).then(res =>{								
							if(200 == res.code){									
								_this.isEditable = true;
								_this.warehousingEntry ={};
								uni.showToast({
								  title: '删除入库单成功',
								  icon: 'none', 
								  duration: 2000 
								});
							}
						})
					}
				  }
				});
			}else if(_this.isEditable == false){
				_this.isEditable = true			
			}
		},
		toggle(val) {
			if(!this.isEditable){
				this.$refs[val].show();
			}
		},
		deliveryHand(value) {
			this.warehousingEntry.recordDate = value.result
		},
		isEmpty(str){
			return typeof str === 'undefined' || '' === str;
		},
		getImgUrl(image){
		   return this.BASEURL+image;
		}
	},
	onLoad(option) {
		this.warehousingEntry.id = option.id				
		post("warehousing/selectWarehousingEntryById",{"id":this.warehousingEntry.id}).then(res =>{				
			if(200 == res.code){
				this.warehousingEntry.id = res.data.id;
				this.warehousingEntry.warehousingNumber = res.data.warehousingNumber;
				this.warehousingEntry.recordDate = res.data.recordDate;
				this.warehousingEntry.handledBy = res.data.handledBy;
				this.warehousingEntry.supplier = res.data.supplier;
				this.warehousingEntry.remark = res.data.remark;
				let dataProduct = res.data.warehousingEntryProductList;
				for (var i = 0; i < dataProduct.length; i++) {
					// 已入库单产品数量
					let receivedQuantity = dataProduct[i].receivedQuantity;
					for (var j = 0; j < receivedQuantity; j++) {
						let warehousingEntryProduct = JSON.parse(JSON.stringify(dataProduct[i]))
						warehousingEntryProduct.isInWarehouse=true;
						warehousingEntryProduct.isEdit = true;
						this.warehousingEntry.warehousingEntryProductList.push(warehousingEntryProduct)
					}
					// 未入库单产品数量
					let unInventoryQuantity = dataProduct[i].inventoryQuantity - receivedQuantity;
					for (var k = 0; k < unInventoryQuantity; k++) {
						let warehousingEntryProduct = JSON.parse(JSON.stringify(dataProduct[i]))
						warehousingEntryProduct.isInWarehouse=false;
						warehousingEntryProduct.isEdit = false;
						this.warehousingEntry.warehousingEntryProductList.push(warehousingEntryProduct)
					}
				}
			}
		})
	}	
}
</script>

<style scoped>

.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
	position: fixed;
	z-index: 999;
}
.item{
	display: flex;	
	min-height: 44px;
	box-sizing: border-box;
	padding: 8px 12px 8px 8px;
	border-bottom: 1px solid #f1f1f1ff;	
	align-items: center;
	background-color: #fff;	
}
.item .title{
	width: 80px;
	flex-shrink: 0;
	font-size: 15px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
	text-rendering: optimizeLegibility;
}
.item .time{
	flex: 1;
	min-width: 0;
	font-size: 15px;
	line-height: 32px;
	text-align: right;
	color: #333;
	text-rendering: optimizeLegibility;
}
.content{
	flex: 1;
	min-width: 0;
	text-align: right;
	white-space: normal;
	word-break: break-all;
	line-height: 24px;
	font-size: 15px;
	color: #333;
	text-rendering: optimizeLegibility;
}
.item input.content{
	height: 32px;
}
.details-scroll{
	height: calc(100vh - 46px);
	height: calc(100vh - 46px - env(safe-area-inset-bottom));
}
.products-title{
	border-bottom: 0;
}
.products{
	border-top: 2px solid #cbcbcbff;
}

.products .product-content{
	border-bottom: 1px solid #cbcbcbff;
	position: relative;
	padding: 4px 60px 4px 8px;
	box-sizing: border-box;
}
.products .product-content .grid{
	display: flex;
	align-items: center;
	min-height: 24px;
	line-height: 20px;
}
.products .product-content .grid .info{
	width: 50%;
	min-width: 0;
	box-sizing: border-box;
	padding-right: 4px;
	font-size: 14px;
	color: #333;
	white-space: nowrap;  
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 显示省略号 */
	text-rendering: optimizeLegibility;
}
.choice {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	min-height: 40px;
}
.choice checkbox /deep/ .uni-checkbox-input,
.choice checkbox /deep/ .wx-checkbox-input{
	margin-right: 0;
}
.products .product-content .inventory-row{
	min-height: 40px;
}
.products .product-content .inventory-row .info{
	width: auto;
	flex: 1;
	white-space: normal;
}
.products .product-content .inventory-row .info:first-child{
	flex: 0 0 28%;
}

.bottom-bar {  
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 39px;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  background-color: #fff;
  border-top: 1px solid #cbcbcbff;
  display: flex;
  align-items: center; 
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


.product-actions{
	position: absolute;
	right: 4px;
	top: 4px;
	bottom: 4px;
	width: 48px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
}
</style>

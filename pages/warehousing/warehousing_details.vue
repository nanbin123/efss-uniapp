<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y :show-scrollbar="false" :enhanced="true" style="height: calc(100vh - 46px);" @scrolltolower="onReachBottom">
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
			<text class="title">入库单号</text>	
			<text class="content">{{warehousingEntry.warehousingNumber}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')" mode=""></image>
			<text class="title">记录日期</text>
			<view  @tap="toggle('record_date')" class="time" :style="{color:isEmpty(warehousingEntry.recordDate) ?'#a0a0a0':'#333'}">{{isEmpty(warehousingEntry.recordDate)? "请选择记录日期":warehousingEntry.recordDate}}</view>
			<cPicker mode='date' :pageData="warehousingEntry.recordDate" @confirm="deliveryHand" ref="record_date"></cPicker>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/handled_by.png')" mode=""></image>
			<text class="title">操作人</text>
			<text class="content">{{warehousingEntry.handledBy}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/supplier.png')"></image>
			<text class="title">供应商</text>	
			<text class="content">{{warehousingEntry.supplier}}</text>	
		</view>		
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
			<text  class="title">备注 </text>
			<input v-model="warehousingEntry.remark" class="content" :disabled="isEditable">
		</view>

		
		<view class="products">
			<view class="item" style="border-bottom: 0;padding-bottom: 0;">
				<image class="img" :src="getImgUrl('static/image/warehousing/choose_product.png')"></image>
				<text class="title">产品明细</text>
			</view>
			
			<view class="product-content" v-for="(item,index) in warehousingEntry.warehousingEntryProductList">
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
						<text class="info" style="width: 40%;">尺寸：{{item.size}}</text>
					</view>	
					<view class="grid">
						<text class="info" style="color: #e96225ff;">数量：1</text>	
						<text class="info"  style="color: #e96225ff;">是否入库：{{item.isInWarehouse == true ?'已入库':'未入库'}}</text>
						<checkbox-group class="choice" @change="onCheckchange($event,item)">							
							<checkbox value="isInWarehouse":checked="item.isInWarehouse" :disabled="isDisabled(item.isEdit)" />
						</checkbox-group>
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
	white-space: nowrap; /* 文字不换行 */
	text-rendering: optimizeLegibility;
}
.item .time{
	margin-left: auto;
	text-align: right;
	padding-right: 12px;
}
.content{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	white-space: nowrap;
	font-size: 15px;
	color: #333;
}
.products{
	border-top: 2px solid #cbcbcbff;
}

.products .product-content{
	border-bottom: 1px solid #cbcbcbff;
	margin-left: 5px ;
	margin-top: 5px;
	position: relative;
}
.products .product-content .grid{
	display: flex;
	line-height: 20px;
}
.products .product-content .grid .info{
	width: 50%;
	color: #030303ff;
	font-size: 14px;
	color: #333;
	white-space: nowrap;  
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 显示省略号 */
	text-rendering: optimizeLegibility;
}
.choice {
	position: absolute;
	right: 10px;
	bottom: 5px;
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

</style>

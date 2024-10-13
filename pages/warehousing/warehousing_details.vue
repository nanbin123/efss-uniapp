<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>	
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/warehousing/warehousing-number.png')"></image>
		<text class="title">入库单号</text>	
		<text class="content">{{warehousingEntry.warehousingNumber}}</text>	
	</view>
	<view class="item">
		<image class="img" :src="getImgUrl('static/image/warehousing/record_date.png')" mode=""></image>
		<text class="title">记录日期</text>
		<input v-model="warehousingEntry.recordDate" :disabled="isEditable"  type="text" placeholder-class="input-placeholder" :placeholder="isEditable ? '' : '请选择记录日期' ">
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
		<text class="title">备注 </text>
		<text class="content">{{warehousingEntry.remark}}</text>
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
				<text class="info"  style="color: #e96225ff;">是否入库：已入库</text>
				<checkbox class="choice" checked="true" disabled="true"/>	
			</view>		
					
		</view>
<!-- 		<view class="product-list">
			<view class="grid">
				<text class="info">品名：长茶几</text>
				<text class="info">型号：7707-C</text>
				<text class="info">产地：东莞</text>
			</view>
			<view class="grid">				
				<text class="info">颜色：胡桃色</text>
				<text class="info">材质：楸木</text>
				<text class="info" style="width: 40%;">尺寸：1400*800*500</text>
			</view>
			<view class="choice">
				<text class="delivery-status">未入库</text>
				<checkbox checked="true"/>				
			</view>			
		</view> -->
	</view>
<!-- 	<view class="btn">
		<button>确定</button>
	</view> -->

	<view class="bottom-bar">
		  <text class="delete" @click="deleteWarehousing()">{{ isEditable ? '删除' : '取消'  }}</text>		 
		  <text class="edit"  @click="editWarehousing()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>

</template>
<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				isEditable: true,
				warehousingEntry:{}
			}
		},
		methods: {
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
									  title: '删除销售订单成功',
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
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
				this.warehousingEntry.id = option.id				
				post("warehousing/selectWarehousingEntryById",{"id":this.warehousingEntry.id}).then(res =>{				
					if(200 == res.code){
						this.warehousingEntry = res.data
						uni.hideLoading(); 
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
.content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
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
	transform:scale(0.9);
	position: absolute;
	right: 10px;
	bottom: 1px;
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

</style>

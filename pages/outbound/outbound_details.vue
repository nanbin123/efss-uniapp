<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y :show-scrollbar="false" :enhanced="true" style="height: calc(100vh - 46px);" @scrolltolower="onReachBottom">
		<view class="item">
			<image class="img" style="width: 19px;height: 20px;" :src="getImgUrl('static/image/outbound/order_number.png')"></image>
			<text class="title">订单编号:</text>	
			<text class="content">{{outbound.orderNumber}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/cusomer_name.png')" ></image>
			<text class="title">客户姓名:</text>	
			<text class="content">{{outbound.customerName}}</text>	
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/cusomer/customer_phone.png')"></image>
			<text class="title">电话:</text>	
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
			<image class="img" :src="getImgUrl('static/image/outbound/sales_telephone.png')" ></image>
			<text class="title">销售人电话:</text>	
			<text class="content">{{outbound.orderOperatorPhone}}</text>	
		</view>	
		<view class="products">
			<view class="product-details">
				<image class="img" :src="getImgUrl('static/image/outbound/product_details.png')"></image>
				<text class="title">产品明细</text>
			</view>
			<view class="product" v-for="(item,index) in outbound.outboundProductList">
				<view class="product-basic">
					<image class="img" :src="getImgUrl('static/image/茶几.png')"></image>
					<view class="product-content" @click="checkOutboundProduct(item)">
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
					<text class="info" style="width: 30%;">订单数：{{item.orderProductNumber}}</text>
					<text class="info"  style="width: 30%;color: #e96225ff;">是否出库：{{item.isOutbound == true ?'已出库':'未出库'}}</text>
				</view>
				<view class="is_outbound">
					<checkbox-group class="choice" @change="onCheckchange($event,item)">
						<checkbox value="isOutbound" :checked="item.isOutbound" :disabled="isDisabled(item.isEdit)" />
					</checkbox-group>
				</view>
				
			</view>
		</view>
	</scroll-view>
	<!-- <view @click="confirm()">
		<button>确定</button>
	</view> -->

	<view class="bottom-bar">
		<text class="delete" @click="deleteOutbound()">{{ isEditable ? '删除' : '取消'  }}</text>		 
		<text class="edit"  @click="editOutbound()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				outbound:{outboundProductList:[]},
				isEditable: true
			}
		},
		methods: {
			checkOutboundProduct(item){
				if(!this.isEditable){
					item.isOutbound = !item.isOutbound;
				}
			},
			onCheckchange(e,item){
				item.isOutbound = e.detail.value.includes("isOutbound"); 
			},
			isDisabled(itemIsEdit) {				
				if(this.isEditable){
					return this.isEditable;
				}else{
					return itemIsEdit;
				}
			},
			//修改操作
			editOutbound(){
				if(this.isEditable == true){
					this.isEditable = false	
				}else if(this.isEditable == false){					
					//对产品进行分组汇总
					const data = this.outbound.outboundProductList;
					const groupSum = data.reduce((result, currentItem) => {
						if(currentItem.isOutbound === true && currentItem.isEdit === false){
							const group = currentItem["id"];
							result[group] = result[group] || { "id": group, "outboundNumber": 0 };						
							result[group].outboundNumber++;
						} 
						return result;
					}, {});
					let outboundProductList = Object.keys(groupSum).map(function(key) {
						return groupSum[key];
					});					
					post("outbound/updateOutboundNumber", JSON.stringify(outboundProductList),'application/json').then(res => {
						if(200 == res.code){
							this.getOutboundById();
							this.isEditable = true
							uni.showToast({
								title: '出库成功',
								icon: 'none',
								duration: 20000
							})
						}
					})
				}
			},
			deleteOutbound(){
				let _this = this	
				if(_this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除出库单',
					  success: (res)=> {						 
						if (res.confirm) {
							post("outbound/deleteOutboundById",{"id":_this.outbound.id}).then(res =>{								
								if(200 == res.code){
									_this.isEditable = true;
									_this.outbound ={};
									uni.showToast({
									  title: '删除出库单成功',
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
			getOutboundById(){
				post("outbound/selectOutboundById",{"id":this.outbound.id}).then(res =>{
					if(200 == res.code){
						this.outbound = {outboundProductList:[]};
						let resData = res.data;
						console.log("resData",JSON.stringify(resData))
						this.outbound.id = resData.id;
						this.outbound.orderNumber = resData.orderNumber;
						this.outbound.customerName = resData.customerName;
						this.outbound.phone = resData.phone;
						this.outbound.address = resData.address;
						this.outbound.orderOperator = resData.orderOperator;
						this.outbound.orderOperatorPhone = resData.orderOperatorPhone;
						let dataProduct = res.data.outboundProductList;
						for (var i = 0; i < dataProduct.length; i++) {				
							// 已出库数量
							let outboundNumber = dataProduct[i].outboundNumber;	
							console.log("outboundNumber",outboundNumber)
							for (var j = 0; j < outboundNumber; j++) {
								let outboundProduct = JSON.parse(JSON.stringify(dataProduct[i]))
								outboundProduct.isOutbound=true;
								outboundProduct.isEdit = true;
								this.outbound.outboundProductList.push(outboundProduct)
							}
							//销售订单数量
							let orderProductNumber = dataProduct[i].orderProductNumber;
							// 待出库数量
							let toBeShippedOutNumber = orderProductNumber - outboundNumber;
							for (var j = 0; j < toBeShippedOutNumber; j++) {
								let outboundProduct = JSON.parse(JSON.stringify(dataProduct[i]))
								outboundProduct.isOutbound=false;
								outboundProduct.isEdit = false;
								this.outbound.outboundProductList.push(outboundProduct)
							}
						}
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
			this.outbound.id = option.id;
			this.getOutboundById();
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
	align-items: center;
	padding: 8px 0;
	border-bottom: 1px solid #efeef3ff;
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
	padding: 8px 0;
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
	position: relative;
}
.product-basic{
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
.product .product-content .grid{
	display: flex;
	line-height: 17px;
}
.product .grid .info{
	width: 50%;
	font-size: 14px;
	color: #333;
	white-space: nowrap;  
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 显示省略号 */
	text-rendering: optimizeLegibility;
}
.product .is_outbound{
	position: absolute;
	bottom: 30%;
	right: 10px;
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

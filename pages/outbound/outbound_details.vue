<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y :show-scrollbar="false" :enhanced="true" style="height: calc(100vh - 49px);" @scrolltolower="onReachBottom">
		<view class="item">
			<text class="title">订单编号:</text>	
			<text class="content">{{outbound.orderNumber}}</text>	
		</view>
		<view class="item">
			<text class="title">客户姓名:</text>	
			<text class="content">{{outbound.customerName}}</text>	
		</view>
		<view class="item">
			<text class="title">电话:</text>	
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
		<view class="products">
			<view class="product-details">
				<text class="title">产品明细</text>
			</view>
			<view class="product" v-for="(item,index) in outbound.outboundProductList">
				<view class="product-basic">
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
				<view class="product-inventory">
					<text class="info">库存数：100</text>
					<text class="info">订单数：{{item.orderProductNumber}}</text>
					<text class="info inventory-status">是否出库：{{item.isOutbound == true ?'已出库':'未出库'}}</text>
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
			// 查看已保存在出库产品图片表中的图片，支持左右滑动预览。
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
								duration: 2000
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
	box-sizing: border-box;
	min-height: 48px;
	padding: 9px 12px;
	border-bottom: 1px solid #efeef3ff;
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
.products{
	border-top: 7px solid #efeef3ff;
}
.product-details{
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-height: 44px;
	padding: 9px 12px;
}
.product-details .title{
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
	padding: 6px 12px 2px;
}
.product .product-inventory{
	display: flex;
	align-items: center;
	gap: 3px;
	font-size: 15px;
	color: rgb(233, 98, 37);
	padding: 4px 44px 8px 12px;
	box-sizing: border-box;
}
.product .product-content{	
	flex: 1;
	min-width: 0;
	padding-right: 56px;
	box-sizing: border-box;
}
.product .product-content .grid{
	display: flex;
	line-height: 20px;
}
.product .grid .info{
	flex: 1;
	min-width: 0;
	font-size: 15px;
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
	font-size: 15px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.product-inventory .inventory-status{
	color: #e96225ff;
}
.product .is_outbound{
	position: absolute;
	bottom: 8px;
	right: 2px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
}
.product .is_outbound .choice{
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.product .is_outbound checkbox{
	transform: scale(1.1);
	transform-origin: center;
}
.product-actions{
	position: absolute;
	top: 4px;
	right: 4px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	pointer-events: none;
}
.product-action{
	pointer-events: auto;
	width: 46px;
	min-height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #38c1b9;
}
.product-action-label{
	margin-top: 2px;
	font-size: 15px;
	line-height: 20px;
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
}
.gallery-count{
	position: absolute;
	top: -7px;
	right: -8px;
	min-width: 18px;
	height: 18px;
	padding: 0 3px;
	border-radius: 9px;
	box-sizing: border-box;
	background-color: #38c1b9;
	color: #fff;
	font-size: 12px;
	line-height: 18px;
	text-align: center;
}
@media screen and (max-width: 430px) {
	.product .product-content .grid{
		flex-direction: column;
		align-items: flex-start;
		line-height: 24px;
	}
	.product .grid .info{
		flex: none;
		width: 100%;
		line-height: 24px;
	}
}
.bottom-bar {  
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid #cbcbcbff;
  display: flex;
  align-items: center; 
}
.delete {
  flex: 1;
  height: 44px;
  line-height: 44px;
  color: #38c1b9;
  margin-left: 10px;
}
.transferOrder{
	flex: 1;
	height: 44px;
	line-height: 44px;
	text-align:center;
	color: #38c1b9;
}
.edit {
	flex: 1;
	height: 100%;
	line-height: 44px;
	text-align:right;
	color: #38c1b9;
	margin-right: 10px;
}
</style>

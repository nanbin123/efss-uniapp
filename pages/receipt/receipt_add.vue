<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 35px);">
		<view class="item"   @click="importOrder()">
			<image class="img" :src="getImgUrl('static/image/receipt/import-order.png')" ></image>
			<text class="title">导入订单</text>
			<image class="right-img" :src="getImgUrl('static/image/receipt/add.png')"></image>
		</view>
		<view class="item">
			<image class="img" style="width: 19px;height: 21px;" :src="getImgUrl('static/image/order/order_number.png')" ></image>
			<text class="title">订单编号 :</text>
			<text class="right-content">{{receipt.orderNumber}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/cusomer_name_add.png')"></image>
			<text class="title">客户姓名 :</text>
			<text class="right-content">{{receipt.customerName}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/total_amount.png')" ></image>
			<text class="title">订单总金额:</text>
			<text class="right-content">{{receipt.totalAmount}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/receipt/price_after_discount.png')"></image>
			<text  class="title">折扣:</text>
			<input class="right-content" style="padding-right: 0" disabled="disabled" v-model="discount">
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/order_actual_amount.png')"></image>
			<text  class="title">订单实收金额:</text>
			<text class="right-content">{{receipt.actualmoney}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/order/order_actual_amount.png')"></image>
			<text  class="title">已收款:</text>
			<text class="right-content">{{receipt.received}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/receipt/to_be_received.png')"></image>
			<text  class="title">待收款:</text>
			<text class="right-content">{{receipt.tobeReceived}}</text>
		</view>
		<view class="item">
			<image class="img" :src="getImgUrl('static/image/receipt/amount_collected.png')"></image>
			<text  class="title">收款金额:</text>
			<input v-model="receipt.amountCollected"  confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入收款金额">
		</view>
		<view class="voucher">
			<text  class="voucher-title">上传收款凭证</text>
			<view class="voucher-img">
				<view class="voucher-item" v-for="(item, index) in receipt.voucherList">				 
					<image @tap="onPreviewImage(index)" :src="getVoucherUrl(item.voucherUrl)" class="voucher-item-img"></image> 
					<view  @tap="onDeleteThis(index)" class="voucher-remove ">
						<text>X</text>
					</view>
				</view>
				<image @tap="onChooseImage" class="voucher-add" :src="getImgUrl('static/image/receipt/upload-voucher.png')"></image>
			</view>
		</view>
		<view class="remarks">
			<textarea v-model="receipt.remark" maxlength="200" placeholder="请输入备注:" placeholder-class="textarea-placeholder" @input="handInput"></textarea>
			<label for="forFocus" class="textarea-count ">{{textateaL}}/{{maxlength}}</label>
		</view>
	</scroll-view>
	<view class="footer" @click="addReceiptForm()">
		<view>保存</view>
	</view>

</template>

<script>
	import {get,post,uploadFiles} from "../../components/utils/request.js"
	export default {
		data() {
			return {				
				textateaL: 0,
				maxlength:200,
				receipt:{
					voucherList:[]
				}
			}
		},
		computed:{
			discount(){//折扣计算		
				if(this.receipt.totalAmount == 0  || typeof this.receipt.totalAmount == 'undefined'){
					return ''
				}
				if(this.receipt.actualmoney == 0 || typeof this.receipt.actualmoney == 'undefined'){
					return ''
				}
				let discount = this.receipt.actualmoney/this.receipt.totalAmount*100;				
				return discount == 0 ? '':discount*100;
			}
		},
		methods: {
			importOrder(){
				let that = this
				uni.navigateTo({
					url:'/pages/receipt/import_order'
				})
			},
			getOrderById(orderId){
				post("receipt/selectOrderById",{"orderFormId":orderId}).then(res =>{
					if(200 == res.code){
						this.receipt = res.data
						uni.hideLoading();
					}
				})
			},
			addReceiptForm(){
				post("receipt/insertReceipt",JSON.stringify(this.receipt),'application/json').then(res =>{
					if(200 == res.code){
						uni.hideLoading();
						uni.showToast({
							title: '添加收款单成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			handInput(value) {
				let val = value.detail.value;
				this.textateaL = val.length;
			},
			onChooseImage(){
				uni.chooseImage({
					count: 9,//最多可以选择的图片张
					sizeType: ['original', 'compressed'],//original 原图，compressed 压缩图
					sourceType: ['album', 'camera'],//album 从相册选图，camera 使用相机
					success: (res) => {
						let that = this;							
						if (res.tempFilePaths.length > 0) {							
							let tempFilePaths = [];
							for (var i = 0; i < res.tempFilePaths.length; i++) {
								let obj =new Object();
								obj.uri = res.tempFiles[i].path;
								tempFilePaths.push(obj);
							}									
							let size = res.tempFiles[0].size
							if (size < 8388608) {						
								uploadFiles("receipt/voucher",tempFilePaths).then(res =>{									
									if(200 == res.code){
										let that = this;
										that.receipt.voucherList = that.receipt.voucherList.concat(res.data);
										uni.hideLoading();
									}
								})
							}else{
								uni.showToast({
									title: '超出限制大小',
									icon: "none"
								})
							}
						}else{
							uni.showToast({
								title: '文件不存在',
								icon: "none"
							})
						}
					}
				});
			},	
			//预览图片
			onPreviewImage(index) {
				let imageUrl=[];
				for (var i = 0; i < this.receipt.voucherList.length; i++) {
					imageUrl.push(this.receipt.voucherList[i].voucher)
				}
				uni.previewImage({
					current: index,
					urls:imageUrl
				});
			},
			//删除指定图片
			onDeleteThis(index){
				uni.showModal({
					title: '提示',
					content: '您确定删除吗？',
					success: (res)=> {
						if(res.confirm) {
							this.receipt.voucherList.splice(index, 1);
							wx.showToast({
							    title: '删除成功',
							    icon: 'success',
							    duration: 1000
							});
						}
					}
				});
			},
			getVoucherUrl(image){
				// 处理上传的图片比baseUrl多一个/
				let baseUrl = this.BASEURL;
				let baseSubUrl =  baseUrl.substring(0, baseUrl.length - 1);				
				return baseSubUrl+image;
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		}
	}
</script>

<style>
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
	border-bottom: 1px solid #efeef3ff;
	align-items: center;	
	background-color: #fff;	
}
.item .img{
	margin-left: 2px;
	width: 18px;
	height: 18px;		
}
.item .title{
	margin-left: 3px;
	font-size: 15px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
	text-rendering: optimizeLegibility;
}
.item .right-content{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item input{
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
}
.item .right-img{
	margin-left: auto;
	margin-right: 15px;
	width: 25px;
	height: 25px;
}
.item .input-placeholder{
	font-size: 16px;
	text-align: right;
	color: #aaa;
}
.voucher{	
	padding: 7px 0 0 15px;	
}
.voucher-title{
	font-size: 18px;
	font-weight: 600;
}
.voucher-img{
	display: flex;
	flex-wrap: wrap;
}
.voucher-add{
	width: 80px;
	height: 80px;
	margin-top: 20px;
	margin-left: 20px;
}
.voucher-item{	
	position: relative;
	margin-top: 15px;
	margin-right:15px;
	flex: 0 calc(33.3% - 15px);	
}
.voucher-item-img{
	display: block;
	width: 100%;
	height: 100px;
}
.voucher-remove{
	background-color: #D1372C;
	color: #fff;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	opacity: 0.8;
	position: absolute;
	z-index: 2;
	cursor: pointer;
	box-sizing: border-box;
	top: 0;
	right: 0;
	border-radius: 0 0 0 100%;
}
.voucher-remove text{
	transform: scale(0.8);
	position: absolute;
	right: 3px;
}
.textarea-placeholder{
	font-size: 15px;
}
.remarks{
	overflow: hidden;
	position: relative;	
	border-bottom: 1px solid #f1f1f1ff;	
	padding: 10px;
}
.remarks textarea {
	height: 60px;	
	width: 100%;	
	font-size: 15px;
	color: #333;
}
.textarea-count {
	position: absolute;
	font-size: 12px;
	line-height: 16px;
	bottom: 5px;
	right: 0px;
	color: #999;
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
</style>

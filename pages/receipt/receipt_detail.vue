<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y style="height: calc(100vh - 90px);">
		<view class="item">
			<image class="img" style="width: 19px;height: 21px;" :src="getImgUrl('static/image/order/order_number.png')"></image>
			<text class="title">订单编号 :</text>
			<text class="right-content">{{receipt.orderNumber}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/order/cusomer_name_add.png')"></image>
			<text class="title">客户姓名 :</text>
			<text class="right-content">{{receipt.customerName}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/order/total_amount.png')"></image>
			<text class="title">订单总金额:</text>
			<text class="right-content">{{receipt.totalAmount}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/receipt/price_after_discount.png')" ></image>
			<text  class="title">折扣:</text>
			<input class="right-content" style="padding-right: 0" disabled="disabled" v-model="discount">
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/order/order_actual_amount.png')" ></image>
			<text  class="title">订单实收金额:</text>
			<text class="right-content">{{receipt.actualmoney}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/order/order_actual_amount.png')" ></image>
			<text  class="title">已收款:</text>
			<text  class="right-content">{{receipt.received}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/receipt/to_be_received.png')" ></image>
			<text  class="title">待收款:</text>
			<text  class="right-content">{{receipt.tobeReceived}}</text>
		</view>
		<view class="item">
			<image class="img"  :src="getImgUrl('static/image/receipt/amount_collected.png')"></image>
			<text  class="title">收款金额:</text>
			<input class="right-content" v-model="receipt.amountCollected" 
				:focus='amountCollectedFocus'  @blur='amountCollectedFocus = false' :disabled="isEditable" type="number" placeholder-class="input-placeholder" placeholder="请输入收款金额">
		</view>
		<view class="voucher">
			<text  class="voucher-title">上传收款凭证</text>
			<view class="voucher-img">
				<view class="voucher-item" v-for="(item, index) in receipt.voucherList">
					<image @tap="onPreviewImage(index)"  :src="getVoucherUrl(item.voucherUrl)" class="voucher-item-img"></image>
					<view  v-if="!isEditable" @tap="onDeleteThis(index)" class="voucher-remove">
						<text>X</text>
					</view>
				</view>
				<image @tap="onChooseImage" class="voucher-add"  :src="getImgUrl('static/image/receipt/upload-voucher.png')" ></image>
			</view>
		</view>
		<view class="remarks">
			<textarea v-model="receipt.remark" maxlength="200" placeholder="请输入备注:" placeholder-class="textarea-placeholder" 
			:disabled="isEditable" @input="handInput"></textarea>
			<label for="forFocus" class="textarea-count ">{{textateaL}}/{{maxlength}}</label>
		</view>
	</scroll-view>
	
	<view class="bottom-bar">
		<text class="delete" @click="deleteReceipt()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		<text class="edit"  @click="editOrderForm()">{{ isEditable ? '编辑' : '保存' }}</text>
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
					voucherList: []
				},
				isEditable: true,
				amountCollectedFocus:false
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
		onLoad(option) {
			this.receipt.id = option.id
			post("receipt/selectReceiptById",{"id":this.receipt.id}).then(res =>{				
				if(200 == res.code){
					this.receipt = res.data
					this.textateaL = this.receipt.remark.length;
				}
			})
		},
		methods: {
			editOrderForm(){
				if(this.isEditable == true){
					this.isEditable = false					
				}else if(this.isEditable == false){					
					if(!this.receipt.amountCollected){						
						this.amountCollectedFocus = true						
						uni.showToast({
							title: '收款金额不能为空',
							icon: 'none'
						});
						return
					}					
					let receipt={
						id:this.receipt.id,
						amountCollected:this.receipt.amountCollected,
						remark:this.receipt.remark
					}
					let voucherList = this.receipt.voucherList.map(item =>{
						return {id: item.id}
					});
					receipt.voucherList = voucherList;		
					post("receipt/updateReceiptById",JSON.stringify(receipt),'application/json').then(res =>{
						if(200 == res.code){
							this.isEditable = true
							uni.showToast({
							  title: '修改收款单成功',
							  icon: 'none', 
							  duration: 2000 
							});
						}
					})
				}
			},
			deleteReceipt(){
				let that = this
				if(!that.receipt.id){
					return;
				}
				if(this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除收款单',
					  success: (res)=> {						 
						if (res.confirm) {
							post("receipt/deleteReceiptById",{"id":that.receipt.id}).then(res =>{
								if(200 == res.code){
									this.isEditable = true;
									that.receipt ={};
									uni.showToast({
									  title: '删除收款单成功',
									  icon: 'none', 
									  duration: 2000 
									});
								}
							})
						}
					  }
					});
				}else if(this.isEditable == false){
					this.isEditable = true			
				}
			},
			handInput(value) {
				let val = value.detail.value;
				this.textateaL = val.length;
			},
			onChooseImage(){
				if(!this.isEditable){
					uni.chooseImage({
						count: 9,//最多可以选择的图片张
						sizeType: ['original', 'compressed'],//original 原图，compressed 压缩图
						sourceType: ['album', 'camera'],//album 从相册选图，camera 使用相机
						success: (res) => {					
							if (res.tempFiles.length > 0) {
								let tempFilePaths = [];
								for (var i = 0; i < res.tempFilePaths.length; i++) {
									uploadFiles("receipt/voucher",res.tempFiles[i].path).then(res =>{
										if(200 == res.code){
											let that = this;											
											that.receipt.voucherList = that.receipt.voucherList.concat(res.data);
											uni.hideLoading();
										}
									})
								}
							}
						}
					});
				}
			},
			//预览图片
			onPreviewImage(index) {
				let imageUrl=[];
				for (var i = 0; i < this.receipt.voucherList.length; i++) {					
					let voucherUrl = this.getVoucherUrl(this.receipt.voucherList[i].voucherUrl)
					imageUrl.push(voucherUrl)
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
	border-bottom: 1px solid #efeef3ff;
	align-items: center;
	background-color: #fff;	
}
.item .img{
	margin-left: 2px;
	width: 20px;
	height: 20px;	
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
.item input {
	flex-grow: 1;
	padding-right: 12px;
	text-align: right;
	margin-left: 20px;
	text-rendering: optimizeLegibility;
	font-size: 15px;
	color: #333;
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
  justify-content: space-between; 
}
.delete {
  width:50%;
  height: 39px;
  line-height: 39px;
  color: #00a7e2ff;
  margin-left: 10px;
}

.edit {
	width:50%;
	height: 100%;
	line-height: 39px;
	text-align:right;
	color: #00a7e2ff;
	margin-right: 10px;
}
</style>
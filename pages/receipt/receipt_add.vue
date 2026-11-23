<template>
	<view class="receipt-page">
		<view class="head"></view>
		<scroll-view scroll-y class="receipt-content">
			<view class="item"   @click="importOrder()">
				<text class="title">导入订单</text>
				<image class="right-img" :src="getImgUrl('static/image/receipt/add.png')"></image>
			</view>
			<view class="item">
				<text class="title">订单编号</text>
				<text class="iconfont">&#xe639;</text>
				<text class="right-content">{{receipt.orderNumber}}</text>
			</view>
			<view class="item">
				<text class="title">客户姓名</text>
				<text class="iconfont">&#xe639;</text>
				<text class="right-content">{{receipt.customerName}}</text>
			</view>
			<view class="item">
				<text class="title">客户电话</text>
				<input v-model="receipt.customerPhone" type="text" maxlength="20" confirm-type="next" placeholder-class="input-placeholder" placeholder="请输入客户电话">
			</view>
			<view class="item">
				<text class="title">客户地址</text>
				<input v-model="receipt.customerAddress" type="text" maxlength="100" confirm-type="next" placeholder-class="input-placeholder" placeholder="请输入客户地址">
			</view>
			<view class="item">
				<text class="title">订单总金额</text>
				<text class="right-content">{{receipt.totalAmount}}</text>
			</view>
			<view class="item">
				<text  class="title">折扣</text>
				<input class="right-content" disabled="disabled" :value="discount">
			</view>
			<view class="item">
				<text  class="title">订单实收金额</text>
				<text class="right-content">{{receipt.actualmoney}}</text>
			</view>
			<view class="item">
				<text  class="title">已收款</text>
				<text class="right-content">{{receipt.received}}</text>
			</view>
<!-- 			<view class="item">
				<text  class="title">待收款</text>
				<text class="right-content">{{receipt.tobeReceived}}</text>
			</view> -->
			<view class="item">
				<text  class="title">收款金额</text>
				<text class="iconfont">&#xe639;</text>
				<input :focus="amountCollectedFocus" @blur="amountCollectedFocus = false" v-model="receipt.amountCollected" confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入收款金额">
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
	</view>

</template>

<script>
	import {get,post,uploadFiles} from "../../components/utils/request.js"
	export default {
		data() {
			return {				
				textateaL: 0,
				maxlength:200,
				amountCollectedFocus: false,
				receipt:{
					customerPhone: '',
					customerAddress: '',
					voucherList:[]
				}
			}
		},
		computed:{
			discount(){
				const total = Number(this.receipt.totalAmount);
				const actual = this.receipt.actualmoney;
				if (!Number.isFinite(total) || total <= 0 || actual === null || actual === undefined ||
					String(actual).trim() === '') {
					return '—';
				}
				const received = Number(actual);
				if (!Number.isFinite(received) || received < 0) {
					return '—';
				}
				// 与订单详情一致：实收 / 原价 × 10，例如 800 / 1000 = 8 折。
				return Number((received / total * 10).toFixed(2)) + '折';
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
						this.receipt = {
							...res.data,
							customerPhone: res.data.customerPhone || '',
							customerAddress: res.data.customerAddress || ''
						}
						uni.hideLoading();
					}
				})
			},
			addReceiptForm(){
				if (this.receipt.orderNumber == null || String(this.receipt.orderNumber).trim() === '') {
					uni.showToast({
						title: '订单编号不能为空，请先导入订单',
						icon: 'none'
					});
					return;
				}
				if (this.receipt.customerName == null || String(this.receipt.customerName).trim() === '') {
					uni.showToast({
						title: '客户姓名不能为空，请重新导入订单',
						icon: 'none'
					});
					return;
				}
				if (this.receipt.amountCollected == null || String(this.receipt.amountCollected).trim() === '') {
					this.$nextTick(() => {
						this.amountCollectedFocus = true;
					});
					uni.showToast({
						title: '收款金额不能为空',
						icon: 'none'
					});
					return;
				}
				post("receipt/insertReceipt",JSON.stringify(this.receipt),'application/json').then(res =>{
					if(res && 200 == res.code){
						this.receipt = {
							customerPhone: '',
							customerAddress: '',
							amountCollected: '',
							remark: '',
							voucherList: []
						};
						this.textateaL = 0;
						this.amountCollectedFocus = false;
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
								uploadFiles("receipt/voucher",res.tempFiles[i].path).then(res =>{
									if(200 == res.code){
										that.receipt.voucherList = that.receipt.voucherList.concat(res.data);
										uni.hideLoading();
									}
								})
							}
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

<style scoped>
.receipt-page{
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
	overflow: hidden;
	background-color: #fff;
}
.head{
	flex-shrink: 0;
	height: 10rpx;
	width: 100%;
	background-color:  #efeef3ff;
}
.receipt-content{
	flex: 1;
	height: 0;
	min-height: 0;
}
.item{
	display: flex;
	box-sizing: border-box;
	min-height: 44px;
	padding: 8px 12px 8px 8px;
	border-bottom: 1px solid #efeef3ff;
	align-items: center;	
	background-color: #fff;	
}
.item .title{
	flex-shrink: 0;
	font-size: 14px;
	line-height: 22px;
	color: #333;
	white-space: nowrap; /* 文字不换行 */
	text-rendering: optimizeLegibility;
}
.item .iconfont{
	flex-shrink: 0;
	color: red;
	font-size: 12px;
	margin-left: -5px;
}
.item .right-content,
.item input{
	flex: 1;
	min-width: 0;
	text-align: right;
	margin-left: 12px;
	text-rendering: optimizeLegibility;
	font-size: 14px;
	line-height: 22px;
	color: #333;
}
.item .right-content{
	word-break: break-all;
}
.item .right-img{
	flex-shrink: 0;
	margin-left: auto;
	width: 22px;
	height: 22px;
}
.item .input-placeholder{
	font-size: 14px;
	text-align: right;
	color: #aaa;
}
.voucher{	
	padding: 12px 12px 12px 8px;
}
.voucher-title{
	font-size: 15px;
	line-height: 22px;
	font-weight: 600;
}
.voucher-img{
	display: flex;
	flex-wrap: wrap;
}
.voucher-add,
.voucher-item{
	flex-shrink: 0;
	width: 160rpx;
	height: 160rpx;
	margin: 20rpx 20rpx 0 0;
}
.voucher-item{	
	position: relative;
}
.voucher-item-img{
	display: block;
	width: 100%;
	height: 100%;
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
	font-size: 14px;
}
.remarks{
	overflow: hidden;
	position: relative;	
	border-bottom: 1px solid #f1f1f1ff;	
	padding: 10px 12px 22px 8px;
}
.remarks textarea {
	height: 140rpx;
	width: 100%;	
	font-size: 14px;
	line-height: 22px;
	color: #333;
}
.textarea-count {
	position: absolute;
	font-size: 12px;
	line-height: 16px;
	bottom: 12rpx;
	right: 12px;
	color: #999;
}

.footer{
	flex-shrink: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	font-size: 16px;
	text-align: center;
	line-height: 44px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;	
	width: 100%;
}
</style>

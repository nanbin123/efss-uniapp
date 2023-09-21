<template>
	<view class="wrap">
		<view style="height: 5px;">
			<view class="head"></view>
		</view>
		<view class="item"   @click="importOrder()">
			<image class="img" src="../../static/image/receipt/import-order.png"></image>
			<text class="title">导入订单</text>
			<image class="right-img" src="../../static/image/receipt/add.png"></image>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/order/total_amount.png"></image>
			<text class="title">订单总金额:</text>
			<text class="right-content">2000</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/order/discount.png"></image>
			<text  class="title">折扣:</text>
			<text class="right-content">80%</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/receipt/price_after_discount.png"></image>
			<text  class="title">折扣后总价:</text>
			<text class="right-content">1600</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/order/order_actual_amount.png"></image>
			<text  class="title">订单实收金额:</text>
			<text class="right-content">1500</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/order/order_actual_amount.png"></image>
			<text  class="title">已收款:</text>
			<text class="right-content">1500</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/receipt/to_be_received.png"></image>
			<text  class="title">待收款:</text>
			<text class="right-content">0</text>
		</view>
		<view class="item">
			<image class="img" src="../../static/image/receipt/amount_collected.png"></image>
			<text  class="title">收款金额:</text>
			<input confirm-type="next" type="number" placeholder-class="input-placeholder" placeholder="请输入收款金额">
		</view>
		<view class="voucher">
			<text  class="voucher-title">上传收款凭证</text>
			<view class="voucher-img">
				<view class="voucher-item" v-for="(item, index) in voucherList">
					<image @tap="onPreviewImage(index)"  :src="item" class="voucher-item-img"></image>
					<view  @tap="onDeleteThis(index)" class="voucher-remove ">
						<text>X</text>
					</view>
				</view>
				<image @tap="onChooseImage" class="voucher-add" src="../../static/image/receipt/upload-voucher.png"></image>
			</view>
		</view>
		<view class="remarks">
			<textarea maxlength="200" placeholder="请输入备注:" placeholder-class="textarea-placeholder" @input="handInput"></textarea>
			<label for="forFocus" class="textarea-count ">{{textateaL}}/{{maxlength}}</label>
		</view>
		<view class="btn">
			<button>保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				voucherList: [],
				textateaL: 0,
				maxlength:200
			}
		},
		methods: {
			importOrder(){
				let that = this
				uni.navigateTo({
					url:'/pages/receipt/import_order'
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
						if (res.tempFiles.length > 0) {
							const tempFilePaths = res.tempFiles[0].path
							const size = res.tempFiles[0].size
							if (size < 8388608) {
								uni.showLoading({
								    title: '上传中'
								});
								setTimeout(()=>{								  
									this.voucherList.push(tempFilePaths)									
								    uni.hideLoading();
								}, 500);
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
				uni.previewImage({
					current: index,
					urls: this.voucherList
				});
			},
			//删除指定图片
			onDeleteThis(index){
				uni.showModal({
					title: '提示',
					content: '您确定删除吗？',
					success: (res)=> {
						if(res.confirm) {
							this.voucherList.splice(index, 1);
							wx.showToast({
							    title: '删除成功',
							    icon: 'success',
							    duration: 1000
							});
						}
					}
				});
			}
		}
	}
</script>

<style>

.wrap{
	position: relative;
	width: 100%;
	height: 100%;
}
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
	padding: 10px;
	border-bottom: 1px solid #efeef3ff;
}
.item .img{
	width: 18px;
	height: 18px;		
}
.item .title{
	white-space: nowrap;
	padding: 0 15px;
	font-size: 15px;
	color: #333;
}
.item .right-content{
	white-space: nowrap;
	font-size: 15px;
	color: #333;	
	margin-left: auto;
	margin-right: 10px;
	text-align: right;	
}
.item .right-img{
	margin-left: auto;
	margin-right: 15px;
	width: 25px;
	height: 25px;
}
.item input{
	font-size: 35rpx;
	flex-grow: 1;
	padding-right: 35rpx;
	text-align: right;
}

.item .input-placeholder{
	font-size: 30rpx;
	text-align: right;
	color: #aaa;
}
.voucher{	
	padding: 15rpx 0 0 30rpx;
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
	width: 120rpx;
	height: 80px;
	margin-top: 25px;
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
.remarks{
	overflow: hidden;
	position: relative;	
	border-bottom: 1px solid #f1f1f1ff;	
	padding: 20rpx;
}
.remarks textarea {
	height: 120rpx;	
	width: 100%;	
	font-size: 35rpx;
	color: #333;
}
.textarea-count {
	position: absolute;
	font-size: 24rpx;
	line-height: 32rpx;
	bottom: 10rpx;
	right: 0px;
	color: #999;
}
.btn{
	width: 80%;
	position: relative;
	top: 30rpx;
	margin: 0 auto;
}
.btn button{
	background-color: #00a7e2ff;
	border: 0;
	color: #daf2fbff;	
}
</style>

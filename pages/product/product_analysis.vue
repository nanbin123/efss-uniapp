<template>
	<z-paging ref="paging" v-model="productAnalysisList" @query="queryList">
		<template #top>
			<view class="head">
				<view class="screen-bar">
					<view class="screen-bar-item" @tap.stop="itemClick" >
						<view class="bar-item-text">
							{{titleText}}
						</view>
						<view class="filter-chevron" :class="{'is-open': show}"></view>
					</view>
 					<view class="datestartAndEnd">
						<view class="dateStart">				
							<view class="date-trigger" @tap="toggle('start_date')">
								<text class="date-placeholder" v-if="!dateStart">开始时间</text>
								<text class="date-value" v-else>{{dateStart}}</text>
								<view class="filter-chevron date-chevron"></view>
							</view>
							<cPicker mode='date' @confirm="dateStartHand" ref="start_date"></cPicker>
						</view>
						<view class="dateEnd">				
							<view class="date-trigger" @tap="toggle('end_date')">
								<text class="date-placeholder" v-if="!dateEnd">结束时间</text>
								<text class="date-value" v-else>{{dateEnd}}</text>
								<view class="filter-chevron date-chevron"></view>
							</view>
							<cPicker mode='date' @confirm="dateEndHand" ref="end_date"></cPicker>
						</view>
					</view>
					<button class="reset-button" @tap.stop="resetSearch">重置</button>
					<view class="dropdown-box" :style="{'opacity':show?'1':'0','display':show?'block':'none'}">				
						<view class="dropdown-item" :class="{'is-selected': titleValue === item.value}" v-for="(item,index) in itemArr" :key="index" @tap.stop="subItemClick(index)">
							<text>{{item.text}}</text>
							<view class="selected-check" v-if="titleValue === item.value"></view>
						</view>				
					</view>
				</view>
			</view>
		</template>
		<!-- 头部遮罩层 -->
		<view class="bg-mask" :class="[show?'bg-mask-show':'']" @tap="maskClose" @touchmove="touchControl"></view>
		<!-- 产品列表 -->
		<view class="product"  v-for="(item,index) in productAnalysisList"  :key="index">
			<view class="product-content">
				<view  class="item">
					<text class="info">品名：{{item.productName}}</text>
					<text class="info">型号：{{item.type}}</text>					
				</view>
				<view class="item">
					<text class="info">尺寸：1400*800*500</text>
					<text class="info" style="color: #1aa1cfff;">产地：{{item.production}}</text>					
				</view>
				<view class="item">
					<text class="info" >材质：{{item.texture}}</text>
					<text class="info" >颜色：{{item.color}}</text>
					
				</view>
				<view class="item">
					<view class="info">零售价：<text style="color: #d6a950ff; ">￥{{item.retailPrice}}</text></view>
					<view class="info">销售额：<text style="color: #d6a950ff;">￥{{item.salesAmount}}</text></view>
				</view>
				<view class="item">
					<view class="info">销售量：<text style="color: #d6a950ff;">{{item.salesQuantity}}</text></view>
				</view>
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
		</view>
		
	</z-paging>

</template>

<script>
import {get,post} from "../../components/utils/request.js"	
import cPicker from "../../components/c-picker/c-picker.vue"

	export default {
		components: {
			cPicker
		},
		data() {
			return {
				productAnalysisList:[],
				show: false,
				titleText: '按销额',
				titleValue: 'salesAmount',//默认按销额排序
				itemArr:  [
					{
						text: '全部',
						value: ''
					},{
						text: '按销额',
						value: 'salesAmount'
					}, {
						text: '按销量',
						value: 'salesQuantity'
					}
				],
				dateStart:'',
				dateEnd:''
			}
		},
	
		methods: {
			resetSearch() {
				this.dateStart = '';
				this.dateEnd = '';
				this.titleText = '按销额';
				this.titleValue = 'salesAmount';
				this.show = false;
				this.$refs.paging.reload();
			},
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
			async refreshOrderList(pageNo){
				const res = await post("statistics/selectListProductAnalysis", {"pageNum":pageNo,"startTime":this.dateStart,"endTime":this.dateEnd,"sort":this.titleValue});
				const rows = res.rows.map(item => ({
					...item,
					productImages: Array.isArray(item.productImages) ? item.productImages.filter(img => img && typeof img.productUrl === 'string' && img.productUrl.trim()) : []
				}));
				await this.$refs.paging.complete(rows);
			},
			queryList(pageNo, pageSize) {
				this.refreshOrderList(pageNo);
			},
			//显示下拉框
			itemClick() {
				this.show = !this.show				
			},
			//按销量或者按销售额度
			subItemClick(index) {
				this.titleText =  this.itemArr[index]['text'];
				this.titleValue = this.itemArr[index]['value'];
				this.show = false;
				this.$refs.paging.reload();
			},			
			//关闭
			maskClose() {
				this.show = false
			},
			//关闭
			touchControl() {
				this.maskClose()
			},
			toggle(val) {//开始时间和结束时间
				this.$refs[val].show();
			},
			// 开始时间
			dateStartHand(value) {
				this.dateStart = value.result;
				this.$refs.paging.reload();
			},
			// 结束时间
			dateEndHand(value){
				this.dateEnd = value.result;
				this.$refs.paging.reload();
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		}
	}
</script>

<style scoped>
	.head {
		border-top: 5px solid #efeef3;
		border-bottom: 1px solid #edf0f4;
		width: 100%;
	}
	.screen-bar {
		position: relative;
		display: flex;
		align-items: center;
		padding: 8px 16rpx;
		background-color: #fff;
		box-sizing: border-box;
	}
	.screen-bar-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 0 0 156rpx;
		height: 34px;
		padding: 0 18rpx;
		box-sizing: border-box;
		border-radius: 8px;
		background-color: #eaf8ff;
		color: #00a7e2;
	}
	.bar-item-text {
		font-size: 28rpx;
		font-weight: 500;
		white-space: nowrap;
	}
	.filter-chevron {
		width: 6px;
		height: 6px;
		flex-shrink: 0;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-2px) rotate(45deg);
		transition: transform .2s;
	}
	.filter-chevron.is-open {
		transform: translateY(2px) rotate(225deg);
	}
	.datestartAndEnd {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		margin-left: 12rpx;
	}
	.dateStart, .dateEnd {
		flex: 1;
		min-width: 0;
		border-left: 1px solid #edf0f4;
	}
	.date-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 34px;
		padding: 0 4rpx;
		white-space: nowrap;
		color: #747d89;
	}
	.date-placeholder {
		font-size: 30rpx;
	}
	.date-value {
		font-size: 30rpx;
		color: #333;
	}
	.date-chevron {
		width: 5px;
		height: 5px;
		margin-left: 6rpx;
	}
	.reset-button {
		flex-shrink: 0;
		margin: 0 0 0 10rpx;
		padding: 0 12rpx;
		font-size: 24rpx;
		line-height: 24px;
		color: #00a7e2;
		background-color: #fff;
		border: 1px solid #00a7e2;
		border-radius: 5px;
	}
	.reset-button::after {
		border: none;
	}
	.dropdown-box {
		position: absolute;
		left: 16rpx;
		top: calc(100% - 4px);
		width: 220rpx;
		padding: 4px 0;
		box-sizing: border-box;
		background-color: #fff;
		border: 1px solid #e2e8ef;
		border-radius: 10px;
		box-shadow: 0 5px 16px rgba(30, 60, 80, .12);
		z-index: 99;
		overflow: hidden;
	}
	.dropdown-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 40px;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #333;
	}
	.dropdown-item.is-selected {
		background-color: #eaf8ff;
		color: #00a7e2;
	}
	.selected-check {
		width: 6px;
		height: 11px;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: translateY(-2px) rotate(45deg);
	}
	.bg-mask {		
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: transparent;
		z-index: 98;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.bg-mask-show {
		visibility: visible;
		opacity: 0.8;
	}
	
	.product{ 		
		position: relative;
		display: flex;
		align-items: center;
		background-color: #fff; 
		border-bottom: 1px solid #cbcbcbff;
		padding: 8px 5px 8px 10px;
	}
	.product .product-content {
	   flex: 1;
	   min-width: 0;
	}
	.product .product-content .item {
	 	display: flex;
	 	line-height: 14px;
	 	padding-bottom: 3px;
	}
	.product .product-content .info {
	  width: 50%;
	  color: #030303ff;
	  font-size: 14px;
	  color: #333;
	  white-space: nowrap;  
	  overflow: hidden; /* 超出部分隐藏 */
	  text-overflow: ellipsis; /* 显示省略号 */
	  text-rendering: optimizeLegibility;
	}
	

.product-actions{
	position: absolute;
	right: 2px;
	top: 50%;
	transform: translateY(-50%);
	width: 64px;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 7px 4px;
	box-sizing: border-box;
}
.product-action{
	width: 48px;
	min-height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	color: #00a7e2ff;
}
.product-action-label{
	margin-top: 2px;
	font-size: 11px;
	line-height: 14px;
	color: #00a7e2ff;
}
.gallery-icon{
	position: relative;
	width: 24px;
	height: 21px;
	border: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
}
.gallery-mountain{
	position: absolute;
	bottom: 3px;
	width: 8px;
	height: 8px;
	border-left: 1.5px solid #00a7e2ff;
	border-top: 1.5px solid #00a7e2ff;
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
	background-color: #00a7e2ff;
	color: #fff;
	font-size: 9px;
	line-height: 14px;
	text-align: center;
}

</style>

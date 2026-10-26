<template>
	<z-paging ref="paging" v-model="warehousingEntryList" @query="queryList" :safe-area-inset-bottom="true" bottom-bg-color="#38c1b9">
		<template #top>
			<view class="head">
				<view class="status-search">
					<view class="completion-status" @touchstart="onStatusTouchStart" @touchmove="onStatusTouchMove"
						@touchend="onStatusTouchEnd" @touchcancel="onStatusTouchCancel">
						<view  v-for="(item,index) in completionStatusList" :key="item"
							class="normal-class" :class="{'active-class': completionStatus == item}" 
							@click="changeCompletionStatus(item)">{{item}}
						</view>
					</view>
					<view class="search">
						 <view class="same_search">
							<input class="search_input"  v-model="searchVal" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'" type="text" placeholder="搜索货品"/>
						</view>
						<navigator  class="more_search" url="/pages/warehousing/warehousing_query">
							<i class="iconfont">&#xe69b;</i>
						</navigator>
					</view>
				</view>
			</view>
		</template>

		<view @touchstart="onStatusTouchStart" @touchmove="onStatusTouchMove"
			@touchend="onStatusTouchEnd" @touchcancel="onStatusTouchCancel">
		<navigator v-for="(item,index) in warehousingEntryList" :url="'/pages/warehousing/warehousing_details?id='+item.id"  :id="item.id">
			<view class="container">
				<view class="item">
					<text  class="info" style="width: 45%;">操&nbsp;作&nbsp;人&nbsp;:{{item.handledBy}}</text>	
					<text  class="info" style="width: 55%;">入库单号:{{item.warehousingNumber}}</text>
				</view>
				<view class="item">
					<text  class="info" style="width: 45%;">记录日期:{{item.recordDate}}</text>
					<text  class="info" style="width: 55%;">供&nbsp;应&nbsp;商&nbsp;:{{item.supplier}}</text>
				</view>

				<view class="item">
					<text  class="info" style="width: 100%;">货&nbsp;品:&nbsp;{{item.productNames}}</text>
				</view>
			</view>
		</navigator>
		</view>
		
		<template #bottom>
			<view class="warehousing_footer">
				<navigator url="/pages/warehousing/warehousing_add">
					新增入库
				</navigator>
			</view>
		</template>
		
	</z-paging>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	import useMoreSearchStore from '@/store/modules/moreSearch.js'
	export default {
		data() {
			return {
				searchVal:'',
				completionStatus: '新单据',
				completionStatusList:['新单据','未完成','已完成'],
				statusTouchStart: null,
				statusSwipeUntil: 0,
				warehousingEntryList:[],
				searchWarehousing:{}			
				
			}
		},
		setup() {
			const moreSearchStore = useMoreSearchStore();
			return {
				moreSearchStore
			}
		 },
		onShow() {
			// 首次加载由 z-paging 自动查询，返回列表时重新加载当前筛选结果。
			if (this.$refs.paging) {
				this.$refs.paging.reload();
			}
		},
		methods: {
			refreshWarehousingList(){
				post("warehousing/selectListWarehousingEntry",this.searchWarehousing).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {
				let warehousing = this.moreSearchStore.moreSearch;
				this.searchWarehousing =  warehousing;
				this.searchWarehousing.pageNum = pageNo;
				this.searchWarehousing.productNames = this.searchVal;
				this.searchWarehousing.completionStatus = this.completionStatus;
				this.refreshWarehousingList();
			},
			getWarehousingEntryList(){//高级查询				
				this.$refs.paging.reload();
			},
			changeCompletionStatus(completionStatus){
				if (Date.now() < this.statusSwipeUntil || completionStatus === this.completionStatus) return;
				this.completionStatus = completionStatus;
				this.$refs.paging.reload()
			},
			onStatusTouchStart(event) {
				this.statusTouchStart = event.touches.length === 1
					? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
			},
			onStatusTouchMove(event) {
				if (!this.statusTouchStart) return;
				if (event.touches.length !== 1) {
					this.onStatusTouchCancel();
					return;
				}
				const dx = Math.abs(event.touches[0].clientX - this.statusTouchStart.x);
				const dy = Math.abs(event.touches[0].clientY - this.statusTouchStart.y);
				// 已开始纵向滚动时，本次手势不再切换状态。
				if (dy > 10 && dy > dx) this.onStatusTouchCancel();
			},
			onStatusTouchEnd(event) {
				const start = this.statusTouchStart;
				this.onStatusTouchCancel();
				if (!start || !event.changedTouches.length) return;
				const dx = event.changedTouches[0].clientX - start.x;
				const dy = event.changedTouches[0].clientY - start.y;
				if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
				const index = this.completionStatusList.indexOf(this.completionStatus);
				const nextIndex = index + (dx < 0 ? 1 : -1);
				if (nextIndex >= 0 && nextIndex < this.completionStatusList.length) {
					this.statusSwipeUntil = 0;
					this.changeCompletionStatus(this.completionStatusList[nextIndex]);
				}
				// 避免状态按钮在滑动结束后触发合成点击。
				this.statusSwipeUntil = Date.now() + 300;
			},
			onStatusTouchCancel() {
				this.statusTouchStart = null;
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(val){
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style scoped>

.head{
	height: 85px;
}
.head .status-search{
	border-top: 5px solid #efeef3ff;
	height: 36px; 	
	width: 100%;
}
.head .completion-status{
	display: flex;
	justify-content: space-around;
	padding-top: 3px;
	padding-bottom: 3px;
}
.head .completion-status view{
	width: 80px;
	height: 30px;
	text-align: center;
	line-height: 30px;	
	border-radius: 5px;
	font-size: 15px;
}

.head .search{	
	display: flex;
	width: 100%;
	height: 43px;
	z-index: 999;
	background-color: #ffffff;
}
.head .same_search{
	flex: 1;
}
 .search_input{	
	height: 41px;	
	background-repeat: no-repeat;
	background-position: 98%;	
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;
	padding-left: 10px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 5px; 
}
.more_search{
	height: 39px;
	width: 39px;
	margin-top: 2px; 
	border-radius: 3px;
	text-align: center;
	line-height: 39px;
	background-color: #00b6aaff;
	margin-left: 5px; 
	margin-right: 7px;
}
.more_search .iconfont{
	color: #ffffff;	
	font-size: 18px;
}

.normal-class{
	background: #F1F1F1;
	color: rgb(0, 0, 0);
}
.active-class{
	background: rgb(219, 246, 237);
	color: rgb(46, 178, 138);
}


.container{	
	padding: 3px 5px 3px 5px;
	border-bottom: 2px solid #efeef3ff;
}
.item{
	display: flex;	
	padding-bottom: 3px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 15px;
   white-space: nowrap; 
   overflow: hidden; /* 超出部分隐藏 */
   text-overflow: ellipsis; /* 以省略号形式显示 */
   -webkit-font-smoothing: antialiased;
}
.warehousing_footer{
	height: 80rpx;
	font-size: 17px;
	font-weight: 500;
	text-align: center;
	background-color: #38c1b9;
	color: #ffffff;	
}
.warehousing_footer navigator{
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

@media screen and (max-height: 700px) {
	.warehousing_footer{
		height: 72rpx;
	}
}
</style>

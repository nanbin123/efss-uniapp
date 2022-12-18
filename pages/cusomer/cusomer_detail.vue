<template>
<view class="wrap">
	<view class="item">
		<image class="img" src="../../static/image/cusomer/cusomer_name.png" mode=""></image>
		<text class="title">客户姓名:</text>	
		<input class="content" confirm-type="保存" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名" value="李楠">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/cusomer_gender.png" mode=""></image>
		<text class="title">客户性别:</text>		
		<view class="content">
			<view  @tap="toggle('selector')" class="gender" :style="{color:gender=='请选择'?'#a0a0a0':'#333'}">{{gender}}</view>
			<cPicker @confirm="hand" name="ll" mode="selector"  ref="selector" :selectList="selectList"></cPicker>
		</view>	
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/customer_phone.png" mode=""></image>
		<text class="title">客户电话:</text>
		<input class="content" confirm-type="保存" type="number" placeholder-class="input-placeholder" placeholder="请输入客户电话" value="15832922153">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/cusomer_address.png" mode=""></image>
		<text class="title">客户地址:</text>
		<input class="content" confirm-type="保存" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名" value="北京市海淀区紫竹苑小区1号楼501室">
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/degree.png"></image>
		<view class="title">意向程度:</view>
		<view class="content starLen">
			<image class="star" @tap='changeStar(1)' :src="score>0?fullStarUrl:nullStarUrl"></image>
			<image class="star" @tap='changeStar(2)' :src="score>1?fullStarUrl:nullStarUrl"></image>
			<image class="star" @tap='changeStar(3)' :src="score>2?fullStarUrl:nullStarUrl"></image>
		</view>
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/quoted_price.png" mode=""></image>
		<text class="title">报价:</text>
		<text class="content">27000元</text>			
	</view>
	<view class="item">
		<image class="img" src="../../static/image/cusomer/discount.png" mode=""></image>
		<text class="title">折扣:</text>
		<text class="content">5%</text>			
	</view>
	<view class="item remarks" @click="remarksAddOrEdit()">
		<image class="img" src="../../static/image/cusomer/arrive.png" mode=""></image>
		<text class="title">备注:</text>		
		<text class="content"  style="width: 0; overflow: hidden;text-overflow: ellipsis;">夫妻俩喜欢简单款，不要太复杂 。刚开始看家具，房子预计明年过年会入住，水电改完可以去上门量尺</text>
	</view>
	<view class="arrive">
		<view class="arrive_title" @click="arriveAdd()">
			<image class="img" src="../../static/image/cusomer/arrive.png" mode=""></image>
			<text class="arrive_title_left">到店记录:</text>
			<text class="arrive_title_right">继续添加</text>	
		</view>
		<view class="arrive_content_line1" >
			<text>2021-05-25</text>
			<text>10分钟</text>
		</view>
		<view class="arrive_content_line2">
			夫妻两人，都戴眼镜，女士拿红色LV贝壳包，男士已加微信，微信名字备注19.1.20焦哥
		</view>
		<view class="arrive_content_line1">
			<text>2021-05-26</text>
			<text>20分钟</text>
		</view>
		<view class="arrive_content_line2">
			夫妻俩人一起过来 ，平时没时间 ，只有休息的时候有时间
		</view>
	</view>
	<view class="arrive" style="border-bottom: 8px solid #efeef3ff;">
		<view class="arrive_title" @click="trackAdd()">
			<image class="img" src="../../static/image/cusomer/arrive.png" mode=""></image>
			<text class="arrive_title_left">跟踪记录:</text>
			<text class="arrive_title_right">继续添加</text>	
		</view>
		<view class="arrive_content_line1" >
			<text>2021-05-25</text>
			<text>10分钟</text>
		</view>
		<view class="arrive_content_line2">
			一个人，很忙，补货，家里现有货颜色稍稍有差别
		</view>
		<view class="arrive_content_line1">
			<text>2021-05-26</text>
			<text>20分钟</text>
		</view>
		<view class="arrive_content_line2">
			下周末带家人过来，已确定库房有一件可用库存
		</view>
	</view>

	<!-- 1、touchstart事件：当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发。
	2、touchmove事件：当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
	3、touchend事件：当手指从屏幕上离开的时候触发。
	4、touchcancel事件：当系统停止跟踪触摸的时候触发 -->
	<view v-for="(item, index) in csListArrl"	:key="index" :data-index="index" class="product-item" 
		@touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd"  :style="'right:'+item.right+'px'">
			<view class="product">
				<view class="product_img">
					<image src="../../static/image/茶几.png" mode=""></image>
				</view>
				<view class="product_content">
					<view class="grid">
						<view class="info">品名：长茶几</view>
						<view class="info">型号：7707-C</view>
					</view>
					<view class="grid">
						<view class="info">类别：茶几</view>
						<view class="info">颜色：胡桃色</view>
						<view class="info">材质：楸木</view>
					</view>
					 <view class="grid">
						<view class="info">尺寸：1400*800*500</view>
						<view class="info">产地：东莞</view>
					</view>
					<view class="grid">
						<view class="info" style="color: #e96225ff;">零售价：<text style="color: #e96225ff;">￥1300</text></view>
					</view>
				</view>	
				<view class="product_number">
					<view class="reduce" @click="reduce">-</view>
					<view>
						<input type="number" v-model="total" @input="countVal">			
					</view>
					<view class="add" @click="add">+</view>
				</view>
			</view>
			<view class="remove" @click="delData(item)">删除</view>					
	</view>

	<view class="add_img_total">
		<view class="add_img">
			<image src="../../static/image/red_add.png" mode=""></image>
			<view>点击添加产品</view>
		</view>
		<view class="total">
			合计:27120
		</view>
	</view>
<!-- 		<view class="foot">
			<view class="track">跟踪</view>
			<view class="order">下单</view>
		</view> -->
</view>
<!--到店时间弹窗-->
<view>
	<view :hidden="arrivalHidden" class="popup_content">
		<view class="popup_title">添加到店时间</view>
		<view class="popup_item">
		   <text class="popup_item_title">到店时间</text>
		   <view class="popup_item_text">
			 <input type="text"  placeholder-class="input-placeholder" placeholder="请选择"/>
		   </view>              
		</view> 
		<view class="popup_item">
		   <text class="popup_item_title">停留时间</text>
		   <view class="popup_item_text">
			 <input type="number" />				 
		   </view>
		   <text class="minute">分钟</text>
		</view>
		<view class="arrival_record">
			<textarea maxlength="200" placeholder="请输入到店记录" placeholder-class="textarea-placeholder"></textarea>
		</view>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelArrival()">取消</view>
			<view class="determine" @click="submitArrival()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="arrivalHidden" @click="hideDiv()"></view>
</view>

<!--跟踪记录弹窗-->
<view>
	<view :hidden="trackHidden" class="popup_content">
		<view class="popup_title">添加跟踪时间</view>
		<view class="popup_item">
		   <text class="popup_item_title">跟踪时间</text>
		   <view class="popup_item_text">
			 <input type="text"  placeholder-class="input-placeholder" placeholder="请选择"/>
		   </view>              
		</view> 
		<view class="popup_item">
		   <text class="popup_item_title">跟踪时长</text>
		   <view class="popup_item_text">
			 <input type="number" />				 
		   </view>
		   <text class="minute">分钟</text>
		</view>
		<view class="arrival_record">
			<textarea maxlength="200" placeholder="请输入跟踪记录" placeholder-class="textarea-placeholder"></textarea>
		</view>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelTrack()">取消</view>
			<view class="determine" @click="submitTrack()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="trackHidden" @click="hideDiv()"></view>
</view>

<!--备注弹窗-->
<view>
	<view :hidden="remarkHidden" class="remark_content">
		<textarea class="remark_text" maxlength="200" placeholder="请输入备注" placeholder-class="textarea-placeholder"></textarea>
		<view class="arrival_foot">
			<view class="cancel" @click="cancelRemark()">取消</view>
			<view class="determine" @click="submitRemark()">确定</view>
		</view>
	</view>
	<view class="popup_overlay" :hidden="remarkHidden" @click="hideRemark()"></view>
</view>
</template>

<script>
	import cPicker from "../../components/c-picker/c-picker.vue"
	import {
		picker
	} from "../../components/mixins/picker.js"
	
	export default {
		components: {
			cPicker
		},
		data() {
			return {
				 total:1,
				 selectList: [{
				 		ll: "男",
				 		value: 1
				 	},
				 	{
				 		ll: "女",
				 		value: 2
				 	}
				 ],
				//列表数据，可根据自己的业务获取
				csListArrl:[{
					name:'小A',
					age:'18',
					right: 0
				}],
				gender:'男',
				fullStarUrl:'../../static/image/cusomer/star.png',
				nullStarUrl:'../../static/image/cusomer/empty.png',
				score:1,
				//左滑默认宽度
				delBtnWidth: 80,
				//到店记录弹窗
				arrivalHidden:true,
				//跟踪记录
				trackHidden:true,
				//备注
				remarkHidden:true
				
			}
		},
		methods: {
			//客户性别选择
			toggle(val) {
				this.$refs[val].show();
			},
			hand(value) {
				this.gender = value.result							
			},
			//意向程度
			changeStar(val){
				this.score=val;
			},
			//开始触摸滑动
			drawStart(e) {
				var touch = e.touches[0];
				this.startX = touch.clientX;
			},
			//触摸滑动
			drawMove(e) {
				for (var index in this.csListArrl) {
					this.$set(this.csListArrl[index],'right',0);
				}
				var touch = e.touches[0];
				var item = this.csListArrl[e.currentTarget.dataset.index];
				var disX = this.startX - touch.clientX;
				if (disX >= 20) {
					if (disX > this.delBtnWidth) {
						disX = this.delBtnWidth;
					}
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',disX);
				} else {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',0);
				}
			},
			//触摸滑动结束
			drawEnd(e) {				
				var item = this.csListArrl[e.currentTarget.dataset.index];
				if (item.right >= this.delBtnWidth / 2) {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',this.delBtnWidth);
				} else {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',0);
				}
			},
			//删除方法
			delData(item){
				console.log("删除")
				uni.showModal({
					title: '提示',
					content: "确认移除意向产品？",
					success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
					}
				});
			},
			reduce(){
			if(this.total<=1){
				uni.showToast({
					title:'数值不能小于1',
					icon:"none"
				})
					return;
				}
				this.total = this.total-1;
			},
			add(){
				this.total = this.total+1;
			},
			countVal(e){
				if(this.total == 0){
					this.total =1				
				}			
			},
			//到店记录跟踪记录弹窗遮罩	
			hideDiv(){
				this.arrivalHidden = true;
			},
			//提交到店记录
			submitArrival(){
				this.arrivalHidden = true;
			},
			//添加到店记录
			arriveAdd(){
				this.arrivalHidden = false;
			},
			cancelArrival(){
				this.arrivalHidden = true;
			},	
			//添加跟踪记录
			trackAdd(){
				this.trackHidden = false;
			},
			cancelTrack(){
				this.trackHidden = true;
			},
			submitTrack(){
				this.trackHidden = true;
			},
			//备注
			remarksAddOrEdit(){
				this.remarkHidden = false;
			},
			cancelRemark(){
				this.remarkHidden = true;
			},
			submitRemark(){
				this.remarkHidden = true;
			},
			hideRemark(){
				this.remarkHidden = true;
			}
		},
	}
</script>

<style>
.wrap{
	width: 100%;	
	border-top: 8px solid #efeef3ff;
}
.item{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx;
	border-bottom: 1px solid #efeef3ff;
}
.img{
	width: 38rpx;
	height: 38rpx;	
}

.title{	
	white-space: nowrap;
	padding: 0 30rpx;
	font-size: 35rpx;
	color: #333;
}
.content{
	font-size: 35rpx;
	color: #333;	
	flex-grow: 1;
	text-align: right;	
	white-space:nowrap;
}

.starLen{
	display: flex;
	justify-content: space-around;
}
.input-placeholder{
	font-size: 35rpx;
	text-align: right;
	color: #aaa;
}
.arrive{
	border-bottom: 1px solid #efeef3ff;
}
.star{
	width: 50rpx;
	height: 50rpx;
}
.arrive_title{
	display: flex;
	align-items: center;
	padding: 20rpx 20rpx;
	color: #acacacff;

}
.arrive_title_left{
	padding: 0 30rpx;
	font-size: 35rpx;	
}
.arrive_title_right{
	font-size: 30rpx;	
	flex-grow: 1;
	text-align: right;
}
.arrive_content_line1{
	display: flex;
	justify-content: space-between;
	padding: 0 30rpx;
	font-size: 35rpx;
	color: #333;
}
.arrive_content_line2{
	padding: 20rpx 30rpx;
	font-size: 30rpx;
	color: #acacacff;
}

.remarks{
	min-width: 0;
	border-bottom: 8px solid #efeef3ff;
}
.product-item {
    width: 100%;    
    position: relative;
    margin: 0 auto;
}
.remove {
    margin-left:-5%;
    width: 80px;
    height: 100%;
    background-color: #dd544eff;
    color: #FFFFFF;
    position: absolute;
    top: 0;
    right: -80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
.product{
	display: flex;
	align-items: center;	
    width: 100%;   
    margin: 0 auto;
    border-bottom: 1px solid #C0C0C0;
	position: relative;
}
.product_img{
	width: 150rpx;
	height: 150rpx;	
	margin-left:10rpx;
}
.product_img image {
	 width: 150rpx;
	 height: 150rpx;	 
}

.product_content{
	width: 100%;
	padding: 20rpx;
}
.grid {
	width: 100%;
	font-size: 25rpx; 
	display: flex;	
	justify-content: space-between;
	margin-bottom: 3px;
	color: #acacacff;
}
.product_number{
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #cdcdcdff;
	border-radius: 5rpx;
	width: 150rpx;
	height: 38rpx;
	text-align: center;
	position: absolute;
	right: 20rpx;
	bottom: 10rpx;
}
.reduce{
	padding: 0 15rpx;
	height: 36rpx;
	line-height: 30rpx;
	border-right: 1px solid #cdcdcdff;
	color: #010101ff;
	font-weight: 500;
}
.add{
	padding: 0 15rpx;
	height: 36rpx;
	line-height: 33rpx;
	border-left: 1px solid #cdcdcdff;
	color: #010101ff;
}
.product_number input{
	font-size: 26rpx;	
}
.add_img_total{
	display: flex;
	justify-content: space-between;
}
.add_img {
    border: 1px solid #CCCCCC;    
    width: 150rpx;
	height: 150rpx;
    margin-top: 10rpx;
    margin-left: 10rpx;
}
.add_img image {
    width: 80rpx;
    height: 80rpx;
	margin-left: 35rpx;
	margin-top: 15rpx;
	
}
.add_img view {   
    color: #e96225ff;
    font-size: 20rpx;
    text-align: center;
}
.total{
	padding-right: 30rpx;
	padding-top: 20rpx;
	font-size: 35rpx;
	color: #666666ff;
}
.foot {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
    height: 100rpx;
	color: #00A7E2;	
    border-top: 1px solid #CCCCCC;
	border-bottom: 1px solid #CCCCCC;
    font-size: 20rpx;
	display: flex;	
	text-align: center;	
}
.track{
	font-size: 35rpx;	
	width: 50%;
	height: 100rpx;
	line-height: 100rpx;
	border-right: 1px solid #CCCCCC;
}
.order{
	font-size: 35rpx;
	width: 50%;	
	height: 100rpx;
	line-height: 100rpx;
}


/**
 * 遮罩层 到店时间弹窗
 */
.popup_overlay {
	 position: fixed;
	 top: 0%;
	 left: 0%;
	 width: 100%;
	 height: 100%;
	 background-color: #b3b3b3ff;
	 z-index: 1001;
	 -moz-opacity: 0.8;
	 opacity: .80;
	 filter: alpha(opacity=88);
 }
 .popup_content {
	 position: fixed;
	 top: 50%;
	 left: 50%;
	 width: 500rpx;
	 height: 550rpx;
	 margin-left: -250rpx;
	 margin-top: -275rpx;
	 border-radius: 20rpx;
	 background-color: white;
	 z-index: 1002;
	 overflow: auto;
 }
 /* 备注弹窗 */
 .remark_content{
 	 position: fixed;
 	 top: 50%;
 	 left: 50%;
 	 width: 500rpx;
 	 height: 350rpx;
 	 margin-left: -250rpx;
 	 margin-top: -275rpx;
 	 border-radius: 20rpx;
 	 background-color: white;
 	 z-index: 1002;
 	 overflow: auto;
 }
 .popup_title {	 
	 font-size: 35rpx;
	 font-weight: 500;
	 text-align: center;
	 margin: 20rpx 0;	
 }

 .popup_item {
	 display: flex;	 	
	 align-items: center;
	 margin: 30rpx 30rpx;
 }
 .popup_item_title{	 
 	padding-right: 10rpx;
	white-space: nowrap;
	font-size: 30rpx;
	color: #070707ff;
 }
.popup_item_text{	
	border-bottom: 1px solid #f1f1f1ff;
	flex-grow: 0.8;
	text-align: right;	
}
.popup_item_text input{
	font-size: 30rpx;
	color: #070707ff;
	margin-right: 10rpx;
}
.input-placeholder{
	font-size: 28rpx;
	text-align: right;
	color: #f1f1f1ff;	
	margin-right: 10rpx;
}
.minute{
	font-size: 30rpx;
	color: #070707ff;
	white-space: nowrap;
}
.arrival_record{
	margin: 0 30rpx;
	padding:20rpx;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}
.remark_text{
	width: 390rpx;
	height: 190rpx;	
	margin: 0 auto;
	margin-top: 32rpx;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
	padding:20rpx;
	
}
.arrival_record textarea{
	 height: 150rpx;
	 width: 400rpx;
}
.textarea-placeholder{
	font-size: 28rpx;
	text-align: left;
	color: #aaa;	
}

.arrival_foot {
	width: 500rpx;
	position: absolute;
	bottom: 0;
	left: 0;
    height: 60rpx;
	line-height: 60rpx;
	color: #070707ff;
	font-size: 30rpx;
	display: flex;
    border-top: 1px solid #f1f1f1ff;
}
.cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
}
.determine{	
	text-align: center;
	width: 50%;
}
</style>
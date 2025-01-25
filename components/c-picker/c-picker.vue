<template>
	<view class="c-picker">
		<view class="mask" :class="{'show':showPicker}" @tap="maskTap" @touchmove.stop.prevent catchtouchmove="true">
		</view>
		<view class="c-picker-cnt" :class="{'show':showPicker}">
			<view class="c-picker-hd" @touchmove.stop.prevent catchtouchmove="true">
				<view class="c-picker-btn" @tap="pickerCancel">取消</view>
				<view class="c-picker-btn" style="color:#f5a200" @tap="pickerConfirm">确定</view>
			</view>
			
			<view class="c-picker-view" v-if="mode=='date'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange">
					<picker-view-column>
						<view class="c-picker-item" v-for="(item,index) in data.years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="c-picker-item" v-for="(item,index) in data.months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="c-picker-item" v-for="(item,index) in data.days" :key="index">{{item}}日</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	const forMatNum=(num)=>{
		return num<10?'0'+num:num+'';
	}
	export default {
		data() {
			return {
				result: [],
				data: {},				
				pickVal: [],
				showPicker: false,
				resultStr: "",
				itemHeight: `height: 44px;`				
			};
		},
		props: {
			mode: {
				type: String,
				default () {
					return "date"
				}
			},
			pageData: {
				type: String,
				default: "",
			}
		},
		methods: {
			useCurrent() {
				let aToday = new Date();
				let tYear = aToday.getFullYear().toString();
				let tMonth = this.formatNum(aToday.getMonth() + 1).toString();
				let tDay = this.formatNum(aToday.getDate()).toString();
				return [tYear, tMonth, tDay];
			},
			formatNum(num) {
				return num < 10 ? '0' + num : num + '';
			},
			maskTap() {
				this.showPicker = false;
			},
			show() {
				this.showPicker = true;
			},
			hide() {
				this.showPicker = false;
			},
			pickerCancel() {				
				this.$emit("cancel", {
					defaultVal: this.pickVal
				});
				this.showPicker = false;
			},
			pickerConfirm(e) {
				this.$emit("confirm", {
					result: this.resultStr
				});
				this.showPicker = false;
			},
			bindChange(val) {				
				let _this = this;
				let arr = val.detail.value;
				let year =  _this.data.years[arr[0]];
				let month = _this.data.months[arr[1]];
				let months = _this.initMonths(year);
				_this.data.months = months;			
				let days = _this.initDays(year,month);
				_this.data.days = days; 
				let day = _this.data.days[arr[2]];
				_this.resultStr = `${year+'-'+month+'-'+day}`;
				
			},
		    initData(useCurrent) {
				let _this = this;				
				//全部内容和当前日期
				let data = _this.init(useCurrent);				
				let dVal =  data.defaultVal;
				_this.data = data;
				//默认选择的当前值
				let year = data.years[dVal[0]];
				let month = data.months[dVal[1]];
				let day = data.days[dVal[2]];
				_this.resultStr = `${year+'-'+month+'-'+day}`;				
				_this.pickVal = dVal; 
			},
			init(value){
				let aToday=new Date();
				let tYear,tMonth,tDay,defaultVal=[];
				let curMonth=value[1];
				let curYear=value[0];
				let totalDays=new Date(curYear,curMonth,0).getDate();
				let years=[];
				let months=[];
				let days=[];
 				let endYear=new Date().getFullYear();
 				let startYear=new Date("1990").getFullYear();
				for(let s=endYear;s>=startYear;s--){
					years.push(s+'');
				};
				for(let m=1;m<=12;m++){
					months.push(forMatNum(m));
				};			
				for(let d=1;d<=totalDays;d++){
					days.push(forMatNum(d));
				}			
				let returnArr=[
					years.indexOf(value[0]),
					months.indexOf(value[1]),
					days.indexOf(value[2])
				]
				defaultVal=[returnArr[0],returnArr[1],returnArr[2]];				 
				return {years,months,days,defaultVal}
			},
			initDays:(year,month)=>{
				let aDate=new Date();
				let totalDays=new Date(year,month,0).getDate();
				let dates=[];
				for(let d=1;d<=totalDays;d++){
					dates.push(forMatNum(d));
				};
				return dates;
			},
			initMonths:(year)=>{
				let aDate=new Date();
				let months=[];
				for(let m=1;m<=12;m++){
					months.push(forMatNum(m));
				};
				return months;
			},
		},
		created() {
			this.initData(this.useCurrent());			
		},
		watch:{
			pageData(val){
				let aToday = new Date(val);				
				let tYear = aToday.getFullYear().toString();				
				let tMonth = this.formatNum(aToday.getMonth() + 1).toString();
				let tDay = this.formatNum(aToday.getDate()).toString();
				let useCurrent = [tYear, tMonth, tDay];
				let returnArr=[
					this.data.years.indexOf(useCurrent[0]),
					this.data.months.indexOf(useCurrent[1]),
					this.data.days.indexOf(useCurrent[2])
				]
				let defaultVal=[returnArr[0],returnArr[1],returnArr[2]];
				let year = this.data.years[defaultVal[0]];
				let month = this.data.months[defaultVal[1]];
				let day = this.data.days[defaultVal[2]];
				this.resultStr = `${year+'-'+month+'-'+day}`;				
				this.pickVal = defaultVal; 
			}
		}

	}
</script>

<style lang="scss">
	.c-picker {
		position: relative;
		z-index: 888;

		.mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			visibility: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}

		.mask.show {
			visibility: visible;
			opacity: 1;
		}

		.c-picker-cnt {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 3000;
		}

		.c-picker-cnt.show {
			transform: translateY(0);
		}

		.c-picker-hd {
			display: flex;
			align-items: center;
			padding: 0 15px;
			height: 44px;
			background-color: #fff;
			position: relative;
			text-align: center;
			font-size: 16px;
			justify-content: space-between;

			.c-picker-btn {
				font-size: 15px;
			}
		}

		.c-picker-hd:after {
			content: ' ';
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #e5e5e5;
			color: #e5e5e5;
			transform-origin: 0 100%;
			transform: scaleY(0.5);
		}

		.c-picker-item {
			text-align: center;
			width: 100%;
			height: 44px;
			line-height: 44px;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 15px;
		}

		.c-picker-view {
			width: 100%;
			height: 238px;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 1);
			z-index: 666;
		}

		picker-view {
			height: 100%;
		}
	}
</style>

<template>
	<view class="wrap">
		<view>
			<view  class="content" v-for="(item,index) in productCategoryList" :key="index" :id="item.id" @click="chooseCategory(item.id,item.category)">
				<view class="type">{{item.category}}</view>
				<view class="img-btn" v-show="showEditAndDelete">					
					<image class="img-edit" @click="imgEdit(item.category,item.id)"  src="../../static/image/product/edit.png"></image>
					<image class="img-delete" @click="imgDelete(item.id)" src="../../static/image/product/delete.png"></image>
				</view>
			</view>
			<uni-load-more class="load" :content-text="contentText" :status="status" :icon-size="24" :iconType="iconType" v-if="productCategoryList.length > 0"/>
		</view>
		<view class="bottom-button">
			<view @click="add()" class="add">添加</view>
			<view  @click="edit()" class="edit">{{editText}}</view>
		</view>
	</view>
	
<!--编辑新增弹窗-->
<view>
	<view v-show="addCategoryHidden" class="popup_content">
		<uni-forms  ref="forma" :modelValue="formData" :rules="rules">
			<view class="popup_title">{{addOrEditCateGory}}</view>
			<view class="add-category">
				<uni-forms-item name="id" v-show="false">
					<input v-model="formData.id"/>
				</uni-forms-item>
				<uni-forms-item name="category">
					<textarea maxlength="100" v-model="formData.category" placeholder="请输入类别名称" placeholder-class="textarea-placeholder"></textarea>
				</uni-forms-item>
			</view>
		</uni-forms>
		<view class="add-category-foot">
			<view class="cancel" @click="cancelArrival()">取消</view>
			<button  class="determine" @click="submit()">确定</button>
		</view>
	</view>
	<view class="popup_overlay" v-show="addCategoryHidden" @click="hideDiv()"></view>
</view>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				showEditAndDelete:true,
				editText:"编辑",
				addCategoryHidden:false,
				productCategoryList:[],				
				pageNum: 1, // 当前页
				status: 'more',	
				contentText: {
					contentdown: '上拉加载更多~',				
					contentrefresh: '正在加载更多~',				
					contentnomore: '我是有底线的~'
				},
				addOrEditCateGory:"",
				formData:{
					id:"",
					category:"",
				},
				rules: {
					category: {
						rules: [{// 对name字段进行必填验证
								required: true,
								errorMessage: '请输入类别名称',
							}
						]
					}
				}
			}
		},
		methods: {
			edit(){
				this.showEditAndDelete=!this.showEditAndDelete
				if(this.showEditAndDelete){
					this.editText="编辑"
				}else{
					this.editText="取消"
				}
			},
			add(){
				this.addOrEditCateGory = "添加产品类别";
				this.addCategoryHidden = true;
			},
			imgEdit(category,id){
				this.formData.category = category;
				this.formData.id = id;
				this.addOrEditCateGory = "修改产品类别";
				this.addCategoryHidden = true;
			},
			getList(){
				post("product/selectCategory",{"pageNum":this.pageNum}).then(res =>{
					if(this.totalCount >0){
						this.productCategoryList = res.rows
					 }
					 uni.hideLoading();
				})
			},
			imgDelete(id){
				let that = this;
				uni.showModal({
					title:'',
					content:'是否删除该项',
					success:function(res) {
						if(res.confirm){
							post("product/delProductCategory",{"id":id}).then(res =>{
								if(200 == res.code){
									uni.hideLoading();
									uni.redirectTo({//跳转当前页面执行刷新
										url: '/pages/product/category'
									});
								}
							})
						}
					}
				})
			},
			cancelArrival(){
				uni.redirectTo({//跳转当前页面执行刷新
					url: '/pages/product/category'
				});
			},	
			hideDiv(){
				uni.redirectTo({//跳转当前页面执行刷新
					url: '/pages/product/category'
				});
			},
			submit(){
				this.$refs['forma'].validate().then(res=>{
					if("" == res.id){
						post("product/insertProductCategory",{"category":res.category}).then(res =>{
							if(200 == res.code){
								this.formData.category = "";
								uni.hideLoading();
								uni.showToast({
									title: '添加产品类别成功',
									icon: 'none',
									duration: 2000
								})
								this.addCategoryHidden = false;								
								this.getList()
							}
						})
					}else {
						post("product/updateProductCategory",{"id":res.id,"category":res.category}).then(res =>{
							if(200 == res.code){
								this.formData.category = "";
								uni.hideLoading();
								uni.showToast({
									title: '修改产品类别成功',
									icon: 'none',
									duration: 2000
								})
								this.addCategoryHidden = false;
								this.getList()
							}
						})
					}
				}).catch(err =>{
					console.log('表单错误信息：', err);
				})

			},
			chooseCategory(id,category){
				// 1. 获取当前页面栈实例（此时最后一个元素为当前页）
				let pages= getCurrentPages();
				// 2. 上一页面实例
				// 注意是length长度，所以要想得到上一页面的实例需要 -2
				// 若要返回上上页面的实例就 -3，以此类推
				let prevPage = pages[pages.length-2]
				prevPage.$vm.product.category  = category;
				prevPage.$vm.product.productCategoryId = id;
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onLoad(){
			post("product/selectCategory",{"pageNum":this.pageNum}).then(res =>{
				this.totalCount = res.total				
				 if(this.totalCount >0){
					this.productCategoryList = res.rows
					uni.hideLoading();
				 }
				 if(this.totalCount == this.productCategoryList.length){					 
					 this.status = "noMore"
				 }
			})
		},
		onReachBottom() {
			if(this.totalCount > this.productCategoryList.length){
				this.pageNum++;				
				post("product/selectCategory",{"pageNum":this.pageNum}).then(res =>{					
					 this.productCategoryList = this.productCategoryList.concat(res.rows)
					 uni.hideLoading();
				})
			}else if(this.totalCount == this.productCategoryList.length){								 
				 this.status = "noMore"				
			}
		},
	}
</script>

<style>

.wrap{
	position: absolute;
	width: 100%;	
	background:  #efeef4ff;
}
.content{
	position: relative;
}
.type{
	height: 50px;
	line-height: 50px;
	background: #fff;
	margin: 10px;
	border-radius: 8px;
	padding: 0 15px;
	font-size: 17px;
}
.img-edit{
	position: absolute;
	top: 13px;
	right: 15%;
	height: 25px;
	width: 25px;
}
.img-delete{
	position: absolute;
	top: 13px;
	right: 7%;
	height: 25px;
	width: 25px;
}
.bottom-button{
	position: fixed;
	bottom: 0;
	height: 40px;
	width: 100%;
	line-height: 40px;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	color: #02a5e6ff;
}
.add{
	width: 50%;
	margin-left: 10px;
}
.edit{
	width: 50%;
	margin-right: 10px;
	text-align: right;
}
/* 弹窗 */
 .popup_content {
	 position: fixed;
	 top: 50%;
	 left: 50%;
	 width: 300px;
	 height: 260px;
	 margin-left: -150px;
	 margin-top: -130px;
	 border-radius: 10px;
	 background-color: white;
	 z-index: 1002;
	 overflow: auto;
 }
 .popup_title {
 	 font-size: 25px;
 	 font-weight: 500;
 	 text-align: center;
 	 margin: 20px 0;	
 }
.add-category{
	margin: 0 10px;
	padding:10px;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}

.add-category textarea{
	 height: 90px;
	 width: 170px;
}
.textarea-placeholder{
	font-size: 20px;
	text-align: left;
	color: #aaa;	
}

.add-category-foot {
	width: 300px;
	position: absolute;
	bottom: 0;
	left: 0;
    height: 50px;
	line-height: 50px;
	color: #070707ff;
	font-size: 20px;
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
/**
 * 弹出框遮罩层
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

</style>

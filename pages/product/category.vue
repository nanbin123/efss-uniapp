<template>
	<z-paging ref="paging" v-model="productCategoryList" @query="queryList">
		<template #top>
			<view class="head"></view>
		</template>

		<view  class="content" v-for="(item,index) in productCategoryList" :key="index" :id="item.id" @click="chooseCategory(item.id,item.category)">
			<view class="type">{{item.category}}</view>
			<view class="img-btn" v-show="!showEditAndDelete">
				<image class="img-edit" @click.stop="imgEdit(item.category,item.id)" :src="getImgUrl('../../static/image/product/edit.png')"></image>
				<image class="img-delete" @click.stop="imgDelete(item.id)" :src="getImgUrl('../../static/image/product/delete.png')"></image>
			</view>
		</view>

		<template #bottom>
			<view class="bottom-button">
				<view @click="add()" class="add">添加</view>
				<view  @click="edit()" class="edit">{{editText}}</view>
			</view>
		</template>
		
	</z-paging>
	
<!--编辑新增弹窗-->
	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
		<view  class="popup_content">			
			<view class="popup_title">{{addOrEditCateGory}}</view>
			<view class="add-category">
				<textarea maxlength="100" v-model="formData.category" 
					:focus='categoryFocus'  @blur='categoryFocus = false' 
					placeholder="请输入类别名称" 
					placeholder-class="textarea-placeholder">
				</textarea>
			</view>
			
			<view class="add-category-foot">
				<view class="cancel" @click="cancelArrival()">取消</view>
				<view  class="determine" @click="submit()">确定</view>
			</view>
		</view>
	</uni-popup>
	

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	export default {
		data() {
			return {
				showEditAndDelete:true,
				editText:"编辑",				
				productCategoryList:[],				
				addOrEditCateGory:"",
				formData:{
					id:"",
					category:"",
				},
				categoryFocus:true
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
				this.$refs.popup.open('center');
			},
			imgEdit(category,id){
				this.formData.category = category;
				this.formData.id = id;
				this.addOrEditCateGory = "修改产品类别";
				this.$refs.popup.open('center');
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
									//移除元素
									let index = that.productCategoryList.findIndex((obj)=> obj.id == id)
									 that.productCategoryList.splice(index,1)
								}
							})
						}
					}
				})
			},
			cancelArrival(){// 弹窗取消
				this.formData.category = "";
				this.formData.id = "";
				this.$refs.popup.close();
			},
			submit(){
				if(!this.formData.category){
					this.categoryFocus = true
					uni.showToast({
						title: '产品类别不能为空',
						icon: 'none'
					});
					return
				}
				let category = this.formData.category;				
				if("添加产品类别" == this.addOrEditCateGory){
					post("product/insertProductCategory",{"category":category}).then(res =>{
						if(200 == res.code){
							this.formData.category = "";
							this.formData.id = "";
							this.$refs.popup.close();
							this.$refs.paging.reload();
							uni.showToast({
								title: '添加产品类别成功',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}else if ("修改产品类别" == this.addOrEditCateGory){
					let id = this.formData.id;
					post("product/updateProductCategory",{"id":id,"category":category}).then(res =>{						
						if(200 == res.code){
							this.formData.category = "";		
							uni.showToast({
								title: '修改产品类别成功',
								icon: 'none',
								duration: 2000
							})
							this.formData.category = "";
							this.formData.id = "";
							this.$refs.popup.close();
							this.$refs.paging.reload();
						}
					})
				}
			},
			chooseCategory(id,category){
				let pages= getCurrentPages();
				let prevPage = pages[pages.length-2]
				prevPage.$vm.product.productCategoryName  = category;
				prevPage.$vm.product.productCategoryId = id;
				uni.navigateBack({
					delta: 1
				});
			},
			queryList(pageNo, pageSize) {
				post("product/selectCategory",{"pageNum":pageNo}).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(){
		}
	}
</script>

<style scoped>
.head{
	height: 5px;
	width: 100%;
	background-color:  #efeef3ff;
}
.content{
	position: relative;
	border-bottom: 1px solid #efeef3ff;
}
.type{
	height: 25px;
	line-height: 25px;
	background: #fff;
	margin: 10px;
	border-radius: 8px;
	padding: 0 15px;
	font-size: 17px;
}
.img-edit{
	position: absolute;
	top: 3px;
	right: 15%;
	height: 20px;
	width: 20px;
}
.img-delete{
	position: absolute;
	top: 3px;
	right: 7%;
	height: 20px;
	width: 20px;
}


.bottom-button{
	height: 39px;
	width: 100%;
	line-height: 39px;
	background-color: #fff;
	 border-top: 1px solid #cbcbcbff;
	display: flex;
	justify-content: space-between;
	color: #02a5e6ff;
}
.add{
	width: 50%;
	margin-left: 15px;
}
.edit{
	width: 50%;
	margin-right: 15px;
	text-align: right;
}
/* 弹窗 */
 .popup_content {
	position: relative;
	width: 260px;
	height: 150px;
	background-color: white;	
	overflow: auto;
 }
 .popup_title {
 	 font-size: 15px;
 	 text-align: center;
 	 margin: 5px; 
 }
 
.add-category{
	margin: 0 10px;
	padding:5px;
	border:1px solid #f1f1f1ff;
	border-radius: 5px;
}
.add-category textarea{
	 height: 60px;
	 width: 230px;
}
.textarea-placeholder{
	font-size: 15px;
	text-align: left;
	color: #aaa;
}

.add-category-foot {
	width: 260px;
	position: absolute;
	bottom: 0;
	left: 0;
	height: 35px;
	line-height: 35px;
	color: #070707ff;
	font-size: 15px;
	display: flex;
	border-top: 1px solid #f1f1f1ff;
}
.add-category-foot .cancel{
	text-align: center;
	border-right: 1px solid #f1f1f1ff;
	width: 50%;
	background-color:#fff;
}
.add-category-foot .determine{	
	text-align: center;
	width: 50%;
	background-color:#fff;
}

.add-category-foot uni-button:after {
  content: none; /* 移除内容 */
}


</style>

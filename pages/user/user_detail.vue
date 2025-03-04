<template>
	<view style="height: 5px;">
		<view class="head"></view>
	</view>
	<scroll-view scroll-y :show-scrollbar="false" :enhanced="true" style="height: calc(100vh - 46px);">	
		<view class="main">
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">账号 :</text>
				<input  v-model="user.userName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入登录账号">
			</view>
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/nick_name.png')"></image>
				<text class="title">姓名 :</text>
				<input v-model="user.nickName" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
			<view class="item">
				<image class="img" style="width: 20px;height: 19px;"  :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
				<text  class="title">手机号 :</text>
				<input v-model="user.phonenumber" :disabled="isEditable" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入手机号">
			</view>
			<view class="permission_list">
				<image class="img" style="width: 25px;height: 20px;" :src="getImgUrl('static/image/user/permission.png')"></image>				
				<view  class="title_permission">权限列表 :</view>
			</view>
			
			<view class="item_permission">				
				<view class="tree_data">
					<view class="tree_left">
						<DaTree
							ref="menuRefLeft"
						    :data="roomTreeDataLift"
						    labelField="label"
						    valueField="id"
						    defaultExpandAll
						    showCheckbox
							:checkedDisabled="checkedDisabled"							
						    :defaultCheckedKeys="defaultCheckedKeysValue"
						    @change="handleTreeChange"
						    @expand="handleExpandChange"></DaTree>		
					</view>
					<view class="tree_right">
						<DaTree
							ref="menuRefRight"
						    :data="roomTreeDataRight"
						    labelField="label"
						    valueField="id"
						    defaultExpandAll							
						    showCheckbox
							:checkedDisabled="checkedDisabled"
						    :defaultCheckedKeys="defaultCheckedKeysValue"
						    @change="handleTreeChange"
						    @expand="handleExpandChange"></DaTree>		
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
	
	<view class="bottom-bar">
		  <text class="delete" @click="deleteUserForm()">{{ isEditable ? '删除' : '取消'  }}</text>		   
		  <text class="edit"  @click="editUserForm()">{{ isEditable ? '编辑' : '保存' }}</text>
	</view>
		

</template>

<script>
	import {get,post} from "../../components/utils/request.js"
	import DaTree from "../../components/da-tree/index.vue"  
	export default {
		data() {
			return {				
				user:{},
				roomTreeDataLift:[],
				roomTreeDataRight:[],
				defaultCheckedKeysValue:[],
				isEditable: true,
				checkedDisabled:true
			}
		},	
		components: {
		  DaTree
		},
		methods: {
			editUserForm(){				
				if(this.isEditable == true){
					this.isEditable = false
					this.roomTreeDataLift.forEach(child => {
					    child.disabled = false; // 左边菜单可用
					});
					this.roomTreeDataRight.forEach(child => {
					    child.disabled = false; // 右边菜单可用
					});
				}else if(this.isEditable == false){
					this.editUser();
					this.isEditable = true
					this.roomTreeDataLift.forEach(child => {
					        child.disabled = true; // 左边菜单不可用
					});
					this.roomTreeDataRight.forEach(child => {
					        child.disabled = true; // 右边菜不单可用
					});
				}
				
			},
			deleteUserForm(){
				if(this.isEditable == true){					 
					uni.showModal({
					  title: '提示',
					  content: '是否删除该员工信息',
					  success: (res)=> {						 
					    if (res.confirm) {	
							this.removeUserByIds()
					    } else if (res.cancel) {					     
					      console.log('用户点击取消');
					    }
					  }
					});
				}else if(this.isEditable == false){
					this.isEditable = true
					this.roomTreeDataLift.forEach(child => {
					        child.disabled = true; // 左边菜单不可用
					});
					this.roomTreeDataRight.forEach(child => {
					        child.disabled = true; // 右边菜不单可用
					});
				}
			},
			removeUserByIds(){			
				post("system/user/removeUserByIds",{"userIds":[this.user.userId]}).then(res =>{
					if(200 == res.code){
						uni.navigateBack({
						delta:1,
						success:(event) =>{
							prevPage.getList();									
						}
					}) 
					}
				})	
			},
 			editUser(){	
				//左侧菜单
			    let leftCheckedKeys = this.$refs.menuRefLeft.getCheckedKeys();
				//右侧菜单
				let rightCheckedKeys = this.$refs.menuRefRight.getCheckedKeys();
				//let rightHalfCheckedKeys = this.$refs.menuRefRight.getHalfCheckedKeys();

				//合并
		 		if(leftCheckedKeys && !rightCheckedKeys){
					this.user.menuIds = leftCheckedKeys;
				}else if(rightCheckedKeys && !leftCheckedKeys){
					this.user.menuIds = rightCheckedKeys;
				}
				if(leftCheckedKeys && rightCheckedKeys){
					Array.prototype.push.apply(leftCheckedKeys, rightCheckedKeys);
					this.user.menuIds = leftCheckedKeys;
				}

			    post("system/user/editUser",JSON.stringify(this.user),'application/json').then(res =>{
					let pages = getCurrentPages();
					if(pages.length >1){
						let prevPage = pages[pages.length -2];
						if(200 == res.code){
							uni.hideLoading(); 
							uni.showToast({
							  title: '编辑用户成功',
							  icon: 'none', 
							  duration: 2000 
							});
						}
					}
				})
			}, 
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
			this.user.userId = option.userId						
			get("system/user/getUserByUserId",{"userId":this.user.userId}).then(res =>{
				if(200 == res.code){
					this.user = res.data;
				}
			})
			get("system/menu/userMenuTreeselect",{"userId":this.user.userId}).then(res =>{
				if(200 == res.code){					
					//菜单赋值
					let resPromise=res.menus[0];
					let datePromise = res.menus[0].children					
					datePromise.forEach(child => {
					    child.disabled = true; // 默认不可用
					});
					let treeDataLength = Math.round(datePromise.length/2);//四舍五入取整
					this.roomTreeDataLift = datePromise.slice(0,treeDataLength)
					this.roomTreeDataRight = datePromise.slice(treeDataLength,datePromise.length)
					this.defaultCheckedKeysValue = res.checkedKeys;
					uni.hideLoading(); 
				}
			})
		
			

					
					
			     
			
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
	align-items: center;
	padding: 8px 0;
	border-bottom: 1px solid #efeef3ff;
}
	
.item .img{
	width: 22px;
	height: 21px;		
}
.item .title{
	margin-left: 3px;
	font-size: 15px;
	color: #333;
	white-space: nowrap;
	text-rendering: optimizeLegibility;
}

.item input{
	font-size: 15px;
	margin-left: auto;
	padding-right: 15px;
	text-align: right;
}

.item .input-placeholder{
	font-size: 15px;
	text-align: right;
	color: #aaa;
}
.textarea-placeholder{
	font-size: 15px;
}

.permission_list{
	display: flex;
	justify-content: center;
	margin-top: 10px;
}
.title_permission{
	padding-left: 10px;
	font-size: 15px;
	color: #333;
}
.item_permission{	
	display: flex;
	justify-content: center;
}
.tree_data{	
	display: flex;
	justify-content: space-between;
	
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
   z-index: 999; /* 确保位于最顶层 */
}

.delete {
  width:50%;
  height: 100%;
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

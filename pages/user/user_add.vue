<template>
	<view class="wrap">
		<view class="head"></view>
		<view class="main">
			<view class="item">
				<image class="img"  :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">账号 :</text>
				<input  v-model="user.userName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入登录账号">
			</view>
			<view class="item">
				<image class="img"  :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">密码 :</text>
				<input v-model="user.password" confirm-type="next" type="password" placeholder-class="input-placeholder" placeholder="请输入登录密码">
			</view>
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/nick_name.png')"></image>
				<text class="title">姓名 :</text>
				<input v-model="user.nickName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
			<view class="item">
				<image class="img" style="width: 20px;height: 19px;" :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
				<text  class="title">手机号 :</text>
				<input v-model="user.phonenumber" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入手机号">
			</view>	
			<view class="item_permission">
				<image class="img" style="width: 25px;height: 20px;" :src="getImgUrl('static/image/user/permission.png')"></image>
				<view  class="title_permission">权限列表 :</view>
				<view class="tree_data">
					<view class="tree_left">
						<DaTree
							ref="menuRefLeft"
						    :data="roomTreeDataLift"
						    labelField="label"
						    valueField="id"
						    defaultExpandAll
						    showCheckbox						   
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
						    @change="handleTreeChange"
						    @expand="handleExpandChange"></DaTree>		
					</view>
				</view>
			</view>
			
		</view>
		<view class="btn" @click="addUserForm()">
			<button>保存</button>
		</view>
	</view>
</template>

<script>
	import { ref } from 'vue';
	 import {get,post} from "../../components/utils/request.js"
	 import DaTree from "../../components/da-tree/index.vue"  
	 const menuRef = ref(null);
	export default {
		data() {
			return {				
				user:{},				
				roomTreeDataLift:[],
				roomTreeDataRight:[]
			}
		},
		components: {
		  DaTree
		},
		methods: {
			addUserForm(){
				debugger
				//左侧菜单
			    let leftCheckedKeys = this.$refs.menuRefLeft.getCheckedKeys();
			    let lefthalfCheckedKeys = this.$refs.menuRefLeft.getHalfCheckedKeys();
				if(leftCheckedKeys !=null && lefthalfCheckedKeys != null){
					 Array.prototype.unshift.apply(leftCheckedKeys, lefthalfCheckedKeys);
				}			   
				//右侧菜单
				let rightCheckedKeys = this.$refs.menuRefRight.getCheckedKeys();
				let rightHalfCheckedKeys = this.$refs.menuRefRight.getHalfCheckedKeys();
				if(rightCheckedKeys !=null && rightHalfCheckedKeys != null){
					Array.prototype.unshift.apply(rightCheckedKeys, rightHalfCheckedKeys);
				}				
				//合并
				Array.prototype.push.apply(leftCheckedKeys, rightCheckedKeys);				
			    this.user.menuIds = leftCheckedKeys;
			    post("system/user",JSON.stringify(this.user),'application/json').then(res =>{
					let pages = getCurrentPages();
					if(pages.length >1){
						let prevPage = pages[pages.length -2];
						if(200 == res.code){
							uni.navigateBack({
								delta:1,
								success:(event) =>{
									prevPage.getList();									
								}
							})
						}
					}
				})
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		onLoad(option) {
			get("system/menu/userTreeselect").then(res =>{		
				
				if(200 == res.code){
					let data = res.data[0];
					this.roomTreeData = data.children;
					let treeDataLength = data.children.length/2+1;
					this.roomTreeDataLift = data.children.slice(0,treeDataLength);
					this.roomTreeDataRight = data.children.slice(treeDataLength,data.children.length);
					uni.hideLoading(); 
				}
			})
		}
	}

	
</script>

<style>

.wrap{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
.head{
	height: 5px;
	background-color:  #efeef3ff;	
}
.item{	
	display: flex;
	align-items: center;
	padding: 10px;
	border-bottom: 1px solid #efeef3ff;
}
.item .img{
	width: 22px;
	height: 21px;		
}
.item .title{
	white-space: nowrap;
	padding: 0 15px;
	font-size: 15px;
	color: #333;
}

.item input{
	font-size: 16px;
	margin-left: auto;
	padding-right: 15px;
	text-align: right;
}

.item .input-placeholder{
	font-size: 16px;
	text-align: right;
	color: #aaa;
}
.textarea-placeholder{
	font-size: 15px;
}

.item_permission{	
	display: flex;	
	padding: 10px;
	border-bottom: 1px solid #efeef3ff;
}
.title_permission{
	white-space: nowrap;
	padding-right: 15px;
	padding-left: 10px;
	font-size: 15px;
	color: #333;
}
.tree_data{	
	display: flex;
	justify-content: space-between;
	
}
.tree_left{
	padding-right: 20px;
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

<template>
	<view class="wrap">
		<view class="head"></view>
		<view class="main">
			<view class="item">
				<image class="img"  :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">账&nbsp号</text>
				<text class="iconfont">&#xe639;</text>
				<input :focus='userNameFocus' @blur='userNameFocus = false'  v-model="user.userName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入登录账号">
			</view>
			<view class="item">
				<image class="img"  :src="getImgUrl('static/image/user/user_name.png')"></image>
				<text class="title">密&nbsp码</text>
				<text class="iconfont">&#xe639;</text>
				<input :focus='userPasswordFocus' @blur='userPasswordFocus = false' v-model="user.password" confirm-type="next" type="password" placeholder-class="input-placeholder" placeholder="请输入登录密码">
			</view>
			<view class="item">
				<image class="img" :src="getImgUrl('static/image/user/nick_name.png')"></image>
				<text class="title">姓&nbsp名：</text>
				<input v-model="user.nickName" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入姓名">
			</view>
			<view class="item">
				<image class="img" style="width: 20px;height: 19px;" :src="getImgUrl('static/image/order/cusomer_phone.png')"></image>
				<text  class="title">手机号</text>
				<text class="iconfont">&#xe639;</text>
				<input :focus='userPhonenumberFocus' @blur='userPhonenumberFocus = false' v-model="user.phonenumber" confirm-type="next" type="text" placeholder-class="input-placeholder" placeholder="请输入手机号">
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
		<view class="footer"  @click="addUserForm()">
			<view>保存</view>
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
				roomTreeDataRight:[],
				userNameFocus:false,
				userPasswordFocus:false,
				userPhonenumberFocus:false
			}
		},
		components: {
		  DaTree
		},
		methods: {
			addUserForm(){
				if(!this.user.userName){
					this.userNameFocus = true						
					uni.showToast({
						title: '账号不能为空',
						icon: 'none'
					});
					return
				}
				if(!this.user.password){
					this.userPasswordFocus = true						
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					});
					return
				}
				if(!this.user.phonenumber){
					this.userPhonenumberFocus = true						
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					});
					return
				}
				//左侧菜单
			    let leftCheckedKeys = this.$refs.menuRefLeft.getCheckedKeys();
				//右侧菜单
				let rightCheckedKeys = this.$refs.menuRefRight.getCheckedKeys();					
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
			    post("system/user/insertUser",JSON.stringify(this.user),'application/json').then(res =>{
					if(200 == res.code){
						uni.showToast({
							title: '添加员工成功',
							icon: 'none',
							duration: 2000
						})
						this.user = {};
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
					let treeDataLength = Math.round(data.children.length/2);//四舍五入取整					
					this.roomTreeDataLift = data.children.slice(0,treeDataLength);
					this.roomTreeDataRight = data.children.slice(treeDataLength,data.children.length);
					uni.hideLoading(); 
				}
			})
		}
	}

	
</script>

<style scoped>

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
	padding: 8px 0;
	border-bottom: 1px solid #efeef3ff;
}
	
.item .img{
	width: 22px;
	height: 21px;		
}
.item .title{
	margin-left: 3px;
	margin-right: 1px;
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
.item .iconfont{
	color: red;	
	font-size: 12px;
	margin-left: -5px;
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
.item_permission{	
	display: flex;
	justify-content: center;
}
.title_permission{
	padding-left: 10px;
	font-size: 15px;
	color: #333;
}
.tree_data{	
	display: flex;
	justify-content: space-between;
	
}
.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;	
	width: 100%;
}

</style>

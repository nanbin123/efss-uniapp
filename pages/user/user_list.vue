<template>
	<z-paging ref="paging" v-model="userList" @query="queryList">
		<template #top>
			<view class="head">	
				<view class="search">
					 <view class="same_search">
						<input class="search_input" :style="'background-image:url('+getImgUrl('static/image/search.png')+')'" v-model="searchVal"  type="text" placeholder="搜索姓名或手机号"/>
					</view>
					<!-- <navigator  class="more_search" url="/pages/user/user_query">
						<i class="iconfont">&#xe69b;</i>
					</navigator> -->
				</view>
			</view>
		</template>
	
		
		<navigator v-for="(item,index) in userList" :url="'/pages/user/user_detail?userId='+item.userId" :id="item.userId">
			<view class="container">
				<view class="item">
					<text  class="info">账号:{{item.userName}}</text>
					<text  class="info">用姓名:{{item.nickName}}</text>
				</view>
				<view class="item ">					
					<text  class="info">手机号码:{{item.phonenumber}}</text>
					<text  class="info">创建时间:{{item.createTime}}</text>
				</view>
			</view>			
		</navigator>		

		<template #bottom>
			<view class="footer">
				<navigator url="/pages/user/user_add">
					新增员工
				</navigator>
			</view>
		</template>
		
	</z-paging>
</template>

<script>
	import {get,post} from "../../components/utils/request.js"

	export default {
		data() {
			return {
				userList:[],
				searchVal:'',
				searchUser:{}
			}
		},
		methods: {
			refreshUserList(){
				get("system/user/selectPhoneUserList",this.searchUser).then(res =>{
					this.$refs.paging.complete(res.rows);
				})
			},
			queryList(pageNo, pageSize) {	
				this.searchUser.pageNum = pageNo;
				this.refreshUserList();
			},
			getImgUrl(image){
			   return this.BASEURL+image;
			}
		},
		watch:{
			searchVal(newVal, oldVal) {
				if (newVal != null){
					this.searchUser = {"nickNameOrPhonenumber":newVal};
					this.$refs.paging.reload();
				}
			}
		}
	}


</script>

<style scoped>
.head{
	height: 60px;
}
.head .search{
	width: 100%;
	border-top: 5px solid #efeef3ff;	
	height: 45px;
	padding: 5px 0;	
	background-color: #ffffff;	
	display: flex;
}
.head .search  .same_search{	
	flex: 1;
}
.head .search .same_search .search_input{	
	height: 41px;
	background-repeat: no-repeat;
	background-position: 98%;
	border: 1px solid #f2f2f2;
	border-radius: 10px;
	text-align: left;	
	color:'#606266';	
	padding-left: 10px;
	padding-right: 60px;
	font-size: 15px;
	margin-left: 5px;
	margin-right: 5px;
}
.head .search .more_search{
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
.iconfont{
	color: #ffffff;	
	font-size: 18px;
}


.container{	
	border-bottom: 1px solid #efeef3ff;
	padding: 10px 10px 0 10px;
}
.item{
	display: flex;
	line-height: 14px;
	padding-bottom: 10px;
}
.info {
   width: 50%;
   color: #030303ff;
   font-size: 12px;
   white-space: nowrap;
   -webkit-font-smoothing: antialiased;
}
.footer{
	height: 30px;
	font-size: 15px;
	text-align: center;
	line-height: 30px;
	background-color: #00a7e2ff;	
	color: #daf2fbff;	
	bottom: 0;
	width: 100%;
}

</style>
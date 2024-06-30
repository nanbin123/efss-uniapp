<script>
	import useUserStore from '@/store/modules/user.js'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			/* watchRouter(){
				 let token = uni.getStorageSync("token");
				 if(token || token ===0){
					 useUserStore().getInfo()
				 }
			} */
		},
		onLaunch: function() {
			//后边这里做一个优化调用调用接口判断用户信息是否做了修改
			// let that = this;
			// let list = ["navigateTo", "redirectTo",'navigateBack', "reLaunch", "switchTab"];			
			// list.forEach(item => { //用遍历的方式分别为4个路由方法添加拦截器
			// 	uni.addInterceptor(item, {
			// 		invoke(args) {
			// 			that.watchRouter();
			// 		}
			// 	})
			// })
		},
		onShow: function() {
			//this.watchRouter();	
		},
		onHide: function() {
			
		}
	}
</script>

<style>
@import "static/icon/iconfont.css";

page{
	width: 100%;
	height: 100%;
}
 .uni-navigator {
    height: 44px !important; /* 设置默认导航栏的高度为44px */
	color: red;
  }
/* .scroll-view::-webkit-scrollbar {
  overflow: hidden; /* 隐藏滚动条 */
 /* width: 0;
  height: 0;
  color: transparent; 
} */

</style>

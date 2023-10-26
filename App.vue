<script>
	import useUserStore from '@/store/modules/user.js'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			watchRouter(){				
				 useUserStore().getInfo()
			}
		},
		onLaunch: function() {
			let that = this;
			let list = ["navigateTo", "redirectTo",'navigateBack', "reLaunch", "switchTab"];			
			list.forEach(item => { //用遍历的方式分别为4个路由方法添加拦截器
				uni.addInterceptor(item, {
					invoke(args) {
						that.watchRouter();					
					}
				})
			})
		},
		onShow: function() {
			this.watchRouter();	
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>

page{
	width: 100%;
	height: 100%;
}



</style>

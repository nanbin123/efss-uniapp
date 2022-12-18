<template>
	<view class="content">
		<upload @upload="uploadFile"></upload>
	</view>
</template>

<script>
	import upload from '../../components/pretty-uploadFile/pretty-uploadFile.vue'
	export default {
	        components: {
	            upload
	        },
	        data() {
	            return {
	                title: 'Hello'
	            }
	        },
	        onLoad() {
	
	        },
	        methods: {
	            uploadFile(e) {
	                console.log(e)
	            }
	        }
	    }
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

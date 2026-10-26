//const BASEURL = "https://www.efss.net.cn/";
const BASEURL = "https://127.0.0.1/";

function get(url, data = {}, contentType = 'application/x-www-form-urlencoded;charset=UTF-8') {
	return request(url, data, 'GET', contentType);
}

function put(url, data = {}) {
	return request(url, data, 'put');
}

function deletes(url, data = {}) {
	return request(url, data, 'delete');
}
/**
 * POST请求封装
 */
function post(url, data = {}, contentType = 'application/x-www-form-urlencoded;charset=UTF-8') {
	return request(url, data, 'POST', contentType);
}
/**
 * 图片上传
 */
function uploadFiles(url, files, formData = {}) {
	return uploadImg(url, files, formData);
}

function uploadImg(url, files, formData) {
	return new Promise(function(resolve) {
		const failUpload = (message) => {
			uni.hideLoading();
			uni.showToast({ title: message, icon: 'none', duration: 4000 });
			resolve({ code: -1, msg: message });
		};
		if (!files) {
			failUpload('未获取到图片文件，请重新选择');
			return;
		}
		uni.showLoading({ title: '上传中', mask: true });
		uni.uploadFile({
			url: BASEURL + url,
			filePath: files,
			name: 'file',
			header: {
				'Authorization': uni.getStorageSync("token"),
				'Accept': 'application/json'
			},
			formData,
			success(res) {
				let resData;
				try {
					resData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
				} catch (error) {
					failUpload('上传失败，服务器响应异常（' + res.statusCode + '）');
					return;
				}
				if (res.statusCode === 401 || res.statusCode === 403 || (resData && (resData.code == 401 || resData.code == 403))) {
					uni.removeStorageSync('token');
					failUpload('登录失效，请重新登录');
					setTimeout(() => uni.reLaunch({ url: '/pages/login/login' }), 1000);
					return;
				}
				if (res.statusCode < 200 || res.statusCode >= 300) {
					failUpload('上传失败，服务器状态码：' + res.statusCode);
					return;
				}
				if (!resData || resData.code != 200) {
					failUpload((resData && resData.msg) || '图片上传失败，请重试');
					return;
				}
				uni.hideLoading();
				resolve(resData);
			},
			fail(error) {
				failUpload('上传失败：' + (error.errMsg || '请检查网络后重试'));
			}
		});
	});
}

function request(url, data = {}, method = "GET", contentType) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: BASEURL + url,
			method: method,
			data: data,
			header: {
				'Authorization': uni.getStorageSync("token"),
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': contentType
			},
			success(res) {
				if (res.data) {
					if (res.data.code == 401 || res.data.code == 403) {
						uni.removeStorageSync('token');
						alert(JSON.stringify(res.data))
						uni.showToast({
							title: '登录失效，请重新登录',
							icon: 'none'
						});
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 1000);
					}
					if (res.data.code == 500) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
					if (res.data.code == 200) {
						resolve(res.data);
					}
				} else {
					resolve(null);
				}
			},
			fail(res) {
				uni.showToast({
					title: '请求超时，请重试',
					icon: 'none'
				}); // wx.hideLoading()
			}

		});
	});
}

export {
	get,
	post,
	put,
	deletes,
	uploadFiles

};
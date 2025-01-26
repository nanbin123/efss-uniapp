const BASEURL = "http://192.168.149.8:8080/";

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
	return new Promise(function(resolve, reject) {
		uni.showLoading({
			title: "上传中"
		});
		uni.uploadFile({
			url: BASEURL + url,
			files: files,
			header: {
				'Authorization': uni.getStorageSync("token"),
				"Accept": "application/json"
			},
			success(res) {
				if (res.data) {
					let resData = JSON.parse(res.data)
					if (resData.code == 401 || resData.code == 403) {
						uni.removeStorageSync('token');
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
					if (resData.code == 200) {
						resolve(resData);
					}
				} else {
					resolve(null);
					uni.hideLoading();
				}
			}
		})
	});
}

function request(url, data = {}, method = "GET", contentType) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: BASEURL + url,
			method: method,
			data: data,
			header: {
				//'mini-session': uni.getStorageSync('session') || '',
				'Authorization': uni.getStorageSync("token"),
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': contentType
			},
			success(res) {
				if (res.data) {
					if (res.data.code == 401 || res.data.code == 403) {
						uni.removeStorageSync('token');
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
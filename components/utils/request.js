/**
 * GET请求封装
 */
function get(url, data = {}) {	
	return request(url, data, 'GET');
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

function post(url, data = {}) {
	
	return request(url, data, 'POST');
}
/**
 * 微信的request
 */
//ifdef H5
const BASEURL = 'http://localhost:8080/'
//endif

//endif

function request(url, data = {}, method = "GET") {	
	return new Promise(function(resolve, reject) {		
		uni.showLoading({
			title: "加载中"
		});
		uni.request({
			url: BASEURL + url,
			method: method,
			data: data,
			header: {
				//'mini-session': uni.getStorageSync('session') || '',
				'Authorization': uni.getStorageSync("token"),
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
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
					if(res.data.code == 200){						
						resolve(res.data);
					}
				} else {
					resolve(null);
					uni.hideLoading();
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
};

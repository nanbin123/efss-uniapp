//ifdef H5
//const BASEURL = ''
//endif

//ifndef H5
//const BASEURL = getApp().globalData.url
//endif

function uploadImage() {
	return new Promise((resolve, reject) => {		
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(ress) {
				if (ress.tempFiles.length > 0) {
					const tempFilePaths = ress.tempFiles[0].path
					const size = ress.tempFiles[0].size
					if (size < 8388608) {
						uni.showLoading({
							title:'上传中'
						})
						uni.showToast({
							title: '图片上传成功',
							icon: 'success'
						})
						let imageurl = tempFilePaths
						let pdfurl = ""
						let uploadId = "1"
						resolve({
							imageurl, // 图片地址
							uploadId // 后台返回的文件id
						})
/* 						uni.uploadFile({
							url: '' + '/api/v1/enterprise/upload/image', //仅为示例，非真实的接口地址
							filePath: tempFilePaths,
							header: {
								"mini-session": uni.getStorageSync('session'),
								"Content-Type": "multipart/form-data;boundary=----WebKitFormBoundaryi8lPVoSysovJLNqi",
								"Accept": "application/json"
							},
							name: 'file',
							formData: {
								'user': 'test'
							},
							success(res) {
								if (res.statusCode == 500) {
									uni.showToast({
										title: '图片上传失败',
										icon: 'none'
									})
									reject('失败')
								} else {
									uni.showToast({
										title: '图片上传成功',
										icon: 'success'
									})
									if (res.data) {
										let uploadId = JSON.parse(res.data).id
										resolve({
											imageurl, // 图片地址
											uploadId // 后台返回的文件id
										})
									}

								}
							}
						}) */
					 } else {
						uni.showToast({
							title: '超出限制大小',
							icon: "none"
						})
					}
				} else {
					uni.showToast({
						title: '文件不存在',
						icon: "none"
					})
				}
			}
		})
	}) 
}

/* function uploadPdf() {
	return new Promise((resolve, reject) => {
		uni.chooseMessageFile({
			count: 1,
			type: 'all',
			success(ress) {
				if (ress.tempFiles.length > 0) {
					if (ress.tempFiles[0].size < 8388608) {
						uni.showLoading({
							title:'上传中'
						})
						let pdfurl = ress.tempFiles[0].name
						uni.uploadFile({
							url: BASEURL + '/api/v1/enterprise/upload/file', //仅为示例，非真实的接口地址
							filePath: ress.tempFiles[0].path,
							name: 'file',
							header: {
								"mini-session": uni.getStorageSync('session'),
								"Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryi8lPVoSysovJLNqi",
								"Accept": "application/json"
							},
							formData: {
								'user': 'test'
							},
							success(res) {
								if (res.statusCode != 500) {
									uni.showToast({
										title: '文件上传成功',
										icon: 'success'
									})
									if (res.data) {
										let uploadId = JSON.parse(res.data).id
										resolve({
											uploadId // 后台返回的文件Id
										})
									} else {
										reject('失败')
									}

								} else {
									uni.showToast({
										title: '服务器错误',
										icon: 'none'
									})
								}
							}
						})
					} else {
						uni.showToast({
							title: '超出限制大小',
							icon: "none"
						})
						return
					}
				} else {
					uni.showToast({
						title: '文件不存在',
						icon: "none"
					})
				}

			}
		})
	})
} */
export default{
	uploadImage	
}

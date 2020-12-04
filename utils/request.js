let loadingNum = 0
const request = (params) => {
	loadingNum++
	// loading
	wx.showLoading({
		title: '加载中',
		mask: true,
	})
	let base_url
	params.outer
		? (base_url = 'https://api.zhilianiot.com/v4.2.0')
		: (base_url = 'https://o2o.zhilianiot.com:8095')
	let header = {}
	params.type === 'formData'
		? (header = {
				token: wx.getStorageSync('auth-token'),
				os: 'wxShareLogin',
				'content-type': 'application/x-www-form-urlencoded',
		  })
		: (header = {
				os: 'wxShareLogin',
				token: wx.getStorageSync('auth-token'),
		  })
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			url: base_url + params.url,
			header,
			success: (result) => {
				loadingNum--
				!loadingNum && wx.hideLoading()
				if (result.data.code === 200 || result.data.status === '200') {
					// loadingNum--
					// !loadingNum && wx.hideLoading()
					resolve(result)
				} else if (base_url == 'https://api.zhilianiot.com/v4.2.0') {
					if (result.data.status == 429) {
						wx.clearStorage()
						// loadingNum--
						// !loadingNum && wx.hideLoading()
						wx.navigateTo({
							url: '../pages/login/login',
						})
					} else {
						// loadingNum--
						// !loadingNum && wx.hideLoading()
						wx.showToast({
							title: result.data.msg,
							icon: 'none',
							duration: 2000,
						})
					}
				} else {
					// loadingNum--
					// !loadingNum && wx.hideLoading()
					wx.showToast({
						title: result.data.message ? result.data.message : result.data.msg,
						icon: 'none',
						duration: 2000,
					})
				}
			},
			fail: (err) => {
				loadingNum--
				!loadingNum && wx.hideLoading()
				reject(err)
			},
			complete: () => {},
		})
	})
}
request.prototype.reload = () => {
	loadingNum = 0
	wx.hideLoading()
}

export { request }

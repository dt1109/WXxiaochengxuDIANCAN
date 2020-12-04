import { request } from '../../utils/request'

// pages/validate/validate.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		flag: true,
		second: 60,
		validate: '', //验证码
		vFocus: true,
		Length: 6, //输入框个数
		isFocus: true, //聚焦
		authcode: '', //输入的内容
		signNo: null,
		cardInfo: null,
	},
	Focus(e) {
		var that = this
		var inputValue = e.detail.value
		that.setData({
			authcode: inputValue,
		})
	},
	Tap() {
		var that = this
		that.setData({
			isFocus: true,
		})
	},
	formSubmit(e) {
		console.log(e.detail.value.password)
	},
	/**返回上一页 */
	goBack: function () {
		wx.navigateBack({
			delta: 1,
		})
	},
	/**重新获取验证码倒计时 */
	countDown: function () {
		let flag = this.data.flag
		if (flag) {
			this.setData({
				flag: false,
			})
			let second = this.data.second
			const _this = this
			const time = setInterval(function () {
				second = second - 1
				if (second == 0) {
					_this.setData({
						flag: true,
					})
					clearInterval(time)
				}
				_this.setData({
					second: second,
				})
			}, 1000)
		}
	},
	// 获取验证码
	againSendMsg: function () {
		request({
			url: '/account/binding/realname',
			data: {
				param: JSON.stringify(this.data.cardInfo),
			},
			method: 'POST',
			type: 'formData',
			outer: true,
		}).then((res) => {
			this.setData({
				second: 60,
			})
			this.countDown()
		})
	},
	// 点击下一步
	next: function () {
		if (String(this.data.authcode).length === 6) {
			request({
				url: '/account/binding/authcode',
				data: {
					param: JSON.stringify({
						signNo: this.data.signNo,
						authcode: this.data.authcode,
					}),
				},
				method: 'POST',
				type: 'formData',
				outer: true,
			}).then((res) => {
				if (res.data.status == '200') {
					if (wx.getStorageSync('hasPayPassword')) {
						wx.navigateTo({
							url: '../pay/pay',
						})
					} else {
						wx.navigateTo({
							url: '../set-pwd/set-pwd',
						})
					}
				}
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '验证手机号',
		})
		Object.keys(options).forEach((v) => {
			if (options[v] == 'null') {
				delete options[v]
			}
		})
		this.setData({
			cardInfo: options,
		})
		this.countDown()
		this.setData({
			signNo: wx.getStorageSync('signNo'),
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
})

// pages/set-pwd/set-pwd.js
import { hexMD5 } from '../../utils/md5'
import Base64 from '../../utils/base64'
import { request } from '../../utils/request'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		onepwd: '',
		onepwd2: '',
		twopwd: '',
		twopwd2: '',
		type: 1, //默认第一次输入
		tips: '请设置指购网支付密码，用户支付验证',
		setStatus: false, //密码设置成功状态
		inputValue: null,
		payFocus: true, //文本框焦点
	},
	goBack: function () {
		wx.navigateBack({
			delta: 1,
		})
	},
	/**
	 * 设置支付密码
	 */
	changeValue: function (e) {
		let arr = ['•', '••', '•••', '••••', '•••••', '••••••']
		let onepwd = e.detail.value
		let _pwd =
			String(onepwd).length - 1 >= 0 ? arr[String(onepwd).length - 1] : ''
		if (this.data.type == 1) {
			this.setData({
				onepwd: _pwd,
			})
			if (String(onepwd).length == 6) {
				this.setData({
					onepwd2: e.detail.value,
				})
				let _this = this
				setTimeout(() => {
					_this.setData({
						onepwd: '',
						tips: '请再次输入，以确认密码',
						type: 2,
						inputValue: '',
					})
				}, 100)
			}
		} else {
			let arr1 = ['•', '••', '•••', '••••', '•••••', '••••••']
			let twopwd = e.detail.value
			let _twopwd =
				String(twopwd).length - 1 >= 0 ? arr1[String(twopwd).length - 1] : ''
			this.setData({
				twopwd: _twopwd,
			})
			if (String(twopwd).length == 6) {
				this.setData({
					twopwd2: e.detail.value,
				})
				if (this.data.onepwd2 != this.data.twopwd2) {
					this.setData({
						tips: '两次密码不一致请重试',
						onepwd: '',
						twopwd: '',
						inputValue: '',
						type: 1,
					})
					return
				} else {
					console.log(this.data.onepwd2)
					request({
						url: '/account/fingerpay/pwdsetting',
						data: {
							param: JSON.stringify({
								pwd: Base64.encode(hexMD5(this.data.onepwd2)),
							}),
						},
						method: 'POST',
						type: 'formData',
						outer: true,
					}).then((res) => {
						wx.setStorageSync('hasPayPassword', true)
						this.setData({
							setStatus: true,
						})
					})
				}
			}
		}
	},
	/**
	 * 显示支付密码输入层
	 */
	showInputLayer: function () {
		this.setData({ payFocus: true })
	},
	/**
	 * 获取焦点
	 */
	getFocus: function () {
		this.setData({ payFocus: true })
	},
	pwdSetted: function () {
		this.setData({
			setStatus: false,
		})
		wx.navigateTo({
			url: '../pay/pay',
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '设置支付密码',
		})
		this.showInputLayer()
		this.getFocus()
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

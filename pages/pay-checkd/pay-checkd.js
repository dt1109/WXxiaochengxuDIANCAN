import { request } from '../../utils/request'
import { hexMD5 } from '../../utils/md5'
import Base64 from '../../utils/base64'
// pages/validate/validate.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		Length: 6, //输入框个数
		isFocus: true, //聚焦
		authcode: '', //输入的内容
		signNo: null,
		cardInfo: null,
		ispassword: true,
		ids: null,
		signNo: null,
		checkPayTyep: null,
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
	// 点击下一步
	next: function () {
		const { ids, signNo, authcode } = this.data
		let formData = { ids, signNo }
		Object.keys(formData).forEach((v) => {
			formData[v] == 'null' && delete formData[v]
		})
		let payApi
		if (this.data.checkPayTyep == '2') {
			payApi = '/malls/walletPay'
		} else if (this.data.checkPayTyep == '3') {
			payApi = '/account/fingerpay/pay'
		}
		if (authcode.toString().length == 6) {
			request({
				url: payApi,
				data: {
					param: JSON.stringify({
						...formData,
						pwd: Base64.encode(hexMD5(authcode)),
					}),
				},
				method: 'POST',
				type: 'formData',
				outer: true,
			}).then((res) => {
				wx.navigateTo({
					url: '../success/success',
				})
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		if(!wx.getStorageSync('hasPayPassword')){
			wx.navigateTo({
				url: '../set-pwd/set-pwd',
			})
		}
		wx.setNavigationBarTitle({
			title: '支付密码',
		})
		console.log(options)
		this.setData({
			...this.data,
			...options,
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

// pages/add-credit2/add-credit2.js
import { request } from '../../utils/request.js'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		creditTypes: ['身份证', '港澳居民通行证', '台湾同胞通行证'],
		creditTypesIndex: 0,
		cardType: null, // 银行卡类型
		cardBank: null, // 银行
		name: null, // 姓名
		cardnum: null, // 银行卡号
		phone: null, // 手机号
		idnum: null, // 身份证号
		cvv2: null, // 信用卡安全码
		expiredate: '请选择', // 信用卡有效期
		signNo: null, // 签约号
		idtype: null, // 证件类型
	},
	//返回上一页
	goBack: function () {
		wx.navigateBack({
			delta: 1,
		})
	},
	// 选择证件类型
	changeCreditType: function (e) {
		this.setData({
			idtype: e.detail.value,
		})
	},
	// 手机号
	getPhoneNumber: function (e) {
		let val = e.detail.value
		this.setData({
			phone: e.detail.value,
		})
	},
	next: function () {
		const { name, idnum, cardnum, phone, cvv2, expiredate, signNo } = this.data
		if(this.data.cardType == 'CREDIT_CARD'){
			if(!(name && idnum && cardnum && phone && cvv2 && expiredate)){
				wx.showToast({
					title: '请检查未填项',
					icon: 'none'
				})
				return
			}
		}else {
			if(!(name && idnum && cardnum && phone)){
				wx.showToast({
					title: '请检查未填项',
					icon: 'none'
				})
				return
			}
		}
		request({
			url: '/account/binding/realname',
			data: {
				param: JSON.stringify({
					name,
					idnum,
					cardnum,
					phone,
					cvv2,
					expiredate,
					signNo,
				}),
			},
			method: 'POST',
			type: 'formData',
			outer: true,
		}).then((res) => {
			wx.setStorageSync('signNo', res.data.data[0].signNo)
			wx.navigateTo({
				url: `../validate/validate?name=${name}&idnum=${idnum}&phone=${phone}&cvv2=${cvv2}&expiredate=${expiredate}&signNo=${signNo}&cardnum=${cardnum}`,
			})
		})
	},
	// 信用卡有效期
	bindDateChange: function (e) {
		this.setData({
			expiredate: e.detail.value,
		})
	},
	// 安全码
	cvv2Change(e) {
		this.setData({
			cvv2: e.detail.value,
		})
	},
	// 姓名
	nameChange(e) {
		this.setData({
			name: e.detail.value,
		})
	},
	// 证件号
	idnumChange(e) {
		this.setData({
			idnum: e.detail.value,
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		this.setData({
			cardBank: options.bankname,
			cardType: options.cardtype,
		}),
			this.setData({
				cardnum: wx.getStorageSync('cardNum'),
			})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.setNavigationBarTitle({
			title: '添加银行卡',
		})
	},

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

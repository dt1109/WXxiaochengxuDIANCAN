// pages/add-credit/add-credit.js
import { request } from '../../utils/request'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cardNum: null,
	},
	goBack: function () {
		wx.navigateBack({
			delta: 1,
		})
	},
	inputValue: function (e) {
		let val = e.detail.value
		this.setData({
			cardNum: val
		})
		wx.setStorageSync('cardNum', val)
	},
	next: function () {
		if(this.data.cardNum) {
			request({
				url: '/account/binding/cardinfo',
				data: {
					cardnum: wx.getStorageSync('cardNum'),
				},
				outer: true,
			}).then((res) => {
				console.log(res.data.data[0])
				wx.navigateTo({
					url: `../add-credit2/add-credit2?bankname=${res.data.data[0].bankname}&cardtype=${res.data.data[0].cardtype}`,
				})
			})
		}else {
			wx.showToast({
				title: '请输入银行卡卡号',
				icon: 'none',
				duration: 2000
			})
		}
		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '添加银行卡',
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

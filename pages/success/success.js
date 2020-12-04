// pages/success/success.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		totalPrice: null,
	},
	goBack: function () {
		wx.navigateBack({
			delta: 1,
		})
  },
  clearStorageSync() { // 清除非身份缓存
    wx.removeStorageSync('orderShow')
    wx.removeStorageSync('orderId')
    wx.removeStorageSync('offlineOrderid')
    wx.removeStorageSync('orderIdReturn')
    wx.removeStorageSync('totalPrice')
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '支付成功',
		})
    setTimeout(()=>{
      wx.reLaunch({
        url: '/pages/home/home'
      })
    }, 1000)
		this.setData({
			totalPrice: wx.getStorageSync('totalPrice'),
		},() => {
      this.clearStorageSync()
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

// pages/words/words.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: '',
    remarkLength: 0 // remark 长度
  },
  handleSubmit() { // 完成
    wx.navigateBack({
      delta: 1,
    })
  },
  handleSetRemark (e) {
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    })
    wx.setStorageSync('remark', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      remark: wx.getStorageSync('remark'),
      remarkLength: wx.getStorageSync('remark').length
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '添加备注'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
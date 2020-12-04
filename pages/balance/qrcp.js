// pages/qrcp/qrcp.js
import { request } from '../../utils/request.js'
import { asyncLogin } from '../../utils/promiseLogin.js'
import { FilterText } from '../../utils/tool.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moneyInt: 0, // 价格整数部分
    moneyFloat: 0, // 价格小数部分
    unPayOrder: false, // 未支付订单
    isLogin: false, // 是否登录
    remark: '',
    iv: null,
    session_key: null,
    money: 0,
    foodTableName: '', // 餐桌号
    selectGoods: []
  },
  clearHomeStorage() { // 清楚首页缓存
    wx.removeStorageSync('selectGoods')
    wx.removeStorageSync('money')
    wx.removeStorageSync('unPaidOrder')
    wx.removeStorageSync('remark')
  },
  handleUnorderPay () { // 含有未支付订单 去下单
    this.clearHomeStorage()
    wx.navigateTo({
      url: '../pay/pay?ids=' + this.data.unPayOrder._id + '&orderid=' + this.data.unPayOrder.offlineOrderId,
    })
  },
  filterText(v, text) { // 过滤函数 v: 0 获取整数部分 v: 1 获取小数部分
    console.log(v)
    if (v === 0) {
      return String(text).split('.')[0]
    } else {
      if (String(text).split('.').length > 1) {
        return '.' + String(text).split('.')[1]
      } else {
        return '.00'
      }
    }
  },
  handleAddFood () { // 继续加菜
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },
  getShopDetail() {
    // 获取商铺信息
    request({
      url: '/o2o/miniProgram/store/getInfo',
      data: {
        storeId: wx.getStorageSync('storeId'),
        tableId: wx.getStorageSync('tableId'),
      },
    }).then((res) => {
      let unPaidOrder = !!res.data.data.unPaidOrder.order ? res.data.data.unPaidOrder.order : false
      this.setData({
        unPayOrder: unPaidOrder ? unPaidOrder : false, // 未支付订单内的商品
        remark: wx.getStorageSync('remark'), // 备注
        foodList: wx.getStorageSync('selectGoods'), // 选择的商品
        foodTableName: res.data.data.foodTable.name, // 桌台号
        money: res.data.data.unPaidOrder.order.payablePrice, // 价格
        moneyInt: FilterText(0, res.data.data.unPaidOrder.order.payablePrice),
        moneyFloat: FilterText(1, res.data.data.unPaidOrder.order.payablePrice)
      },() => {
        console.log(this.data)
      })
    })
  },
  // 获取用户手机号
  getUserPhone(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv

      const { session_key } = this.data

      request({
        url: '/o2o/miniProgram/getUserInfo',
        data: { iv, encryptedData, session_key },
        method: 'POST',
      }).then((res) => {
        if (Object.keys(res.data.data).length === 0) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          wx.setStorageSync('hasPayPassword', res.data.data.hasPayPassword)
          wx.setStorageSync('auth-token', res.data.data.token)
          wx.setStorageSync('userId', res.data.data.userId)
          this.handleUnorderPay()
        }
      })
    }
  },
  // 提交前往确认菜单
  handleSubmit(e) {
    if (wx.getStorageSync('auth-token')) {
      this.handleUnorderPay()
    } else {
      this.getUserPhone(e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('auth-token')) { // 判断是否登录过
      this.setData({
        isLogin: true
      })
    } else {
      asyncLogin().then((res) => {
        this.setData({
          ...this.data,
          ...res,
        })
      })
    }
    wx.setNavigationBarTitle({
      title: options.shopname,
    })
    // this.getShopDetail()
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
    this.getShopDetail()
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

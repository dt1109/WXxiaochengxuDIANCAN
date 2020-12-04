// pages/qrcp/qrcp.js
import { request } from '../../utils/request.js'
import { Add, Sub } from '../../utils/tool.js'
import { asyncLogin } from '../../utils/promiseLogin.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    unPayOrder: false, // 未支付订单
    isLogin: false, // 是否登录
    remark: '',
    iv: null,
    session_key: null,
    foodList: [],
    money: 0,
    selectGoods: []
  },
  // 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 添加备注
  goWords: function () {
    wx.navigateTo({
      url: '../words/words',
    })
  },
  clearHomeStorage() { // 清楚首页缓存
    wx.removeStorageSync('selectGoods')
    wx.removeStorageSync('money')
    wx.removeStorageSync('unPaidOrder')
    wx.removeStorageSync('remark')
  },
  handleUnorderPay () { // 含有未支付订单 去下单
    this.clearHomeStorage()
    wx.redirectTo({
      url: '/pages/balance/qrcp'
    })
  },
  // 去下单
  handlePay () {
    let arr = this.data.foodList.map(res => {
      return {
        _id: res._id,
        buyNum: res.buyNum
      }
    })
    let obj = {
      areaTableId: wx.getStorageSync('tableId'),
      goods: arr,
      remark: wx.getStorageSync('remark'),
      storeId: wx.getStorageSync('storeId'),
      userId: wx.getStorageSync('userId')
    }
    let dataObj = this.data.unPayOrder ? { _id: this.data.unPayOrder._id, goods: arr, remark: wx.getStorageSync('remark') } : obj
    let apiUrl = this.data.unPayOrder ? '/o2o/miniProgram/order/update' : '/o2o/miniProgram/order/add'
    request({
      url: apiUrl,
      method: 'POST',
      data: dataObj,
    }).then((res) => {
      this.clearHomeStorage()
      wx.redirectTo({
        url: '/pages/balance/qrcp'
      })
    })
  },
  addFoodNum: function (e) { // 商品增
    let index = e.target.dataset.index
    let price = e.target.dataset.price // 价格
    let money = Add(this.data.money, price)
    this.data.foodList[index].buyNum++
    this.setData({
      foodList: this.data.foodList,
      money: money
    })
    wx.setStorageSync('selectGoods', this.data.foodList)
  },
  reduceFoodNum: function (e) { // 商品减
    let index = e.target.dataset.index
    let price = e.target.dataset.price // 价格

    let money = Sub(this.data.money, price)
    let num = this.data.foodList[index].buyNum
    if (num > 0) {
      this.data.foodList[index].buyNum--
      this.setData({
        foodList: this.data.foodList,
        money: money
      })
    }
    wx.setStorageSync('selectGoods', this.data.foodList)
  },
  handleBack() { // 返回上一页
    wx.setStorageSync('money', this.data.money)
    wx.navigateBack({
      delta: 1
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
      // if (unPaidOrder) {
      //   this.getOrderDetail(res.data.data.unPaidOrder.order._id)
      // }
      this.setData({
        unPayOrder: unPaidOrder ? unPaidOrder : false, // 未支付订单内的商品
        remark: wx.getStorageSync('remark'), // 备注
        foodList: wx.getStorageSync('selectGoods'), // 选择的商品
        money: wx.getStorageSync('money') // 价格
        // money: unPaidOrder ? Add(unPaidOrder.payablePrice, wx.getStorageSync('money')) : wx.getStorageSync('money') // 价格
      })
      wx.setStorageSync('payFlag', true)
      // wx.setStorageSync('payFlag', res.data.data.payFlag)
    })
  },
  getOrderDetail(id) {//订单未支付返回继续加菜
      this.setData({
        foodList: []
      })
      request({
        url: '/o2o/miniProgram/order/get',
        data: {
          id: id
        }
      }).then(res => {
        this.setData({
          unPayOrder: res.data.data,
          money: res.data.data.payablePrice
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
    this.setData({
      remark: wx.getStorageSync('remark')
    })
    this.getShopDetail()
    //订单未支付返回继续加菜
    // this.getOrderDetail()
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

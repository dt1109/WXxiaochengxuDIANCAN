import { request } from "../../utils/request"

// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payFlag: false,
    chooseCredit: false, //选择银行卡弹出框的显示状态
    payWayStatus: false,//支付方式是否被选中
    payAlert: false,//确认付款弹出框
    checkPayTyep: 3, // 付款方式选择
    cardList: [],
    defaultBlankCard: null,
    orderInfo: {},
    orderId: null,
    offlineOrderid: null,
    monyInfo: null
  },
  // 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  hidePayAlert () {
    this.setData({
      payAlert: false
    })
  },
  // 选择银行卡
  chooseCredit: function (e) {
    if (e.detail.value == '2') {
      this.setData({
        defaultBlankCard: {
          bankname: '零钱支付',
          signNo: null
        }
      })
    } else if (e.detail.value == '3') {
      if (this.data.cardList[0]) {
        this.setData({
          defaultBlankCard: this.data.cardList[0]
        })
      } else {
        this.setData({
          defaultBlankCard: null
        })
      }
    }
    this.setData({
      checkPayTyep: e.detail.value
    })
  },
  // 添加银行卡后选择银行卡
  chooseCredit2: function () {
    if (this.data.checkPayTyep == '3') {
      this.setData({
        chooseCredit: true
      })
    }

  },
  // 银行卡选择
  blankCardSelect (val) {
    let checkBlank = this.data.cardList.find(v => v.signNo === val.detail.value)
    this.setData({
      defaultBlankCard: checkBlank
    })
  },
  // 添加银行卡
  addCredit: function () {
    wx.navigateTo({
      url: '../add-credit/add-credit',
    })
  },
  // 隐藏选择银行卡弹出框
  chooseCreditHide: function () {
    this.setData({
      chooseCredit: false
    })
  },
  // 确认付款
  payAlert: function () {
    this.setData({
      payAlert: wx.getStorageSync('payAlert')
    })
  },
  payBtn () {
    if (!this.data.payFlag) {
      wx.navigateTo({
        url: `/pages/success/success`,
      })
    } else {
      this.setData({
        payAlert: true
      })
    }
  },
  pay () {
    let ids,
      signNo
    if (this.data.defaultBlankCard) {
      wx.navigateTo({
        url: `../pay-checkd/pay-checkd?ids=${this.data.orderId || wx.getStorageSync('orderId')}&signNo=${this.data.defaultBlankCard.signNo}&checkPayTyep=${this.data.checkPayTyep}`,
      })
    } else {
      wx.showToast({
        title: '请添加银行卡',
        duration: 2000,
        icon: 'none'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('payFlag')) {
      this.setData({
        payFlag: true
      })
    }
    console.log(options)
    wx.setNavigationBarTitle({
      title: '选择支付方式'
    })
    this.setData({
      orderId: options.orderid,
      offlineOrderid: options.ids
    })
    if (options.orderid && options.ids) {
      wx.setStorageSync('orderId', options.orderid)
      wx.setStorageSync('offlineOrderid', options.ids)
    }
    wx.setStorageSync('orderIdReturn', options.ids)
    request({
      url: '/o2o/miniProgram/order/get',
      data: {
        id: options.ids ? options.ids : wx.getStorageSync('offlineOrderid'),
      }
    }).then(res => {
      this.setData({
        orderInfo: res.data.data
      })
      console.log(res.data.data)
      wx.setStorageSync('totalPrice', res.data.data.payablePrice)
    })
    // 请求钱包
    request({
      url: '/account/merchantInfo',
      outer: true
    }).then(res => {
      this.setData({
        monyInfo: res.data.data
      })
    })
    const self = this
    this.payAlert()
    request({
      url: '/account/binding/getcards',
      outer: true,
    }).then(res => {
      if (res.data.data.length > 0) {
        self.setData({
          cardList: res.data.data,
          defaultBlankCard: res.data.data[0]
        })
      }

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
    wx.setStorageSync('orderShow', true)
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
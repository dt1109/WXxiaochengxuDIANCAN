// pages/login/login.js
import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,  // 手机号
    buildMsg: false, // 是否发送验证码
    rebuild: false,
    chackPhone: false,  // 手机号码验证
    Length:4,        //输入框个数
    isFocus:true,    //聚焦
    authcode:"",        //输入的内容
    countdownNum: 60  // 倒计时
  },
  Focus(e){
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      authcode:inputValue,
    })
  },
  Tap(){
    var that = this;
    that.setData({
      isFocus:true,
    })
  },
  // 倒计时
  countdown(){
    let time = 60
    this.getValidateCode()
    let inter = setInterval(()=> {
      time -= 1
      this.setData({
        countdownNum: time
      })
      if(this.data.countdownNum == 0){
        clearInterval(inter)
      }
    }, 1000)
  },
  getMsg(){
    if(this.data.chackPhone){
      this.setData({
        buildMsg: true
      })
      this.countdown()
    }else{
      wx.showToast({
        title: '手机号码格式错误',
        icon: "none"
      })
    }
  },
  /**获取验证码 */
  getValidateCode:function(){
    request({
      url: '/account/logincode',
      outer: true,
      data: { phone: this.data.phone }
    }).then(res => {
      this.setData({
        buildMsg: true
      })
    })
  },
  // 登录
  login(){
    request({
      url: '/account/logincode',
      data: {
        param: JSON.stringify({ phone: this.data.phone, logincode: this.data.authcode })
      },
      method: 'POST',
			type: 'formData',
			outer: true,
    }).then(res => {
      wx.setStorageSync('auth-token', res.data.data[0].token)
      wx.navigateTo({
        url: '../home/home',
      })
    })
  },
  setPhone(e){
    if (e.detail.value.length == 11) {
      this.setData({
        chackPhone: true,
        phone: e.detail.value
      })
    } else {
      this.setData({
        chackPhone: false,
        phone: null
      })
    }
    
  },
  /**跳转到服务协议页面 */
  toProtocol: function () {
    wx.navigateTo({
      url: '/pages/protocol/protocol',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录'
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
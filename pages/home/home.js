// pages/home/home.js
import { request } from '../../utils/request.js'
import { asyncLogin } from '../../utils/promiseLogin.js'
import { Add, Sub, Multiply } from '../../utils/tool.js'
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    detailData: {}, // 商品详情数据
    canAuth: false, // 是否授权过
    menuArrLength: [], // 菜单子集数量
    foodNum: 0, // 加入购物车菜品数量
    money: 0, // 加入购物车的价格
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    code: null,
    openid: null,
    encryptedData: null,
    iv: null,
    session_key: null,
    detailShow: false,
    cartListState: false,
    foodItemNum: 0,
    cartList: [],
    cartNumber: 0,
    menu: [],
    activeIndex: 1,
    page: 1,
    foodList: [],
    toView: 'a0',
    scrollTop: 100,
  },
  // 过滤并存储选中的商品
  getSelectGoods () {
    let selectArr = this.data.foodList.filter((res) => {
      return res.buyNum > 0
    })
    wx.setStorageSync('selectGoods', selectArr)
    wx.setStorageSync('money', this.data.money)
  },
  goCheckOrder () {
    // 前往确认订单
    this.getSelectGoods()
    wx.navigateTo({
      url: '/pages/qrcp/qrcp?shopname=' + this.data.detailData.store.name,
    })
  },
  // 提交前往确认菜单
  handleSubmit (e) {
    if (wx.getStorageSync('auth-token')) {
      this.goCheckOrder()
    } else {
      this.getUserPhone(e)
    }
  },
  // 获取用户手机号
  getUserPhone (e) {
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
          this.goCheckOrder()
        }
      })
    }
  },
  /**菜品分类tab切换 */
  changeIndex: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
      // scrollTop: 1186
    })
  },
	/**
	 * 商品详情显示隐藏
	 */
  showDetail: function (e) {
    this.setData({
      goodsDetailData: e.currentTarget.dataset,
      detailShow: true,
    })
  },
  detailHide: function () {
    this.setData({
      detailShow: false,
    })
  },
	/**
	 * 购物车列表显示隐藏
	 */
  showCartList: function (e) {
    if (this.data.foodNum) {
      this.setData({
        cartListState: !this.data.cartListState,
      })
    }
  },
  hideMask: function (e) {
    this.setData({
      cartListState: false,
    })
  },
  showMask: function (e) {
    this.setData({
      cartListState: true,
    })
  },
  scroll: function (e) {
    // 监听滚动  {up: 上一个临界值, down: 下一个临界值}
    let menuData = this.data.menu
    let menuArrLength = this.data.menuArrLength

    let dis = e.detail.scrollTop
    menuArrLength.forEach((r, index) => {
      if (dis >= r.up && dis < r.down) {
        this.setData({
          activeIndex: index,
        })
      }
    })
  },
	/**
	 * 菜品数量加
	 */
  addFoodNum: function (e) {
    let price = e.target.dataset.price // 价格
    let index = e.target.dataset.buynum // 数量
    let parentIndex = e.target.dataset.index

    this.data.menu[parentIndex].goodsList[index].buyNum++
    
    let money = Add(this.data.money, price)
    this.setData({
      menu: this.data.menu,
      foodList: this.data.foodList,
      foodNum: this.data.foodNum + 1,
      money: money
    })
  },
	/**
	 * 菜品数量减
	 */
  reduceFoodNum: function (e) {
    let price = e.target.dataset.price // 价格
    let index = e.target.dataset.buynum
    let parentIndex = e.target.dataset.index
    let num = this.data.menu[parentIndex].goodsList[index].buyNum
    let money = Sub(this.data.money, price)
    if (num > 0) {
      this.data.menu[parentIndex].goodsList[index].buyNum--
      this.setData({
        menu: this.data.menu,
        foodList: this.data.foodList,
        foodNum: this.data.foodNum - 1,
        money: money,
      })
    }
  },
  addFoodNumCart: function (e) {
    // 购物车商品增
    let index = e.target.dataset.index
    let price = e.target.dataset.price // 价格
    let money = Add(this.data.money, price)
    this.data.foodList[index].buyNum++
    
    this.setData({
      menu: this.data.menu,
      foodList: this.data.foodList,
      foodNum: this.data.foodNum + 1,
      money: money,
    })
  },
  reduceFoodNumCart: function (e) {
    // 购物车商品减
    let index = e.target.dataset.index
    let price = e.target.dataset.price // 价格

    let money = Sub(this.data.money, price)
    let num = this.data.foodList[index].buyNum

    if (num > 0) {
      this.data.foodList[index].buyNum--
      this.setData({
        menu: this.data.menu,
        foodList: this.data.foodList,
        foodNum: this.data.foodNum - 1,
        money: money,
      })
    }
  },
  getShopDetail (options) {
    // 获取商铺信息
    request({
      url: '/o2o/miniProgram/store/getInfo',
      data: {
        storeId: options.storeId,
        tableId: options.tableId,
      },
    }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.data.store.name,
      })
      this.setData({
        detailData: res.data.data,
      })
      if (!!res.data.data.unPaidOrder.order) {
        if (!this.isUnPayBack()) {
          wx.navigateTo({
            url: '/pages/balance/qrcp'
          })
        }
      }
      wx.setStorageSync('payFlag', true)
      // wx.setStorageSync('payFlag', res.data.data.payFlag)
    })
  },
  saveShopMessage (options) {
    // 保存店铺信息
    this.getShopDetail(options)
    wx.setStorageSync('storeId', options.storeId)
    wx.setStorageSync('tableId', options.tableId)
  },
  clearStorageSync () { // 清除非身份缓存
    wx.removeStorageSync('orderId')
    wx.removeStorageSync('offlineOrderid')
    wx.removeStorageSync('orderIdReturn')
    wx.removeStorageSync('totalPrice')
    wx.removeStorageSync('selectGoods')
    wx.removeStorageSync('money')
  },
  isUnPayBack () { // 是否是结算页加菜返回的页面，是的话，返回 true
    let pages = getCurrentPages();//页面对象
    let prevpage = pages[pages.length - 2];//上一个页面对象
    if (prevpage) {
      if (prevpage.route === 'pages/balance/qrcp') {
        return true
      }
    }
    return false
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    this.clearStorageSync()
    if (options.storeId) { // 默认id小程序审核用
      this.saveShopMessage(options)
    } else {
      this.saveShopMessage({
        storeId: '5ddce1463c6dcd18a998d291',
        tableId: '5efb27e648a3fc635559606c'
      })
    }
    this.setData({
      nbLoading: true,
      canAuth: wx.getStorageSync('auth-token') ? true : false,
    })

    asyncLogin().then((res) => {
      this.setData({
        ...this.data,
        ...res,
      })
    })
    if (options.storeId) {
      this.getFoodList(options.storeId)
    } else {
      this.getFoodList('5ddce1463c6dcd18a998d291')
    }
    // this.getFoodList(wx.getStorageSync('storeId'))
  },
  getFoodList: function (id) {
    // 获取分类列表
    request({
      url: '/o2o/miniProgram/getCascade',
      data: {
        storeId: id,
      },
    }).then((res) => {
      let menuArrLength = [] // 存放子集数量
      let objMenuArrLength = []
      res.data.data.forEach((item) => {
        menuArrLength.push(item.goodsList.length)
        item.goodsList.forEach((ele) => {
          ele.buyNum = 0
        })
      })
      menuArrLength.forEach((v, index) => {
        let downNum = 0
        let upNum = 0
        for (let i = index; i >= 0; i--) {
          downNum += menuArrLength[i]
          if (i !== index) {
            upNum += menuArrLength[i]
          }
        }

        objMenuArrLength.push({
          up: upNum * 100,
          down: downNum * 100,
        })
      })

      this.setData({
        menuArrLength: objMenuArrLength,
        menu: res.data.data,
      })
      let foodList = this.data.foodList
      for (let i = 0; i < res.data.data.length; i++) {
        foodList.push(...res.data.data[i].goodsList)
      }
      this.setData({ foodList: foodList })
      
    })
  },
  fillSelectCartGoods() { // 填充购物车数量
    const foodList = this.data.foodList
    const selectGoods = wx.getStorageSync('selectGoods') // 选择的商品
    
    if (selectGoods) {
      selectGoods.forEach(r => {
        foodList.forEach(v => {
          if (r._id === v._id) { // 确认订单修改的菜品
            v.buyNum = r.buyNum
          } else {
            v.buyNum = 0
          }
        })
      })
      this.setData({
        foodList: foodList
      })
    } else {
      foodList.forEach(r => {
        r.buyNum = 0
      })
      this.setData({
        foodList: foodList,
        foodNum: 0
      })
    }
  },
  fillSelectGoods() { // 填充商品列表数量
    const menu = this.data.menu
    const selectGoods = wx.getStorageSync('selectGoods') // 选择的商品
    if (selectGoods) {
      selectGoods.forEach(r => {
        menu.forEach(v => {
          if (v.goodsList && v.goodsList.length) {
            v.goodsList.forEach(val => {
              if (r._id === val._id) { // 确认订单修改的菜品
                val.buyNum = r.buyNum
              } else {
                val.buyNum = 0
              }
            })
          }
        })
      })
      this.setData({
        menu: menu
      })
    } else { // 重置成0
      menu.forEach(v => {
        if (v.goodsList && v.goodsList.length) {
          v.goodsList.forEach(val => {
            val.buyNum = 0
          })
        }
      })
      this.setData({
        menu: menu,
        foodNum: 0
      })
    }
  },
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {
    this.fillSelectGoods()
    this.fillSelectCartGoods()
    this.setData({
      canAuth: wx.getStorageSync('auth-token') ? true : false,
      money: wx.getStorageSync('money') ? wx.getStorageSync('money') : 0
    })
  },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () { },

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () { },

	/**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function () { },
})

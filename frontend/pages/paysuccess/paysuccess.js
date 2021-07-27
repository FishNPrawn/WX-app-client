// pages/paysuccess/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    order_basic_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo: userInfo});
    const order_basic_info = wx.getStorageSync("order_basic_info");
    this.setData({order_basic_info: order_basic_info});
  },

  backtohome(){
    wx.setStorageSync('order_basic_info', null)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  backtoorder(){
    wx.setStorageSync('order_basic_info', null)
    wx.switchTab({
      url: '/pages/personal/personal',
    })
  }

 
})
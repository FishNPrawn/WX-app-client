const util = require('../../utils/util.js');
let app = getApp();
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

    var userInfo = wx.getStorageSync('userInfo');
    var address = wx.getStorageSync('address');
    // 当地时间
    var time = util.formatTime(new Date());
    var openid = wx.getStorageSync("openid");
    // 添加新用户到后台
    wx.request({
      url: app.globalData.baseUrl + '/userinfo/create',
      method: "POST",
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        openid: openid,
        session_key: "session_key",
        username: userInfo.nickName,
        city: userInfo.city,
        phone: address.telNumber,
        user_create_time: time,
      },
      success: function(res){
        console.log("新用户添加成功", res.data);
      }
    })
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
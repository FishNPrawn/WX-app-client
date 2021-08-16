// pages/entry/entry.js
//page object 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 3000)
  },
  goToIndexPage(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})
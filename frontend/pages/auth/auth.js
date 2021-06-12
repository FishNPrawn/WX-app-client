// pages/auth/auth.js
Page({
//获取用户信息
  handleGetUserInfo(e){
    wx.setStorageSync('userInfo', e.detail.userInfo)
    wx.navigateBack({
      delta: 1
    });
  }
})
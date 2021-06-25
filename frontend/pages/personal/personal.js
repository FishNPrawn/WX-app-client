// pages/personal/personal.js
Page({
 data:{
  userInfo:{}
 },
 onShow(){
   const userInfo = wx.getStorageSync("userInfo");
   this.setData({userInfo: userInfo});
 },

  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    wx-wx.navigateBack({
      delta: (0)
    });
  },

  goToMyOrder: function() {
    wx.navigateTo({
      url: '../order/order',
    })
  },

})

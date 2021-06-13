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
   wx.setStorageSync('userInfo', e.detail.userInfo)
}
})

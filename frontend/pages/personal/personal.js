// pages/personal/personal.js
let app = getApp();
const util = require('../../utils/util.js');
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
    
    // 当地时间
    var time = util.formatTime(new Date());
    const openid = wx.getStorageSync("openid");
  
    // 添加新用户到后台
    wx.request({
      url: app.globalData.baseUrl + '/userinfo/create',
      method: "POST",
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        openid: openid,
        username: userInfo.nickName,
        city: userInfo.city,
        phone: "phonetest",
        user_create_time: time,
      },
      success: function(res){
        console.log("新用户添加成功", res.data);
      }
    })

  },

  goToMyOrder: function(event) {
    wx.navigateTo({
      url: '../order/order?status='+event.currentTarget.dataset.status,
    })
  },

})

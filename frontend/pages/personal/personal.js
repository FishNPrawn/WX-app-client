// pages/personal/personal.js
let app = getApp();
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
    
    // 获取当地时间
    const formatTime = date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    // 当地时间
    var time = formatTime(new Date())
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

const util = require('../../utils/util.js');
let app = getApp();
Page({

  data: {
    userInfo:{},
  },

  backToPrev(){
    wx.navigateBack()
  },

  handleGetUserInfo(e){
    var session_key;
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://fishnprawn.cn/wechat/getOpenId',
            data: {
              code: res.code
            },
            success:function(res) {
              session_key = res.data.session_key;
              wx.setStorageSync("openid", res.data.openid);//将用户id保存到缓存中
              
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
                  session_key: session_key,
                  username: userInfo.nickName,
                  city: userInfo.city,
                  phone: "phonetest",
                  user_create_time: time,
                },
                success: function(res){
                  console.log("新用户添加成功", res.data);
                  wx.switchTab({
                    url: '/pages/personal/personal',
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
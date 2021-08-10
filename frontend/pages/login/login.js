const util = require('../../utils/util.js');
let app = getApp();
Page({

  data: {
    // userInfo:{},
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.switchTab({
          url: '/pages/personal/personal',
        })

      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
            url: app.globalData.baseUrl + '/wechat/getOpenId', 
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
                  session_key: "session_key",
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
const loginDataKey = 'loginData'

//app.js
App({
  onLaunch: function () {
    const loginData = wx.getStorageSync(loginDataKey)
    let toLogin = () => {
      wx.showLoading({title: '登录中', icon: 'loading', mask: true})
      wx.login({
        success(res){
          let success = () => {
            let loginResponse = {"openid":"TODO: get open id"}
            wx.setStorageSync(loginDataKey, loginResponse)
            wx.hideLoading()
          }
          let fail = () => {
            wx.hideLoading()
            wx.showToast({
              title: '登录失败，请重新打开小程序试试',
              icon: 'none',
              duration: 1e8
            })
          }
          // TODO 发起网络请求
          // 延时模拟请求登录成功
          setTimeout(success, 500)
        },
        fail(err){
          console.error(err)
          wx.hideLoading()
          wx.showToast({
            title: '登录失败，请重新打开小程序试试',
            icon: 'none',
            duration: 1e8
          })
        }
      })
    }
    // 未登录，去登录
    if(!loginData){
      toLogin()
    // 已登录，但是微信session_key过期
    }else{
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('session_key 未过期')
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          console.error('session_key 已经失效，需要重新执行登录流程, 重新登录中')
          toLogin()
        }
      })
    }
    // 测试------------------------------------------------
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
              console.log("openid: " + res.data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  globalData: {
    userInfo: {},
    baseUrl: 'https://fishnprawn.cn'
  }
})
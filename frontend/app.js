const loginDataKey = 'loginData'
//app.js
App({
  onLaunch: function () {
    // 云开发-支付
    wx.cloud.init({
      env: "cloud1-0gpxp1848b37de8d"
    })
    this.getOpenid();
    const loginData = wx.getStorageSync(loginDataKey)
    let toLogin = () => {
      // wx.showLoading({title: '登录中', icon: 'loading', mask: true})
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

    // 版本更新，会弹出框框询问是否更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },

  // 获取用户openid
  getOpenid: function() {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      app.globalData.openid = openidStor;
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          var openid = res.result.openid;
          wx.setStorageSync('openid', openid)
          app.globalData.openid = openid;
        },
        fail(res) {
          console.log('云函数获取失败', res)
        }
      })
    }
  },

  globalData: {
    userInfo: {},
    openid: null,
    baseUrl: 'https://joynfish.com'
    // baseUrl: 'https://fishnprawn.cn:8443'
    // baseUrl: 'http://localhost:8080'
  }
})
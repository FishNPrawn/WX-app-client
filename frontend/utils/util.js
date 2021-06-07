const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const loginDataKey = 'loginData'

const toLogin = () => {
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

module.exports = {
  formatTime, toLogin
}

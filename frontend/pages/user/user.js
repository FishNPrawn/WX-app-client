// pages/user/user.js
const util = require('../../utils/util.js');
Page({
  
  goPay(){
    const orderNumber = util.order_number();
    wx.cloud.callFunction({
      name: 'cloudpay',
      data: {
        orderNumber: orderNumber
      },
      success: res => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success (res) {
            console.log('pay success', res)
          },
          fail (err) {
            console.error('pay fail', err)
          }
        })
      },
      fail: console.error,
    })
  }
})
// pages/order_detail/order_detail.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      orderId: -1,
      orderDetail: [],
      totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      orderId: options.order_id
    })
    wx.request({
      url: app.globalData.baseUrl + '/order/order_detail_filter?filter='+options.order_id,
      success: function(res) {
        try {
          var totalPrice = 0
          for (const item of res.data.data) {
            totalPrice += item.good_quantity * item.good_price
          }
          that.setData({
            orderDetail: res.data.data,
            totalPrice: totalPrice
          })
        } catch {
          that.setData({
            list: []
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
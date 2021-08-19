import {request} from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    orderlistByPromoter: [],
    total_commission: 0,
    promo_code: null,
    commission_rate: null,
    commission_rate_percent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo: userInfo});

    var openId = wx.getStorageSync('openid')
    request({
      url: app.globalData.baseUrl + '/promo_code/checkPromoCodeByOpenId?openId=' + openId
    }) 
    .then(result=>{
      var commission_rate_percent = result.data.commission_rate*100;
      if(result.data.success == true){
        this.setData({
          promo_code: result.data.promo_code,
          commission_rate: result.data.commission_rate,
          commission_rate_percent: commission_rate_percent
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var promoCodeHeaderId = wx.getStorageSync('promoCodeHeaderId')
    request({
      url: app.globalData.baseUrl + '/promo_code/order_filter_by_promocode_header_id?promoCodeHeaderId=' + promoCodeHeaderId
    }) 
    .then(result=>{
      var order = []
      var total_commission = 0;
      for(var i = 0; i < result.data.data.length; i++){
        result.data.data[i].total_price_without_express_fee = (result.data.data[i].order_total_price_with_express_fee - result.data.data[i].order_express_fee).toFixed(2);
        result.data.data[i].earn = (result.data.data[i].total_price_without_express_fee *this.data.commission_rate).toFixed(2);
        // total_commission = (total_commission + result.data.data[i].total_price_without_express_fee*this.data.commission_rate).toFixed(2);
        total_commission = parseFloat(total_commission) + parseFloat(result.data.data[i].earn)
        total_commission = total_commission.toFixed(2)
        order.push(result.data.data[i])
      }
      this.setData({
        orderlistByPromoter: order,
        total_commission: total_commission
      })
    })
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
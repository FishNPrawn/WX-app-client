import {request} from "../../request/index.js";
import util from "../../utils/util.js";
var app = getApp()
Page({
  data: {
      orderId: -1,
      orderDetail: [],
      totalPrice: 0,
      list: [],
      goods_list:[],
  },
  goodInfo: {},
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      orderId: options.order_id
    })
    this.getCates()
    wx.request({
      url: app.globalData.baseUrl + '/order/listByOrderId?orderid='+options.order_id,
      success: function(res) {
        try {
          var totalPrice = 0
          for (const item of res.data[0].orderDetailList) {
            totalPrice += item.good_quantity * item.good_price
          }
          that.setData({
            orderInfo: res.data[0],
            orderDetailList: res.data[0].orderDetailList,
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

  getCates(){
    request({
      url: app.globalData.baseUrl + '/good/getAllgood'
    })
    .then(res=>{
      this.Cates=res.data.data
      var goods = [];
      var flag = 0;
      for (var categoryIndex = 0; categoryIndex < this.Cates.length; ++categoryIndex) {
        for (var goodIndex = 0; goodIndex < this.Cates[categoryIndex].array.length; ++goodIndex) {
          if (flag == 0) {
            goods.push([this.Cates[categoryIndex].array[goodIndex]]);
            flag = 1;
          } else {
            var tempBox = goods.pop();
            tempBox.push(this.Cates[categoryIndex].array[goodIndex]);
            flag = 0;
            goods.push(tempBox);
          }
        }
      }
      this.setData({
        goods_list: goods
      })
    })
  },

  // 主页面add button
  handleCartAdd(event) {
    util.handleCartAdd(event);
  },
  

})
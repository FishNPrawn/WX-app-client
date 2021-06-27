import {request} from "../../request/index.js";
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
    let cart = wx.getStorageSync("cart") || [];
    let goodInfo=event.currentTarget.dataset.variable;
    let index = cart.findIndex(v => v.good_id === goodInfo.good_id);
    if (index === -1) {
      goodInfo.num = 1;
      goodInfo.checked = true;
      cart.push(goodInfo);
    } 
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  

})
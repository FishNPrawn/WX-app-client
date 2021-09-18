import {request} from "../../request/index.js";

import { getSetting, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
const util = require('../../utils/util.js');

//page object 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [],
    totalNum: 0
  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCates();
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
    let cart = wx.getStorageSync("cart") || [];
    let totalNum = 0;
    cart.forEach(v => {
        totalNum += v.num;
    })
    this.setData({
      totalNum: totalNum
    })

    this.getCates();
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

  },

  getCates(){
    request({
      url: app.globalData.baseUrl + '/good/getAllgood'
    })
    .then(res=>{
      this.Cates=res.data.data
      var goods = [];
      goods.push(this.Cates[0]);
      goods = goods[0].array
      this.setData({
        goods_list: goods
      })
    })
  },

  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },

  goToCart(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  handleCartAdd(event){
    let cart = wx.getStorageSync("cart") || [];
    let goodInfo=event.currentTarget.dataset.variable;
    let index = cart.findIndex(v => v.good_id === goodInfo.good_id);
    if (index === -1) {
      if (!goodInfo.num) {
        goodInfo.num = 1;
      } else {
        goodInfo.num += 1;
      }
      goodInfo.checked = true;
      cart.push(goodInfo);
    } else {
      var savedInfo = cart[index];
      if (!savedInfo.num) {
        savedInfo.num = 1;
      } else {
        savedInfo.num += 1;
      }
      cart[index] = savedInfo;
    }

    let totalNum = 0;
    cart.forEach(v => {
        totalNum += v.num;
    })
    this.setData({
      totalNum: totalNum
    })

    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 600,
      mask: true
    });
  }

})
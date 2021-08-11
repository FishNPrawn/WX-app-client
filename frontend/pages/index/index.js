import {request} from "../../request/index.js";

import { getSetting, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
const util = require('../../utils/util.js');

//page object 
let app = getApp();
Page({
  data: {
    goods_list:[],
    featured_cards_1:[],
    featured_cards_2:[],
    //轮播图数组
    swiperList:[],
    //首页分类导航数组
    catesList:[],
  },
  goodInfo: {},
  Cates:[],
  catName: '',
  // 页面加载会触发
  onLoad:function(options){
    //发送异步请求获取轮播图数据
    this.getSwiperList();
    this.getCates();
    this.getFeaturedCard();
    this.getLeftMenuListData();

    // 获取当前的地理位置、速度。
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude //纬度
        const longitude = res.longitude //经度
        const speed = res.speed
        const accuracy = res.accuracy
        // console.log(latitude)
        // console.log(longitude)
        // console.log(speed)
        // console.log(accuracy)
      }
    });

    // 底部导航栏购物车数量
    let cart = wx.getStorageSync('cart') || [];
    util.setTabBarBadgeNumber(cart);
  },
  onShow(){
    // 底部导航栏购物车数量
    let cart = wx.getStorageSync('cart') || [];
    util.setTabBarBadgeNumber(cart);
  },

  onPullDownRefresh: function () {
    this.onLoad(); //重新加载onLoad()
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  },

  //获取轮播图数据
  getSwiperList(){
    request({url: app.globalData.baseUrl + '/allswiper/getAllSwiper'}) 
    .then(result=>{
      this.setData({
        swiperList: result.data.data
      })
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

  onClick: function (event) {
    var _this = this;
    if (event.currentTarget.id != "search") {
      this.catName = event.currentTarget.id
      getApp().globalData.showDialog = this;
      wx.switchTab({
        url: '/pages/category/category'
      });
    } else {
      wx.redirectTo({
        url: '/pages/searchResult/searchResult'
      });
    }
  },
  // navigato to good_Detail
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },

  // 主页面add button
  handleCartAdd(event) {
    util.handleCartAdd(event);
  },


    // 回到顶部
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 1500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  getFeaturedCard: function() {
    request({
      url: app.globalData.baseUrl + '/category/json/getAllcategory',
    })
    .then(res=>{
      let features =res.data.data
      this.setData({
        featured_cards_1: features.slice(0,4),
        featured_cards_2: features.slice(4)
      })
    })
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
});
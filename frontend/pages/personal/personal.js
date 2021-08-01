import {request} from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";

let app = getApp();
const util = require('../../utils/util.js');
Page({
 data:{
  userInfo:{},
  goods_list:[],
  address: {},
  url: '#'
 },
  goodInfo: {},
  Cates:[],
 // 页面加载会触发
  onLoad:function(options){
    this.getCates();
  },
  onShow(){
    const address = wx.getStorageSync("address");
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo: userInfo});

    this.setData({ address });
    // 底部导航栏购物车数量
    let cart = wx.getStorageSync('cart') || [];
    util.setTabBarBadgeNumber(cart);
  },
  
  goToLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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
    // 底部导航栏购物车数量
   util.setTabBarBadgeNumber(cart);
  },

  // 管理地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);

    } 
    catch (error) {
      console.log(error);   //Needed for error catching, but may need to change to third party logger in the future
    }
  },

  // 跳转到我的订单
  goToMyOrder: function(event) {
    wx.navigateTo({
      url: '../order/order?status='+event.currentTarget.dataset.status,
    })
  },
  

  // 跳转到’关于我们‘公众号
  enterAboutUs: function(){
    wx.navigateTo({
      title: "关于我们",
      url: "/pages/aboutus/aboutus"
    })
  },

  // navigato to good_Detail
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
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
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },

})

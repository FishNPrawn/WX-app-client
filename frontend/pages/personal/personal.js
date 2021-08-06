import {request} from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";

let app = getApp();
const util = require('../../utils/util.js');
Page({
 data:{
  userInfo:{},
  address: {},
  url: '#'
 },
  goodInfo: {},
  Cates:[],
 // 页面加载会触发
  onLoad:function(options){
    
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


  // 主页面add button
  handleCartAdd(event) {
    util.handleCartAdd(event);
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


  showCustomerServicePhone: function () {
    wx.showModal({
      title: '客服',
      content: '客服电话 13888888888',
      confirmText: '拨打电话',
      success (res) {
        wx.makePhoneCall({
          phoneNumber: '13888888888'
        })
      }
    })
  },

})

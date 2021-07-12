import {request} from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
let app = getApp();
const util = require('../../utils/util.js');
Page({
 data:{
  userInfo:{},
  goods_list:[],
  address: {},
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
   this.setData({
    address
  })
 },
  
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    
    // 当地时间
    var time = util.formatTime(new Date());
    const openid = wx.getStorageSync("openid");
    const session_key = wx.getStorageSync("session_key");
  
    // 添加新用户到后台
    wx.request({
      url: app.globalData.baseUrl + '/userinfo/create',
      method: "POST",
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        openid: openid,
        session_key: session_key,
        username: userInfo.nickName,
        city: userInfo.city,
        phone: "phonetest",
        user_create_time: time,
      },
      success: function(res){
        console.log("新用户添加成功", res.data);
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


  goToMyOrder: function(event) {
    wx.navigateTo({
      url: '../order/order?status='+event.currentTarget.dataset.status,
    })
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

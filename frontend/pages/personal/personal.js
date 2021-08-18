import {request} from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";

let app = getApp();
const util = require('../../utils/util.js');
Page({
 data:{
  userInfo:{},
  address: {},
  url: '#',
  isPromoter: false
 },
  goodInfo: {},
  Cates:[],
 // 页面加载会触发
  onLoad:function(options){
    var openId = wx.getStorageSync('openid')
    request({
      url: app.globalData.baseUrl + '/promo_code/checkPromoCodeByOpenId?openId=' + openId
    }) 
    .then(result=>{
      if(result.data.success == true){
        this.setData({
          isPromoter:true
        })
        wx.setStorageSync('promoCodeHeaderId', result.data.promoCodeHeaderId)
      }
    })
  },
  onShow(){
    const address = wx.getStorageSync("address");
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo: userInfo});

    this.setData({ address });
    // 底部导航栏购物车数量
    let cart = wx.getStorageSync('cart') || [];
    util.setTabBarBadgeNumber(cart);

    var openId = wx.getStorageSync('openid')
    request({
      url: app.globalData.baseUrl + '/promo_code/checkPromoCodeByOpenId?openId=' + openId
    }) 
    .then(result=>{
      if(result.data.success == true){
        this.setData({
          isPromoter:true
        })
        wx.setStorageSync('promoCodeHeaderId', result.data.promoCodeHeaderId)
      }
    })
  },
  
  goToLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
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

  // 跳转到团长页面
  goToPromoter: function(){
    wx.navigateTo({
      url: '../promoter/promoter'
    })
  },

  enterBePromoter: function(){
    if(this.data.isPromoter == true){
      showToast({title:"你已经是团长!"});
    }else{
      wx.navigateTo({
        url: '/pages/promocodeIntro/promocodeIntro'
      })
    }
  },
  

  // 跳转到’关于我们‘公众号
  enterAboutUs: function(){
    wx.navigateTo({
      title: "关于我们",
      url: "/pages/aboutus/aboutus"
    })
  },

  enterPlatformRule: function(){
    wx.navigateTo({
      title: "平台规则",
      url: "/pages/platformRule/platformRule"
    })
  },

  goToOfficialAccount: function(){
    wx.navigateTo({
      url: "/pages/official-account/official-account"
    })
  },

  // 调用客服
  // goToCustomerService:function(){

  //   var session_key = wx.getStorageInfoSync('session_key')
  //   request({url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8f882af467265220&secret=fb1f62bdbb62c3972ab830d471966a72'}) 
  //   .then(result=>{
  //     console.log(result.data)
  //     request({
  //       url: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+result.data.access_token,
  //       method: "POST"
  //     }) 
  //     .then(result1=>{
  //       console.log(result1.data)
  //     })
  //   })

    // wx.cloud.callFunction({
    //   name: 'customer_service',
    //   data:{
        
    //   },
    //   success: res => {
    //     const payment = res.result
    //     console.log(payment)
    //   },
    //   fail: console.error,
    // })


    // wx.openCustomerServiceChat({
    //   extInfo: {url: ''},
    //   corpId: 'ww64e085d4b17b87b1',
    //   success(res) {
    //     console.log("客服调用成功")
    //   }
    // })
  // },

  // navigato to good_Detail
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },


  showCustomerServicePhone: function () {
    wx.makePhoneCall({
      phoneNumber: '13922261090',
      success: function () {
        console.log("成功拨打电话")
      },
      fail: function () {        
        console.log("拨打电话失败！")      
      }

    })
    // wx.showModal({
    //   title: '客服',
    //   content: '客服电话 13922261090',
    //   confirmText: '拨打电话',
    //   success (res) {
    //     wx.makePhoneCall({
    //       phoneNumber: '13922261090'
    //     })
    //   }
    // })
  },

})

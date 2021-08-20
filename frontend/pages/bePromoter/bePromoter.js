import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import {request} from "../../request/index.js";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    address: {},
    nameInput: null,
    phoneInput:null,
    addressInput: null,
    select: false,
    defaultCity: '广州',
    cityContent: ['广州', '深圳', '佛山', '潮汕', '其他']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const address = wx.getStorageSync("address");
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo,
      address: address,
      addressInput: address.all
    });
  },

  bindShowMsg() {
    this.setData({
        select:!this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
        defaultCity: name,
        select: false
    })
  },


  nameInput:function(e){
    this.data.nameInput = e.detail.value;
  },
  phoneInput:function(e){
    this.data.phoneInput = e.detail.value;
  },
  addressInput:function(e){
    this.data.addressInput = e.detail.value;
  },
  createPromoCode(){
    var that = this;
    var username = that.data.nameInput;
    var promo_code="test124"
    var phone = that.data.phoneInput;
    var address = that.data.addressInput;
    var city = that.data.defaultCity;
    var remark = "无备注";
    var openid = wx.getStorageSync('openid');
    if(username == null || username == ""){
      showToast({title:"请填写姓名"});
    }else if(phone == null || phone == ""){
      showToast({title:"请填写手机号"});
    }else if(city == null || city == ""){
      showToast({title:"请填写城市"});
    }else if(address == null || address == ""){
      showToast({title:"请填写地址"});
    }else{
      request({
        method: "POST",
        url: app.globalData.baseUrl + '/promo_code/createByUser',
        data:{   
          username: username,
          phone: phone,
          address: address,
          city: city,
          remark: remark,
          openId: openid,
          promo_code_verify: 0
        }
      })
      .then(res=>{
        console.log("添加团长码成功", res);
      })
      wx.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 1000,
        mask: true
      });
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/personal/personal'
        })
      },1000)
    }
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
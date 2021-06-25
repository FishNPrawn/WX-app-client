import {request} from "../../request/index.js";
//JS
var app = getApp()
let orderStatus = 1; //0"新订单，未支付;1"新订单，已支付";2, "已取消"；3"待评价"；4“已完成”
Page({
  data: {
    // 顶部菜单切换
    navbar: ["全部", "待发货", "待收货", "待评价"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: [],
    goods_list:[],
  },
  goodInfo: {},
  Cates:[],
  // 页面加载会触发
  onLoad:function(options){
    this.getCates();
  },
  //顶部tab切换
  navbarTap: function(e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })

    //1"全部订单";2, "待发货"；3"待收货"待评价
    if (index == 1) {
      orderStatus = 2;
    } else if (index == 2) {
      orderStatus = 3;
    } else if (index == 3) {
      orderStatus = 4;
    } else {
      orderStatus = 1;
    }
    this.getMyOrderList();
  },

  onShow: function() {
    this.getMyOrderList();
  },

  getMyOrderList() {
    // let that = this;
    // let openid = app._checkOpenid();
    // if (!openid) {
    //   return;
    // }
    // //请求自己后台获取用户openid
    // wx.request({
    //   url: app.globalData.baseUrl + '/userOrder/listByStatus',
    //   data: {
    //     openid: openid,
    //     orderStatus: orderStatus
    //   },
    //   success: function(res) {
    //     console.log(res);
    //     if (res && res.data && res.data.data && res.data.data.length > 0) {
    //       let dataList = res.data.data;
    //       console.log(dataList)
    //       that.setData({
    //         list: dataList
    //       })
    //     } else {
    //       that.setData({
    //         list: []
    //       })
    //     }
    //   }
    // })
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
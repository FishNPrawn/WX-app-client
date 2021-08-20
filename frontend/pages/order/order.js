import {request} from "../../request/index.js";

import util from "../../utils/util.js";

//JS
var app = getApp()
let orderStatus = 1; //0"新订单，未支付;1"新订单，已支付";2, "已取消"；3"待评价"；4“已完成”
const OrderStatysEnum = {0:"新订单，未支付", 21:"新订单，已支付", 2:"已取消", 3:"待评价", 4:"已完成"}
Page({
  data: {
    // 顶部菜单切换
    navbar: ["全部", "待发货", "待收货", "待评价"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: [],
    goods_list:[],
    totalNum: [],
    text: "下单后，请留意快递送达时间。如有售后问题，请于快递包裹签收当天24点前联系客服处理。",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size:14,
    interval: 20
  },
  goodInfo: {},
  Cates:[],
  // 页面加载会触发
  onLoad:function(options){
    this.setData({
      currentTab: parseInt(options.status)
    })
    orderStatus = options.status;
    if (options.status == '0') {
      orderStatus = -1;
    }
    this.getMyOrderList();
    this.getCates();

    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  //顶部tab切换
  navbarTap: function(e) {
    this.clearPage()
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })

    //1"全部订单";2, "待发货"；3"待收货"待评价
    orderStatus = index;
    if (index == 0) {
      orderStatus = -1;
    }
    this.getMyOrderList();
  },

  onShow: function() {
    this.getMyOrderList();
  },

  onPullDownRefresh() {
    this.clearPage()
    this.getMyOrderList()
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth){
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
        that.setData({
          marqueeDistance: crentleft + that.data.marqueePace
        })
      }
      else {
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
      }
     }, that.data.interval);
    }
    else{
      that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
  },


  getMyOrderList() {
    let that = this;
    // let openid = app._checkOpenid();
    const openid = wx.getStorageSync("openid");
    //let openid = 11;
    if (!openid) {
      return;
    }
    //请求自己后台获取用户openid
    var orderUrl;
    if (orderStatus == -1) {
      orderUrl = app.globalData.baseUrl + '/order/listByStatus?openid='+openid;
    } else {
      orderUrl = app.globalData.baseUrl + '/order/listByStatus?openid='+openid+'&orderStatus='+orderStatus;
    }
    wx.request({
      url: orderUrl,
      success: function(res) {
        try {
          var dataList = res.data
          for (var i = 0; i < dataList.length; ++i) {
            dataList[i].total_quantity = 0
            var itemCount = 0
            let order = dataList[i].orderDetailList
            for (var orderItem of order) {
              itemCount += orderItem.good_quantity
            }
            dataList[i].total_quantity += itemCount
          }
          that.setData({
            list: dataList.reverse()
          })
        } catch {
          that.setData({
            list: []
          })
        }
      }
    })
  },

  enterOrderDetail(event) {
    wx.navigateTo({
      url: '../order_detail/order_detail?order_id='+event.currentTarget.dataset.order,
    })
    
  },
  enterComment(event){
    wx.navigateTo({
      url: '../comment/comment?orderId='+event.currentTarget.dataset.order,
    })
  },

  // navigato to good_Detail
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },

  // 确认订单
  confirmOrder(event){
    wx.showModal({
      title: '确认',
      content: '是否确认收货',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/order/confirm',
            method: "POST",
            header:{
             "Content-Type": "application/x-www-form-urlencoded"
            },
            data:{
              openid: "" + wx.getStorageSync("openid"),
              orderId: event.currentTarget.dataset.order
            },
            success: function(res){
              console.log("订单完成", res.data);
              // 显示取消成功
              wx.showToast({
                title: '订单完成',
                icon: 'success',
                duration: 1000
              })
              // 回到全部订单页面
              wx.navigateTo({
                url: '../order/order?status=0',
              })
            }
          })  
        }
      }
    })
  },

  // 取消订单
  cancelOrder(event){
    wx.showModal({
      title: '提示',
      content: '是否要取消订单',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/order/cancel',
            method: "POST",
            header:{
             "Content-Type": "application/x-www-form-urlencoded"
            },
            data:{
              openid: "" + wx.getStorageSync("openid"),
              orderId: event.currentTarget.dataset.order
            },
            success: function(res){
              console.log("订单删除成功", res.data);
              // 显示取消成功
              wx.showToast({
                title: '订单取消成功',
                icon: 'success',
                duration: 1000
              })
              // 回到全部订单页面
              wx.navigateTo({
                url: '../order/order?status=0',
              })
            }
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

  clearPage() {
    this.setData({
      list: []
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
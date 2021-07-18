import {request} from "../../request/index.js";
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
            list: dataList
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
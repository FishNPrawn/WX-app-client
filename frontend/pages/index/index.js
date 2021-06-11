import {request} from "../../request/index.js";
//page object 
Page({
  data: {
    goods_list:[],
    //轮播图数组
    swiperList:[],
    //首页分类导航数组
    catesList:[],
    catIndex: 0
  },
  goodInfo: {},
  Cates:[],
  // 页面加载会触发
  onLoad:function(options){
    //发送异步请求获取轮播图数据
    this.getSwiperList();
    this.getCates();

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
      
    })
  },
    //获取轮播图数据
    getSwiperList(){
      request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"})
      .then(result=>{
        this.setData({
          swiperList: result.data.message
        })
      })
    },

    getCates(){
      request({
        url:"https://www.fishnprawn.cn/fishnprawn/good/getAllgood"
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
        this.setData ({
          catIndex: parseInt(event.currentTarget.id)
        });
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
});
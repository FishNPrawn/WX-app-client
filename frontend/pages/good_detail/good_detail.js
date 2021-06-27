import{request} from"../../request/index.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';   //Not used for now, need to fix in the future
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodObj:{},
    isCollect: false,
    list: [],
    goods_list:[],
  },
  goodInfo: {},
  Cates:[],

  onLoad: function(options){
    this.getCates()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { good_id } = options;
    this.getGoodDetail(good_id);
  },
    /**
   * 获取商品数据
   */
  async getGoodDetail(good_id) {
    let res = await request({url: app.globalData.baseUrl + '/good/getbyid/'+good_id});
    const goodObj = res.data;
    this.goodInfo = goodObj;
    let collect = wx.getStorageSync("collect") || [];
    let isCollect = collect.some(v => v.good_id === this.goodInfo.good_id);
    
    this.setData({
      goodObj,
      isCollect
    })
  },
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.good_id === this.goodInfo.good_id);
    if (index === -1) {
      this.goodInfo.num = 1;
      this.goodInfo.checked = true;
      cart.push(this.goodInfo);
    } else {
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  handleCollect(){
    let isCollect=false;
    let collect=wx.getStorageSync("collect")||[];
    let index=collect.findIndex(v=>v.good_id===this.goodInfo.good_id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
        
    }else{
      collect.push(this.goodInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
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

})
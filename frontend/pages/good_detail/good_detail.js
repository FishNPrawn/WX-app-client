import{request} from"../../request/index.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';   //Not used for now, need to fix in the future
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodObj:{},
    isCollect: false
  },
  goodInfo: {},
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
  }
})
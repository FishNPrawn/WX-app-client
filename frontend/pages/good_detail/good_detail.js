import{request} from"../../request/index.js";
import util from "../../utils/util.js";
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
    comments: [],
    show: false,
    // popup window
    duration: 300,
    position: 'bottom',
    round: true,
    customStyle: '',
    overlayStyle: '',
    //轮播图数组
    swiperList:[]
  },
  goodInfo: {},
  Cates:[],

  onLoad: function(options){
    this.getCates()
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  
   // popup window
  popup(e) {
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    let duration = this.data.duration
    if(position == 'bottom'){
      customStyle = 'height: 40%;background-color: #f5f5f5;'
    }
    this.setData({
      position,
      show: true,
      customStyle,
      duration
    })
  },
  exit() {
    this.setData({show: false})
    // wx.navigateBack()
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
    this.getComments(good_id);
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
    let swiperList = [];
    swiperList.push(goodObj.good_image);
    swiperList.push(goodObj.good_image_1);
    swiperList.push(goodObj.good_image_description);
    this.setData({
      goodObj,
      isCollect,
      swiperList
    })
  },
  handleCartAddDetail() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.good_id === this.goodInfo.good_id);
    // if (index === -1) {
    //   this.goodInfo.num = 1;
    //   this.goodInfo.checked = true;
    //   cart.push(this.goodInfo);
    // } else {
    // }
    // wx.setStorageSync("cart", cart);
    // wx.showToast({
    //   title: '加入成功',
    //   icon: 'success',
    //   duration: 600,
    //   mask: true
    // });
    if (index === -1) {
      if (!this.goodInfo.num) {
        this.goodInfo.num = 1;
      } else {
        this.goodInfo.num += 1;
      }
      this.goodInfo.checked = true;
      cart.push(this.goodInfo);
    } else {
      var savedInfo = cart[index];
      if (!savedInfo.num) {
        savedInfo.num = 1;
      } else {
        savedInfo.num += 1;
      }
      cart[index] = savedInfo;
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 600,
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

  enterCommentList() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { good_id } = options;
    // console.log(good_id)
    wx.navigateTo({
      url: '../comment_list/comment_list?good_id='+good_id,
    })
  },

  getComments(good_id){
    request({
      url: app.globalData.baseUrl + '/comment/comment_filter?filter='+good_id
    })
    .then(res=>{
      var comments = []
      for(var i = 0; i < res.data.data.length; i++){
        res.data.data[i].username = res.data.data[i].username.substring(0,1)
        comments.push(res.data.data[i])
      }
      this.setData({
        comments: comments
      })
    })
  },

  // navigato to 商品详情
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.redirectTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },

  // 主页面add button
  handleCartAdd(event) {
    util.handleCartAdd(event)
  },

})
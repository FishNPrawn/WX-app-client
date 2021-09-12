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
    comments: [],
    show: false,
  },
  goodInfo: {},
  Cates:[],

  onLoad: function(options){
    
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
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
    
    this.setData({
      goodObj,
      isCollect
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

})
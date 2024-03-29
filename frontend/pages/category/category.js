import{request} from"../../request/index.js";
let app = getApp();
const util = require('../../utils/util.js');
let timeout = 400;
Page({
  data: {
    //被点击的左侧菜单
    //left menu
    leftMenuList:[],
    // right goods data
    rightContent:[],
    currentIndex:0,
    goodObj:{},
    isCollect: false
  },
  goodInfo: {},
  //接口返回数据
  Cates:[],

  onLoad: function (options) {
    // this.getCates()
  },
  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onShow: function (options) {
    // 底部导航栏购物车数量
    let cart = wx.getStorageSync('cart') || [];
    util.setTabBarBadgeNumber(cart);
    this.getCates()
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


  // 获取分类数据
  getCates(){
    let that = this
    request({
      url: app.globalData.baseUrl + '/good/getGoodByCatetory'
    })
    .then(res=>{
      that.Cates=res.data.data
      //构造左侧菜单数据
      let leftMenuList = Object.keys(that.Cates)
      // let leftMenuList = wx.getStorageSync('leftMenuList')
      //构造右侧数据
      var currentIndex = 0;
      var showDialog = getApp().globalData.showDialog;
      if (that.__data__ != null) {
        currentIndex = that.__data__.currentIndex;
      }
      if (showDialog && showDialog.catName) {
        currentIndex = leftMenuList.indexOf(showDialog.catName)
      }
      let rightContent=that.Cates[leftMenuList[currentIndex]];
      that.setData({
        currentIndex,
        rightContent,
        leftMenuList
      })
    })
  },
  //左侧菜单的点击事件
  handleItemTap: function(e){
      /*
      1.获取被点击的标题身上的索引
      2. 给data中的currentIndex赋值
      */
     const {index}=e.currentTarget.dataset;
     let rightContent=this.Cates[this.data.leftMenuList[index]];
     this.setData({
      currentIndex:index,
      rightContent
    })
  },

  handleCartAdd(event) {
    util.handleCartAdd(event);
  },

  // navigato to good_Detail
  goGoodDetail(event){
    var good_id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + good_id
    });
  },

})
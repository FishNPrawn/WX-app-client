import{request} from"../../request/index.js";
let app = getApp();
Page({
  data: {
    //left menu
    leftMenuList:[],
    // right goods data
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    goodObj:{},
    isCollect: false
  },
  goodInfo: {},
  //接口返回数据
  Cates:[],

  onshow: function () {
    var showDialog = getApp().globalData.showDialog;
    if (showDialog != null) {
      this.setData({
        currentIndex: showDialog.__data__.catIndex
      })
    }
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
  onLoad: function (options) {
    this.getCates();
  },
  // 获取分类数据
  getCates(){
    request({
      url: app.globalData.baseUrl + '/good/getAllgood',
    })
    .then(res=>{
      this.Cates=res.data.data
      //构造左侧菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name)
      //构造右侧数据
      var currentIndex = 0;
      if (this.__data__ != null) {
        currentIndex = this.__data__.currentIndex;
      }
      let rightContent=this.Cates[currentIndex].array;
      this.setData({
        leftMenuList, 
        rightContent
      })
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
      /*
      1.获取被点击的标题身上的索引
      2. 给data中的currentIndex赋值
      */
     const {index}=e.currentTarget.dataset;
     let rightContent=this.Cates[index].array;
     this.setData({
      currentIndex:index,
      rightContent
    })
  },

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
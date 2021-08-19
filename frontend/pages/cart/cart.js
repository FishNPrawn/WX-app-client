import { getSetting, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
const util = require('../../utils/util.js');
//page object 
let app = getApp();
Page({
  data: {
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    // 设置开始的位置
    startX: 0,
    startY: 0,
    text: "下单后，请留意快递送达时间。如有售后问题，请于快递包裹签收当天24点前联系客服处理。",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size:14,
    interval: 20,
    windowWidth: null
  },
  onShow() {
    let cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);// 底部导航栏购物车数量
    util.setTabBarBadgeNumber(cart);
    // 底部导航栏购物车数量
    util.setTabBarBadgeNumber(cart);

    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
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
      that.setData({ marquee_margin:"1500"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
  },

  // 清空购物车
  async clearCart(){
    const res = await showModal({ content: "您是否要清空购物车？" });
    if (res.confirm) {
      wx.showLoading({title: '加载中', icon: 'loading', duration:100, mask: true});
      let cart = [];
      // 底部导航栏购物车数量
      util.setTabBarBadgeNumber(cart);
      wx.setStorageSync('cart', cart)

      let allChecked = true;
      // 总价格 总数量
      let totalPrice = 0;
      let totalNum = 0;
      cart.forEach(v => {
        if (v.checked) {
          totalPrice += v.num * v.good_price;
          totalNum += v.num;
        } else {
          allChecked = false;
        }
      })
      // 判断数组是否为空
      allChecked = cart.length != 0 ? allChecked : false;

      this.setData({
        cart,
        totalPrice, totalNum, allChecked
      });
    }
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  // 商品的选中
  handeItemChange(e) {
    const good_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.good_id === good_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 授权登录
  handleGetUserInfo(e){
    wx.setStorageSync('userInfo', e.detail.userInfo);
    if (wx.getStorageSync('userInfo')) {
      this.handlePay();
    }
  },

  getUserProfile(e) {
    if (wx.getStorageSync('userInfo')) {
      this.handlePay();
    }else{
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.setStorageSync('userInfo', res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.handlePay();
        }
      })
    }
  },

  // 获取手机号码(后期如果需要)
  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.good_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    totalPrice = totalPrice.toFixed(2);
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  
  // 商品全选功能
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  async handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.good_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
    // 底部导航栏购物车数量
    util.setTabBarBadgeNumber(cart);
  },

  async handlePay(){
    const {totalNum}=this.data;
    if(totalNum===0){
     await showToast({title:"您还没有选购商品"});
     return ;
   }

   wx.checkSession({
    success () {
      //session_key 未过期，并且在本生命周期一直有效
    },
    fail () {
      // session_key 已经失效，需要重新执行登录流程
      console.error('session_key 已经失效，需要重新执行登录流程, 重新登录中')
      util.toLogin()
    }
  })

    wx.getSetting({
     success(res) {
       if (res.authSetting['scope.userInfo']) {
         wx.getUserInfo({
           success: async function(res) {
             wx.navigateTo({
               url: '/pages/pay/pay'
             });
           },
           fail(res) {
             console.error("获取用户信息失败", res)
           }
         })
       } else {
         console.error("未授权")
         that.showSettingToast("请授权")
       }
     }
   })
  },

  showSettingToast: function(e) {
   wx.showModal({
     title: '提示！',
     confirmText: '去设置',
     showCancel: false,
     content: e,
     success: function(res) {
       if (res.confirm) {
         wx.navigateTo({
           url: '/pages/cart/cart',
         })
       }
     }
   })
 },

 goCategory(){
   wx.switchTab({
     url: '/pages/category/category',
   })
 },

 goToGoodDetail(event){
  var good_id = event.currentTarget.id
  wx.navigateTo({
    url: '/pages/good_detail/good_detail?good_id=' + good_id
  });
 },

  //---------------------------购物车商品右滑删除 start ---------------------------------------------------
  // 开始滑动
  touchStart(e) {
    let cart = [...this.data.cart]
    cart.forEach(item => {
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    this.setData({
      cart: cart,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  touchMove(e) {
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let cart = [...this.data.cart]

    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    cart.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 30) {
        return
      }

      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    })
    this.setData({
      cart
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除
  async delItem(e) {
    const res = await showModal({ content: "您是否要删除？" });
    if (res.confirm) {
      wx.showLoading({title: '加载中', icon: 'loading', duration:500, mask: true});
      let id = e.currentTarget.dataset.id;
      let cart = [...this.data.cart];
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        item.isTouchMove = false;
        if (item.good_id === id) {
          cart.splice(i, 1);
          break;
        }
      }
      // 底部导航栏购物车数量
      util.setTabBarBadgeNumber(cart);
      
      let allChecked = true;
      // 总价格 总数量
      let totalPrice = 0;
      let totalNum = 0;
      cart.forEach(v => {
        if (v.checked) {
          totalPrice += v.num * v.good_price;
          totalNum += v.num;
        } else {
          allChecked = false;
        }
      })
      // 判断数组是否为空
      allChecked = cart.length != 0 ? allChecked : false;
      wx.setStorageSync('cart', cart)
      this.setData({
        cart,
        totalPrice, totalNum, allChecked
      });
    }
  }

  //---------------------------购物车商品右滑删除 end ---------------------------------------------------
})
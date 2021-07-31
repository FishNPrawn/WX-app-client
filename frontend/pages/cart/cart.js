import { getSetting, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
const util = require('../../utils/util.js');

Page({
  data: {
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);
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
 }

})
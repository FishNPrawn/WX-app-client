import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import {request} from "../../request/index.js";
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    originTotalPrice: 0,
    totalPriceWithExpressFee: 0,
    totalNum: 0,
    total_good_weight_value: 0,
    show: false,
    duration: 300,
    position: 'bottom',
    round: true,
    customStyle: '',
    overlayStyle: '',
    userInfo:{},
    commentInput: null,
    promoCodeInput: null,
    promoCodeInputApplyOrNot: false,
    promoCodeHeaderId: 0,
    express_fee: 0,
    origin_express_fee: 0,
    discount: 0,
    deliver_or_not: true,
    input_border_color: '#edeeee',
    text: "下单后，请留意快递送达时间。如有售后问题，请于快递包裹签收当天24点前联系客服处理。",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size:14,
    interval: 20
  },
  // 点击优惠码框框变色
  input_border: function (e) {  
      //点击按钮，样式改变  
      let that = this;  
      that.setData({  
        input_border_color: '#ffd6b5'  
      });  
  },
  input_border_unclick_color:function(){
    this.setData({
      input_border_color: '#edeeee'  
    });
  },
  onLoad() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v=>v.checked);

    this.setData({ 
      address
    });

      //  计算 全选 总价格 购买的数量
    let totalPrice = 0;
    let totalNum = 0;
    let total_good_weight_value = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.good_price;
        totalNum += v.num;
        total_good_weight_value += v.good_weight*v.num;
    })
    totalPrice = parseFloat(totalPrice.toFixed(2));

    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
    
    // 运费根据重量和总价格-满减之后的运费
    request({
      url: app.globalData.baseUrl + '/calculate/express_fee_with_weight_and_total_price?weight=' + total_good_weight_value + '&order_total_price=' + totalPrice,
    })
    .then(res=>{
      this.setData({
        express_fee: parseFloat(res.data)
      })

      ////////////////////////////////////////
      // 运费根据重量
      request({
        url: app.globalData.baseUrl + '/calculate/express_fee_with_weight?weight=' + total_good_weight_value,
      })
      .then(res=>{
        this.setData({
          discount: parseFloat(res.data) - parseFloat(this.data.express_fee),
          totalPriceWithExpressFee: parseFloat(totalPrice) + parseFloat(this.data.express_fee),
          origin_express_fee: parseFloat(res.data)
        })
      })

      this.setData({
        cart,
        totalPrice,
        totalNum,
        total_good_weight_value,
        address,
        originTotalPrice: totalPrice,
        promoCodeInputApplyOrNot: false
      })
    })

  },

  onShow(){
    var that = this;
    const address = wx.getStorageSync("address");
    this.setData({
      address
    })
    that.check_deliver_or_not(address.all)
  },

  check_deliver_or_not(address){
    var province = address.substring(0,3);
    console.log("province:", province);
    request({
      url: app.globalData.baseUrl + '/calculate/check_deliver_or_not?province=' + province,
    })
    .then(res=>{
      if(res.data == false){
        this.setData({
          deliver_or_not: false
        })
      }else{
        this.setData({
          deliver_or_not: true
        })
      }
    })
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
      that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
  },
  

  commentInput:function(e){
      this.data.commentInput = e.detail.value;
  }, 

  promoCodeInput:function(e){
    this.data.promoCodeInput = e.detail.value;
  },

  goToCustomerService(){
    wx.navigateTo({
      url: "/pages/contactUs/contactUs"
    })
  },

  submitPromoCode:function(e){
    var addressStorage = wx.getStorageSync('address')
    if(!addressStorage){
    showToast({title:"请选择收货地址"});
    }else{
      // 获取promo code
      request({
        url: app.globalData.baseUrl + '/promo_code/checkPromoCode?promocode=' + this.data.promoCodeInput
      })
      .then(res=>{
        if(res.data.success == true && this.data.promoCodeInputApplyOrNot == false){
          wx.showToast({
            title: '获得'+res.data.discount_rate+'折扣',
            icon: 'success',
            duration: 500,
            mask: true
          });
          var promoCodeHeaderIdValue = res.data.promoCodeHeaderId;
          var discountValue = parseFloat(this.data.discount) + parseFloat(this.data.totalPrice) - parseFloat(this.data.totalPrice) * parseFloat(res.data.discount_rate);
          var totalPriceValue = parseFloat(this.data.totalPrice) * parseFloat(res.data.discount_rate);
          var totalPriceWithExpressFeeValue = totalPriceValue + this.data.express_fee;
          totalPriceValue = totalPriceValue.toFixed(2)
          totalPriceWithExpressFeeValue = totalPriceWithExpressFeeValue.toFixed(2)
          discountValue = discountValue.toFixed(2)
          
          this.setData({  
            promoCodeInputApplyOrNot: true,
            discount: discountValue,
            totalPrice: totalPriceValue,
            totalPriceWithExpressFee: totalPriceWithExpressFeeValue,
            promoCodeHeaderId: promoCodeHeaderIdValue
          }); 
          
        }else if(res.data.success == false){
          showToast({title:"请输入正确的团长码"});
        }else if(res.data.success == true && this.data.promoCodeInputApplyOrNot == true){
          showToast({title:"您已输入提交团长码折扣"});
        }  
      })
    }

    
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  
  popup(e) {
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    let duration = this.data.duration
    if(position == 'bottom'){
      customStyle = 'height: 60%;background-color: #f5f5f5;'
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
  
  // 选择收货地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);

    } 
    catch (error) {
      console.log(error);   //Needed for error catching, but may need to change to third party logger in the future
    }
  },

   async handlePay(){
    const {totalNum}=this.data;
     if(totalNum===0){
       await showToast({title:"您还没有选购商品"});
       return ;
     }

     //尚未设置支付权限，所以不生效跳转微信支付页面
     //wx.navigateTo({
       //url: '/pages/pay/pay'
     //});
   },

   //提交订单
   submitOrder: function(e){
    wx.showLoading({title: '加载中', icon: 'loading', mask: true, duration:2000})
     var addressStorage = wx.getStorageSync('address')
     var deliver_or_not = this.data.deliver_or_not;
     if(!addressStorage){
      showToast({title:"请选择收货地址"});
     }else if(deliver_or_not == false){
      showToast({title:"目前小程序仅开通广东地区,其余地区请联系客服微信,确认是否可以配送到达."});
     } else{
      var userAddress = wx.getStorageSync('address')
      
      var openid = app.globalData.openid;

      let cart = wx.getStorageSync("cart") || [];
      cart = cart.filter(v=>v.checked);

      if(this.data.commentInput == null){
        this.data.commentInput = '没有备注';
      }

      const {commentInput}=this.data;

      // 计算总价格
      var totalPrice = this.data.totalPrice;
      console.log("totalPrice:",totalPrice)

      // 订单重量
      var total_good_weight_value = this.data.total_good_weight_value;

      // 订单编号
      var orderNumber = util.order_number();
      console.log(orderNumber)
      
      let goods_arr = [];
      cart.forEach(order => {
        var goods = new Object();
        goods.order_number = orderNumber;
        goods.good_id = order.good_id;
        goods.good_name = order.good_name;
        goods.good_price = order.good_price;
        goods.good_quantity = order.num;
        goods.good_image = order.good_image;
        goods_arr.push(goods)
      })

      // 把商品列表形成json
      var goods_json = JSON.stringify(goods_arr);

      var order_basic_info_value = new Object();
      order_basic_info_value.totalPrice = this.data.totalPriceWithExpressFee;
      order_basic_info_value.discount = this.data.discount;
      order_basic_info_value.shipmentFee = this.data.express_fee;
      var order_basic_info = [];
      order_basic_info.push(order_basic_info_value);

      var express_fee_value = this.data.express_fee;
      var totalPriceWithExpressFee_value = this.data.totalPriceWithExpressFee;
      var promoCodeHeaderIdValue = this.data.promoCodeHeaderId;
      var orderdiscountValue = this.data.discount;


      wx.cloud.callFunction({
        name: 'cloudpay',
        data:{
          orderNumber: orderNumber,
          totalPrice: totalPriceWithExpressFee_value
        },
        success: res => {
          const payment = res.result.payment 
          wx.requestPayment({
            ...payment,
            success (res) {
              // 支付成功 & 创建订单request
              wx.request({
                url: app.globalData.baseUrl + '/order/create',
                method: "POST",
                header:{
                "Content-Type": "application/x-www-form-urlencoded"
                },
                data:{
                  openId: openid,
                  order_number: orderNumber,
                  access_token: "无",
                  user_name: userAddress.userName,
                  user_address: userAddress.all,
                  user_phone: userAddress.telNumber,
                  order_total_price: totalPrice,
                  order_comment: commentInput,
                  orderStatus: 1,
                  order_total_weight: total_good_weight_value,
                  order_express_fee: express_fee_value,
                  order_total_price_with_express_fee: totalPriceWithExpressFee_value,
                  promoCodeHeaderId: promoCodeHeaderIdValue,
                  order_total_discount: orderdiscountValue,
                  items: goods_json
                },
                success: function(res){
                  console.log("创建订单成功", res.data);
                  wx.setStorageSync('cart', null);
                  wx.setStorageSync('order_basic_info', order_basic_info);
                  wx.navigateTo({
                    url: '/pages/paysuccess/paysuccess',
                  })
                }
              })
              console.log('pay success', res)
            },
            fail (err) {
              console.error('pay fail', err)
            }
          })
        },
        fail: console.error,
      })
    }

    
   }
})
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import {request} from "../../request/index.js";
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
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
    express_fee: 0,
    discount: 0,
    input_border_color: '#edeeee', 
  },
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
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v=>v.checked);
    this.setData({ address });

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
    
    // 运费根据重量和总价格-满减之后的运费
    request({
      url: app.globalData.baseUrl + '/calculate/express_fee_with_weight_and_total_price?weight=' + total_good_weight_value + '&order_total_price=' + totalPrice,
    })
    .then(res=>{
      this.setData({
        express_fee: parseFloat(res.data)
      })
    })

    // 运费根据重量
    request({
      url: app.globalData.baseUrl + '/calculate/express_fee_with_weight?weight=' + total_good_weight_value,
    })
    .then(res=>{
      this.setData({
        discount: parseFloat(res.data) - parseFloat(this.data.express_fee),
        totalPriceWithExpressFee: parseFloat(totalPrice) + parseFloat(this.data.express_fee)
      })
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      total_good_weight_value,
      address
    })
  },
  

  commentInput:function(e){
      this.data.commentInput = e.detail.value;
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
     var addressStorage = wx.getStorageSync('address')
     if(!addressStorage){
      showToast({title:"请选择收货地址"});
     }else{
      // 去到user的东西
      const userInfo = wx.getStorageSync("userInfo");
      const userAddress = wx.getStorageSync('address')
      const openid = wx.getStorageSync("openid");
      let cart = wx.getStorageSync("cart") || [];
      cart = cart.filter(v=>v.checked);

      if(this.data.commentInput == null){
        this.data.commentInput = '没有备注';
      }

      const {commentInput}=this.data;

      //  计算总价格
      let totalPrice = 0;
      let total_good_weight_value = 0
      cart.forEach(v => {
          totalPrice += v.num * v.good_price;
          total_good_weight_value = total_good_weight_value + v.good_weight;
      })
      totalPrice = totalPrice.toFixed(2);

      // 订单编号
      const orderNumber = util.order_number();

      // 储存购物车信息
      let goods_arr = [];
      cart.forEach(order => {
        // console.log(order);
        var goods = new Object();
        goods.order_number = orderNumber;
        goods.good_id = order.good_id;
        goods.good_name = order.good_name;
        goods.good_price = order.good_price;
        goods.good_quantity = order.num;
        goods.good_image = order.good_image;
        goods_arr.push(goods)
      })
      let goods_json = JSON.stringify(goods_arr);
      // console.log(goods_json);

      var order_basic_info_value = new Object();
      order_basic_info_value.totalPrice = this.data.totalPriceWithExpressFee;
      order_basic_info_value.discount = this.data.discount;
      order_basic_info_value.shipmentFee = this.data.express_fee;
      let order_basic_info = [];
      order_basic_info.push(order_basic_info_value);

      var express_fee_value = this.data.express_fee;
      var totalPriceWithExpressFee_value = this.data.totalPriceWithExpressFee;
      wx.cloud.callFunction({
        name: 'cloudpay',
        data:{
          orderNumber: orderNumber,
          totalPrice: totalPrice
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
                  access_token: "1654168416563354",
                  user_name: userAddress.userName,
                  user_address: userAddress.all,
                  user_phone: userAddress.telNumber,
                  order_total_price: totalPrice,
                  order_comment: commentInput,
                  orderStatus: 1,
                  order_total_weight: total_good_weight_value,
                  order_express_fee: express_fee_value,
                  order_total_price_with_express_fee: totalPriceWithExpressFee_value,
                  promo_code_header_id: 1,
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
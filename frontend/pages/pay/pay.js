import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";

const app = getApp();

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    show: false,
    duration: 300,
    position: 'bottom',
    round: true,
    customStyle: '',
    overlayStyle: '',
    userInfo:{}
  },
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v=>v.checked);
    this.setData({ address });

      //  计算 全选 总价格 购买的数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.good_price;
        totalNum += v.num;
    })

    this.setData({
      cart,
      totalPrice,totalNum,
      address
    })
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
     // 去到user的东西
    const userInfo = wx.getStorageSync("userInfo");
    const userAddress = wx.getStorageSync('address')
    let cart = wx.getStorageSync("cart") || [];
    let cart_list = wx.getStorageSync("cart") || [];
    cart = cart.filter(v=>v.checked);

    //  计算总价格
    let totalPrice = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.good_price;
    })

    // 储存购物车信息
    let goods_arr = [];
    cart_list.forEach(order => {
      // console.log(order);
      var goods = new Object();
      goods.order_number = "191919";
      goods.good_id = order.good_id;
      goods.good_name = order.good_name;
      goods.good_price = order.good_price;
      goods.good_quantity = order.num;
      goods.good_image = order.good_image;
      goods_arr.push(goods)
    })
    let goods_json = JSON.stringify(goods_arr);
    // console.log(goods_json);

    // 创建订单request
     wx.request({
       url: 'https://fishnprawn.cn/order/create',
       method: "POST",
       header:{
        "Content-Type": "application/x-www-form-urlencoded"
       },
       
       data:{
        openId: 19,
        order_number: "191919",
        access_token: "1654168416563354",
        user_name: userAddress.userName,
        user_address: userAddress.all,
        user_phone: userAddress.telNumber,
        order_total_price: totalPrice,
        order_comment: "这是是good json测试",
        orderStatus: 1,
        items: goods_json
       },
       success: function(res){
         console.log("支付成功", res.data);
       }
     })
   }
})
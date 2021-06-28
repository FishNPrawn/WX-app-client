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

   submitOrder: function(e){
     // 去到user的东西
    const userInfo = wx.getStorageSync("userInfo");
    const userAddress = wx.getStorageSync('address')
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v=>v.checked);
    //  计算总价格
    let totalPrice = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.good_price;
    })
    
    let goods_json = JSON.stringify(
    [
        {"order_number":"171717","good_id":2, "good_name": "鸡肉", "good_price":416,"good_quantity":10, "good_image": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fsh%2Fj8%2FQJ8129672480.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622620505&t=e3bbaf5dfa465b8bc6f5bac3f836904e"},
        {"order_number":"171717","good_id":3, "good_name": "羊肉", "good_price":120,"good_quantity":30, "good_image": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fsh%2Fj8%2FQJ8129672480.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622620505&t=e3bbaf5dfa465b8bc6f5bac3f836904e"},
        {"order_number":"171717","good_id":5, "good_name": "猪肉", "good_price":120,"good_quantity":30, "good_image": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fsh%2Fj8%2FQJ8129672480.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622620505&t=e3bbaf5dfa465b8bc6f5bac3f836904e"}
    ]);
     wx.request({
       url: 'https://fishnprawn.cn/order/create',
       method: "POST",
       header:{
        "Content-Type": "application/x-www-form-urlencoded"
       },
      //  暂时是假数据（测试）
       data:{
        openId: 17,
        order_number: "171717",
        access_token: "156168416516515",
        user_name: userAddress.userName,
        user_address: userAddress.all,
        user_phone: userAddress.telNumber,
        order_total_price: totalPrice,
        order_comment: "请打包好，不要过去16",
        orderStatus: 1,
        items: goods_json
       },
       success: function(res){
         console.log("支付成功", res.data);
       }
     })
   }
})
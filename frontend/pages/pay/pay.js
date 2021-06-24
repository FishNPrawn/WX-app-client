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
    overlayStyle: ''
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
    let goods_json = JSON.stringify(
    [
        {"order_number":"1996","good_id":3, "good_name": "shrimp", "good_price":1000000,"good_quantity":6, "good_image": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fsh%2Fj8%2FQJ8129672480.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622620505&t=e3bbaf5dfa465b8bc6f5bac3f836904e"},
        {"order_number":"19961996199619961996199619961996","good_id":6, "good_name": "crabcrab", "good_price":123214141,"good_quantity":7, "good_image": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fsh%2Fj8%2FQJ8129672480.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622620505&t=e3bbaf5dfa465b8bc6f5bac3f836904e"}
    ]);
     wx.request({
       url: 'http://localhost:8080/order/create',
       method: "POST",
       header:{
        "Content-Type": "application/x-www-form-urlencoded"
       },
      //  暂时是假数据（测试）
       data:{
        open_id: 4,
        order_number: "156310351561",
        access_token: "5156165165165",
        user_name: "远",
        user_address: "汕头",
        user_phone: "1561566516516163",
        order_total_price: 16516516,
        order_comment: "氛围我爱疯舞您付款了奶粉了万福乐蛙发你了玩法了",
        order_status: 0,
        items: goods_json
       },
       success: function(res){
         console.log("支付成功", res.data);
       }
     })
   }
})
const handleCartAdd = (event) => {
  let cart = wx.getStorageSync("cart") || [];
  let goodInfo=event.currentTarget.dataset.variable;
  let index = cart.findIndex(v => v.good_id === goodInfo.good_id);
  if (index === -1) {
    if (!goodInfo.num) {
      goodInfo.num = 1;
    } else {
      goodInfo.num += 1;
    }
    goodInfo.checked = true;
    cart.push(goodInfo);
  } else {
    var savedInfo = cart[index];
    if (!savedInfo.num) {
      savedInfo.num = 1;
    } else {
      savedInfo.num += 1;
    }
    cart[index] = savedInfo;
  }
  wx.setStorageSync("cart", cart);
  wx.showToast({
    title: '加入成功',
    icon: 'success',
    duration: 600,
    mask: true
  });
  // 底部导航栏购物车数量
  util.setTabBarBadgeNumber(cart);
}

// 格式现在时间 - yyyy/mm/dd hour:minute:second
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const order_number = () => {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();
  if (month < 10) {
      month = '0' + month;
  }
  var date = year + '' + month + '' + day;
  var time = hour + '' + minute + ''+ second;
  var randomNumber = Math.floor(1000 + Math.random() * 9000);
  var orderNumber = date + '' + time + '' + randomNumber;
  return orderNumber;
}

// 满减之后的运费
const calculate_express_fee = (weight, order_total_price) =>{
  var express_fee = 18;
    if(weight>0 && weight<=1000){
        express_fee = 18;
    }else if(weight > 1000 && weight <= 2000){
        express_fee = 18;
    }else if(weight > 2000 && weight <= 3000){
        express_fee = 21;
    }else if(weight > 3000 && weight <= 4000){
        express_fee = 24;
    }else if(weight > 4000 && weight <= 5000){
        express_fee = 27;
    }else if(weight > 5000 && weight <= 6000){
        express_fee = 30;
    }else if(weight > 6000 && weight <= 7000){
        express_fee = 33;
    }else if(weight > 7000 && weight <= 8000){
        express_fee = 36;
    }else if(weight > 8000 && weight <= 9000){
        express_fee = 39;
    }else if(weight > 9000 && weight <= 10000){
        express_fee = 42;
    }else{
        express_fee = 45;
    }
    if(order_total_price>=88 && order_total_price<188){
        express_fee = express_fee - 5;
    }else if(order_total_price>=188 && order_total_price<268){
        express_fee = express_fee - 12;
    }else if(order_total_price>=268){
        express_fee = 0;
    }
    return express_fee;
}
// 原始运费
const original_express_fee = (weight) =>{
  var express_fee = 18;
    if(weight>0 && weight<=1000){
        express_fee = 18;
    }else if(weight > 1000 && weight <= 2000){
        express_fee = 18;
    }else if(weight > 2000 && weight <= 3000){
        express_fee = 21;
    }else if(weight > 3000 && weight <= 4000){
        express_fee = 24;
    }else if(weight > 4000 && weight <= 5000){
        express_fee = 27;
    }else if(weight > 5000 && weight <= 6000){
        express_fee = 30;
    }else if(weight > 6000 && weight <= 7000){
        express_fee = 33;
    }else if(weight > 7000 && weight <= 8000){
        express_fee = 36;
    }else if(weight > 8000 && weight <= 9000){
        express_fee = 39;
    }else if(weight > 9000 && weight <= 10000){
        express_fee = 42;
    }else{
        express_fee = 45;
    }
    return express_fee;
}

// 底部导航栏购物车数量
const setTabBarBadgeNumber = (cart) =>{
  let totalNum = 0;
  cart.forEach(v => {
      totalNum += v.num;
  })
  if(totalNum == 0){
    wx.removeTabBarBadge({
      index: 2
    })
  }else{
    totalNum = totalNum + '';
    wx.setTabBarBadge({
      index: 2,
      text: totalNum
    })
  }
}



const loginDataKey = 'loginData'

const toLogin = () => {
  wx.showLoading({title: '登录中', icon: 'loading', mask: true})
  wx.login({
    success(res){
      let success = () => {
        let loginResponse = {"openid":"TODO: get open id"}
        wx.setStorageSync(loginDataKey, loginResponse)
        wx.hideLoading()
      }
      let fail = () => {
        wx.hideLoading()
        wx.showToast({
          title: '登录失败，请重新打开小程序试试',
          icon: 'none',
          duration: 1e8
        })
      }
      // TODO 发起网络请求
      // 延时模拟请求登录成功
      setTimeout(success, 500)
    },
    fail(err){
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        title: '登录失败，请重新打开小程序试试',
        icon: 'none',
        duration: 1e8
      })
    }
  })
}

module.exports = {
  formatTime, toLogin, order_number, handleCartAdd, calculate_express_fee, original_express_fee, setTabBarBadgeNumber
}

// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "欢喜食货",
    "outTradeNo" : event.orderNumber,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1612088049",
    "totalFee" : 1,
    "envId": "cloud1-0gpxp1848b37de8d",
    "functionName": "pay_cb"
  })
  return res
}
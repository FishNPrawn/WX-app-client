// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.logistics.getPath({
        "openid": 'oZtci5PNGOM1PeDMg02tE5yJHWjo',
        "orderId": '123053074972189461463812648123',
        "deliveryId": 'JDL',
        "waybillId": "JDVC09976420361"
      })
    return result
  } catch (err) {
    return err
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
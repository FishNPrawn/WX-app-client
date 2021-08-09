const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.logistics.getPath({
        "openid": 'oZtci5PNGOM1PeDMg02tE5yJHWjo',
        "orderId": '01234567890123456789',
        "deliveryId": 'JDL',
        "waybillId": 'JDX005472695327'
      })
    return result
  } catch (err) {
    return err
  }
}
// const cloud = require('wx-server-sdk')
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV,
// })
// exports.main = async (event, context) => {
//   try {
//     const result = await cloud.openapi.logistics.getAllDelivery({})
//     return result
//   } catch (err) {
//     return err
//   }
// }

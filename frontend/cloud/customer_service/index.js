const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.customerServiceMessage.send({
        "touser": 'oZtci5PNGOM1PeDMg02tE5yJHWjo',
        "msgtype": 'text',
        "text": {
          "content": 'Hello World'
        }
      })
    return result
  } catch (err) {
    return err
  }
}
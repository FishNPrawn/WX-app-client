// pages/comment/comment.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //提交订单
  submitOrder: function(e){
    // 格式现在时间 - yyyy/mm/dd hour:minute:second
    const formatTime = date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    // 当地时间
    var time = formatTime(new Date())

    // 创建评论
    let comments_json = JSON.stringify(
    [
      {"openId": "19", "goodId": 6, "name": "鱼肉6", "content": "非常好6", "image": "url6", "comment_create_time": time},
      {"openId": "19", "goodId": 7, "name": "牛肉7", "content": "非常好7", "image": "url7","comment_create_time": time},
    ]);
    
    wx.request({
      url: app.globalData.baseUrl + '/comment/createComment',
      method: "POST",
      header:{
       "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        items: comments_json
      },
      success: function(res){
        console.log("评论成功", res.data);
      }
    })
  }
})
// pages/comment/comment.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    orderItemList: [],
    commentDict: {},
    userInfo: {}
  },

  onLoad: function (options) {
    this.getOrder(options.orderId)
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo: userInfo});
  },

  getOrder: function(orderId) {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/order/listByOrderId?orderid='+orderId,
      success: function(res) {
        try {
          that.setData({
            orderDetail: res.data[0],
            orderItemList: res.data[0].orderDetailList
          })
        } catch {
          console.log('Error when fetching order item list')
        }
      }
    })
  },
  textareaInput: function(e) {
    let item = e.currentTarget.dataset.item
    let commentDetail = {
      "openId": this.data.orderDetail.openId, 
      "goodId": item.good_id, 
      "name": item.good_name, 
      "content": e.detail.value, 
      "image": this.data.userInfo.avatarUrl
    }
    var commentDict = this.data.commentDict
    this.data.commentDict[item.good_id] = commentDetail
    this.setData({
      commentDict: commentDict
    })
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

    var comments = []
    for (var id in this.data.commentDict) {
      var comment = this.data.commentDict[id]
      comment.comment_create_time = time
      comments.push(comment)
    }

    wx.request({
      url: app.globalData.baseUrl + '/comment/createComment',
      method: "POST",
      header:{
       "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        items: JSON.stringify(comments)
      },
      success: function(res){
        console.log("评论成功", res.data);
      }
    })
  }
})
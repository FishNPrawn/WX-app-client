// pages/comment/comment.js
let app = getApp();
const util = require('../../utils/util.js');
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
      "username": this.data.userInfo.nickName, 
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
  submitComment: function(orderId){
    // 当地时间
    var time = util.formatTime(new Date());
    // 创建评论
    var comments = []
    for (var id in this.data.commentDict) {
      var comment = this.data.commentDict[id]
      comment.comment_create_time = time
      comments.push(comment)
    }
    wx.request({
      url: app.globalData.baseUrl + '/comment/createComment?orderId='+this.data.orderDetail.orderId,
      method: "POST",
      header:{
       "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        items: JSON.stringify(comments)
      },
      success: function(res){
        console.log("评论成功", res.data);
        wx.navigateTo({
          url: '/pages/comment_success/comment_success'
        });
      }
    })
  }
})
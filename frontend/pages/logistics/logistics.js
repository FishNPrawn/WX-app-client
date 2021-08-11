// pages/logistics/logistics.js
//page object 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: null,
    express:['圆通', '申通', '京东'],
    key: ['yuantong', 'shentong', 'JDL'],
    index: 0,
    postId: '', //kuai di dan hao
    data: [],
    loading: false
  },
  bindExpressChange:function(e){
    var that = this;
    console.log(that.data.key[e.detail.value]);
    that.setData({
      index: e.detail.value
    })
  },
  bindChangeInput:function(e){
    this.setData({
      postId: e.detail.value
    })
  },

  bindOnSearch:function(e){
    var that = this;
    var postId = that.data.postId;
    var type = that.data.key[that.data.index];
    if(!postId.length || !type.length){
      return;
    }
    that.setData({
      loading: !that.data.loading
    });
    wx.request({
      url: 'https://robot/leanapp.cn/api/express' + type + '/' + postId,
      header:{
        'Content-Type': 'application/json'
      },
      data:{},
      method: "GET",
      success:function(res){
        console.log(res.data);
        that.setData({
          loading: !that.data.loading,
          data: res.data
        })
        console.error(res.data.data)
      },
      fail:function(res){
        console.log("abc")
      },
      complete:function(res){

      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8f882af467265220&secret=fb1f62bdbb62c3972ab830d471966a72',
    //   method: "GET",
    //   success: (result) => {
    //     console.log(result.data.access_token)
    //     this.setData({
    //       access_token:result.data.access_token
    //     })
    //   },
    //   fail: (res) => {},
    //   complete: (res) => {},
    // })
  },

  clickLog(){
    wx.cloud.callFunction({
      name: 'wuliu',
      data:{
        waybillId: "JDVC09976420361"
      },
      success: res => {
        var expressResult = res.result
        console.log("expressResult: ", expressResult)
        
      },
      fail: console.error,
    })
  //   wx.request({
  //     url: 'https://api.weixin.qq.com/cgi-bin/express/business/path/get?access_token='+this.data.access_token,
  //     data: {
  //       "order_id": "214953059437250235702375032",
  //       "openid": "oZtci5PNGOM1PeDMg02tE5yJHWjo",
  //       "delivery_id": "JDL",
  //       "waybill_id": "JDVC09976420361"
  //     },
  //     method: "POST",
  //     header:{
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: (result) => {
  //       console.log("wuliu:", result.data)
  //     },
  //     fail: (res) => {},
  //     complete: (res) => {},
  //   })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
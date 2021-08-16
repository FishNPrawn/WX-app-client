// pages/selectResult/selectResult.js
let app = getApp();
Page({
  data: {
    // 定义搜索结果变量，初始化为空数组
    searchResult: [],
    // 定义inputValue，输入框的input值，初始化为空
    inputValue: ""
  },

  // 分享
  onShareAppMessage: function () {
    // return custom share data when user share.
  },

  handleInput: function (e) {
    // 获取输入框的值
    const { value } = e.detail
    // 合法性验证，去除前后空格，防止打很多空格也会发送请求
    // 去除空格后的值是合法值了，再取反，为不合法值，不合法搜索结果清空
    if (!value.trim()) {
      this.setData({
        searchResult: [],
      })
      // 值不合法，直接return掉，不用执行下面的了
      return;
    }
    /**
     * 防抖动功能
     * 1 如果第一次输入的值合法，会执行this.TimeId这个定时器，然后一秒钟之后发送请求
     * 2 如果在这1秒钟的延迟内，用户重新做了输入，重新触发handleInput方法时，会执行clearTimeout
     *   将上一个定时器请求杀掉，然后再执行新的定时器函数，直到用户1庙后都没有新的输入后，才会发送请求
     */
    clearTimeout(this.TimeId)

    this.TimeId = setTimeout(() => {
      this.qSearch(value)
    }, 1000)
  },
  // qSearch 发送请求函数（参数为输入框中的值）
  qSearch: function (query) {
    // 定义一个加载中的提示
    wx.showLoading({
      title: '加载中...',
    })
    // 发送请求wx.request，微信封装好的ajax请求
    // 参数有两个需要传递的
    // url，接口地址
    // data，搜索的关键词，这边接口会自动处理并返回带有关键词的内容，
    // 不是因为wx.request又会发送ajax，还会给你自动筛选
    wx.request({
      url: app.globalData.baseUrl + '/good/good_filter?filter='+query,
      // 请求成功时调用
      success: (result) => {
        // 将获取的值，赋值给定义的searchResult，WXML文件获取渲染
        this.setData({
          searchResult: result.data.data
        })
        // 成功获取数据后，把加载中的提示关掉
        wx.hideLoading({
          complete: (res) => { },
        })
      }
    });
  },
  // 取消按钮函数
  handleCancel: function () {
    this.setData({
      searchResult: [],
      inputValue: ""
    })
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
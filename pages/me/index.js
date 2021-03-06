//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activities: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  onShow: function() {
    this.init()
    this.getActivity()
  },
  goMailBox: function(e) {
    wx.navigateTo({
      url: '../mailbox/index'
    })
  },
  goActivity: function(e) {
    wx.navigateTo({
      url: '../activity/index'
    })
  },
  init: function() {
    const that = this
    
    if (app.globalData.userInfo) {
      console.log(app.globalData)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        idnumber: app.globalData.idnumber
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          idnumber: app.globalData.idnumber
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            idnumber: app.globalData.idnumber,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.getActivity()
  },
  deleIt: function(e) {
    const that = this
    wx.request({
      url: `${app.globalData.site}/post/dele`,
      data: {
        code: e.target.dataset.code
      },
      method: "POST",
      success(res) {
        that.getActivity()
      }
    })
  },
  getActivity: function(e) {
    const that = this
    wx.request({
      url: `${app.globalData.site}/post/all`,
      method: "GET",
      data: {
        key: app.globalData.key,
        needCheck: false
      },
      success(res) {
        if(res.data.success) {
          that.setData({
            activities: res.data.data.map(item => ({
              createAt: new Date(item.createdAt).toLocaleString(),
              code: item.code,
              images: JSON.parse(item.images),
              content: item.raw
            }))
          })
          console.log(res.data.data)
        }
      }
    })
  }
})

//app.js
App({
  onLaunch: function() {
    let that = this
    wx.downloadFile({
      url: 'https://fanqier.com/static/merge1.silk',
      success(res) {
        if (res.tempFilePath) {
          that.globalData.merge = res.tempFilePath
        }
      }
    })

    wx.downloadFile({
      url: 'https://fanqier.com/static/move1.silk',
      success(res) {
        if (res.tempFilePath) {
          that.globalData.move = res.tempFilePath
        }
      }
    })
  },

  globalData: {
    merge: '',
    move: '',
  }
})

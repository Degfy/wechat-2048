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
        console.log(res)
      }
    })

    wx.downloadFile({
      url: 'https://fanqier.com/static/move1.silk',
      success(res) {
        if (res.tempFilePath) {
          that.globalData.move = res.tempFilePath
        }
        console.log(res)
      }
    })
  },

  globalData: {
    merge: '',
    move: '',
  }
})

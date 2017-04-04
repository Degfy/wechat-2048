//app.js
const GLOBAL_DATA_SAVE_KEY = '__gloabl_data__'
App({
  onLaunch: function() {
    let data = wx.getStorageSync(GLOBAL_DATA_SAVE_KEY)
    if (data) {
      this.globalData = data
      // console.log(this)
    } else {
      let that = this
      wx.downloadFile({
        url: 'https://fanqier.com/static/merge1.silk',
        success(res) {
          if (res.tempFilePath) {
            that.globalData.merge = res.tempFilePath
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function(res) {
                that.globalData.merge = res.savedFilePath
                wx.setStorage({ key: GLOBAL_DATA_SAVE_KEY, data: that.globalData })
                console.log(res)
              }
            })
          }
        }
      })
      wx.downloadFile({
        url: 'https://fanqier.com/static/move1.silk',
        success(res) {
          if (res.tempFilePath) {
            that.globalData.move = res.tempFilePath
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function(res) {
                that.globalData.move = res.savedFilePath
                wx.setStorage({ key: GLOBAL_DATA_SAVE_KEY, data: that.globalData })
                console.log(res)
              }
            })
          }
        }
      })
    }
  },

  globalData: {
    merge: '',
    move: '',
  }
})

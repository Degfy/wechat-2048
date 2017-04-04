// index.js
const app = getApp(),
  Game = require('./2014.game.js'),
  getDirect = (x, y) => {
    if (!x && !y) return 'no move'
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) {
        return 'left'
      } else {
        return 'right'
      }
    } else {
      if (y > 0) {
        return 'up'
      } else {
        return 'down'
      }
    }
  },
  GAME_INIT_MODE = 5,
  GAME_DATA_SAVE_KEY = '__game_data__'

Page({
  data: {
    showSetting: false,
    score: 982398,
    playSound: false,
    windowWidth: 0,
    windowHeight: 0,
    gameWidth: 0,
    cells: [],
    cellSize: 0,
    matrix: [],
    ani: [],
  },
  onLoad() {
    let data = wx.getStorageSync(GAME_DATA_SAVE_KEY)
    if (data) {
      this._reload(data)
    } else {
      const success = info => {
        const { windowWidth, windowHeight } = info
        let gameWidth = Math.min(windowWidth - 20, windowHeight - 140 - 20),
          { score, cells, cellSize, matrix, ani, } = this._mode(GAME_INIT_MODE, gameWidth)

        this.setData({
          windowWidth,
          windowHeight,
          gameWidth,
          cells,
          cellSize,
          score,
          matrix,
          ani,
        })
      }
      wx.getSystemInfo({ success })
    }
  },

  onShareAppMessage: function() {
    return {
      title: '大家一起来玩2048小游戏吧😄',
      path: '/pages/2048/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },

  _mode(n, gameWidth) {
    this._game = this._game || new Game(n, gameWidth)

    let score = 0,
      cellSize = 100 / n,
      cells = [],
      index = 0,
      game = this._game,
      matrix = game.SetMode(n)

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        cells.push({
          index,
          r: i,
          c: j,
        })
        index++
      }
    }

    return { score, cells, cellSize, matrix, ani: game.BlankAni }
  },

  ShowSetting() {
    this.setData({
      showSetting: true,
    })
  },
  HideSetting() {
    this.setData({
      showSetting: false,
    })
  },
  SoundSwitch() {
    this.setData({
      playSound: !this.data.playSound,
    })
  },

  TouchStart(evt) {
    const { clientX, clientY } = evt.changedTouches[0]
    this.pointA = {
      x: clientX,
      y: clientY,
    }

  },

  TouchEnd(evt) {
    const { clientX, clientY } = evt.changedTouches[0]
    this.pointB = {
      x: clientX,
      y: clientY,
    }

    let direct = getDirect(this.pointA.x - this.pointB.x, this.pointA.y - this.pointB.y),
      hasSound = this.data.playSound ? app.globalData : null



    const [ani_1, ani_1_2, ani_2, scoreAdd] = this._game.Action(direct, { duration: 80 }, { duration: 30 }, hasSound),
      score = this.data.score + scoreAdd

    this.setData({
      ani: ani_1,
      score,
    })

    setTimeout(() => {
      this.setData({
        ani: ani_1_2,
        matrix: this._game.Value,
      })

      setTimeout(() => {
        this.setData({
          ani: ani_2,
        })
      })

      setTimeout(() => {
        this.setData({
          ani: this._game.BlankAni,
        })

        this._save()
      }, 30)
    }, 80)
  },

  ChooseMod(evt) {
    const mode = evt.target.dataset.mode
    if (mode !== this.data.mode) {
      let data = this._mode(mode, this.data.gameWidth)
      data.showSetting = false
      this.setData(data)
    } else {
      this.HideSetting()
    }
  },

  _save() {
    wx.setStorage({ key: GAME_DATA_SAVE_KEY, data: this.data })
  },

  _reload(data) {
    this._game = Game.Reload({
      matrix: data.matrix,
      panelWidth: data.gameWidth,
      size: data.matrix.length,
    })

    this.setData(data)
  },
})

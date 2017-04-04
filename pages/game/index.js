// index.js
//获取应用实例
var app = getApp()
const Game = require('./2014.game.js'),
  matrixSize = 5

function getDirect(x, y) {
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
}

Page({
  data: {
    mode: matrixSize,
    upWrapHeight: 0,
    matrix: [],
    windowWidth: 0,
    cellWidth: 0,
    ani: [],
    cells: [],
    score: 0,
    btnFontSize: '',
    soundCss: 'sound',
    showSetting: false,
  },

  onLoad() {
    const success = info => {
      let { windowWidth, windowHeight } = info,
      upWrapHeight = Math.min(windowHeight - windowWidth - 20, 140),
        btnFontSize = ''

      if (upWrapHeight < 120) {
        btnFontSize = 'font-size:12px;'
      }

      windowWidth -= 24

      const cellWidth = (1 / matrixSize) * 100,
        _matrix = new Game(matrixSize, windowWidth),
        matrix = _matrix.Value,
        ani = _matrix.BlankAni,
        css = _matrix.BlankCss

      _matrix.Add()
      this._matrix = _matrix

      let cells = [],
        index = 0
      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          cells.push({
            index,
            r: i,
            c: j,
          })
          index++
        }
      }

      this.setData({
        upWrapHeight,
        matrix,
        windowWidth,
        cellWidth,
        ani,
        css,
        cells,
        btnFontSize,
      })
    }
    wx.getSystemInfo({ success })
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
      hasSound = this.data.soundCss === 'sound' ? app.globalData : null



    const [ani_1, ani_1_2, ani_2, scoreAdd] = this._matrix.Action(direct, {
        duration: 80,
      }, {
        duration: 30,
      }, hasSound),
      score = this.data.score + scoreAdd

    this.setData({
      ani: ani_1,
      score,
    })

    setTimeout(() => {
      this.setData({
        ani: ani_1_2,
        matrix: this._matrix.Value,
      })

      setTimeout(() => {
        this.setData({
          ani: ani_2,
        })
      })

      setTimeout(() => {
        this.setData({
          ani: this._matrix.BlankAni,
        })
      }, 30)
    }, 80)
  },
  ReStart(evt) {
    this.setData({
      matrix: this._matrix.Reset(),
      score: 0,
    })
  },

  SoundSwitch() {
    let soundCss = ''
    switch (this.data.soundCss) {
      case 'sound':
        soundCss = 'silence'
        break
      case 'silence':
        soundCss = 'sound'
        break
    }

    this.setData({
      soundCss,
    })
  },

  Setting() {
    this.setData({
      showSetting: true,
    })
  },

  SettingClose() {
    this.setData({
      showSetting: false,
    })
  },

  ChooseMod(evt) {
    const mode = evt.target.dataset.mode
    if (mode !== this.data.mode) {
      const matrix = this._matrix.SetMode(mode)
      let cells = [],
        index = 0,
        cellWidth = (1 / mode) * 100
      for (let i = 0; i < mode; i++) {
        for (let j = 0; j < mode; j++) {
          cells.push({
            index,
            r: i,
            c: j,
          })
          index++
        }
      }

      this.setData({
        cells,
        mode,
        cellWidth,
        matrix,
        showSetting: false,
        ani: this._matrix.BlankAni,
        score: 0,
      })
    } else {
      this.SettingClose()
    }
  }
})

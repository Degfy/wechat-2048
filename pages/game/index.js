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
    upWrapHeight: 0,
    matrix: [],
    windowWidth: 0,
    cellWidth: 0,
    ani: [],
    cells: [],
    score: 0,
  },

  onLoad() {
    const success = info => {
      let { windowWidth, windowHeight } = info,
      upWrapHeight = Math.min(windowHeight - windowWidth - 20, 140)

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

    let direct = getDirect(this.pointA.x - this.pointB.x, this.pointA.y - this.pointB.y)

    const [ani_1, ani_1_2, ani_2, scoreAdd] = this._matrix.Action(direct, {
        duration: 80,
      }, {
        duration: 30,
      }, app.globalData),
      score = this.data.score + scoreAdd

    console.log(scoreAdd)

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
    })
  },
})

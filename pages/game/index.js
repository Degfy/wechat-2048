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
    matrix: [],
    windowWidth: 0,
    cellWidth: 0,
    ani: [],
    css: [],
    cells: [],
  },

  onLoad() {
    const success = info => {
      const cellWidth = (1 / matrixSize) * 100,
        { windowWidth } = info,
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

    const [ani_1, ani_1_2, ani_2] = this._matrix.Action(direct, {
      duration: 100,
    }, {
      duration: 50,
    })

    this.setData({
      ani: ani_1,
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
      }, 50)
    }, 100)
  }
})

// 2014.game.js
const clone = require('./clone.js')

function Game(size, panelWidth) {
  if (!(this instanceof Game)) {
    return new Game(size, panelWidth)
  }
  this._size = size
  this._panelWidth = panelWidth
  this._cellWidth = panelWidth / size

  this._matrix = []
  this._blankCss = []
  this._blankAni = []

  let i = size,
    animation = wx.createAnimation({ duration: 0 })


  while (i--) {
    let j = size,
      row = [],
      css_row = [],
      ani_row = []

    while (j--) {
      row.push(0)
      css_row.push('')
      animation.translate3d(0, 0, 0).scale3d(1, 1, 1).step()
      ani_row.push(animation.export())
    }

    this._matrix.push(row)
    this._blankCss.push(css_row)
    this._blankAni.push(ani_row)
  }
}

function noop() {}

Game.prototype = {
  get Value() {
    return this._matrix
  },

  get BlankCss() {
    return clone(this._blankCss)
  },

  get BlankAni() {
    return clone(this._blankAni)
  },

  Add(fn) {
    fn = fn || noop
    let matrix = this._matrix,
      size = this._size,
      empty_cells = []

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] === 0) {
          empty_cells.push({
            r: i,
            c: j,
          })
        }
      }
    }

    if (empty_cells.length) {
      let index = Math.floor(Math.random() * empty_cells.length),
        random = Math.random(),
        value = 2

      if (random > 0.8) {
        value = 4
        if (value > 0.96) {
          value = 8
        }
      }

      let empty = empty_cells[index]
      matrix[empty.r][empty.c] = value
      fn(empty.r, empty.c)
    }
  },

  /**
   * 执行动作
   * @Author   degfy@sina.com
   * @DateTime 2017-04-03T10:27:07+0800
   */
  Action(direct, step1_opts, step2_opts, voice) {
    let animation1 = wx.createAnimation(step1_opts),
      animation1_2 = wx.createAnimation({ duration: 0 }),
      animation2 = wx.createAnimation(step2_opts),
      size = this._size,
      cellWidth = this._cellWidth,
      ani_m_1 = clone(this._blankAni),
      ani_m_1_2 = clone(this._blankAni),
      ani_m_2 = clone(this._blankAni),
      isValid = false,
      score = 0

    animation1_2.translate3d(0, 0, 0).scale3d(.1, .1, .1).opacity(.4).step()
    animation2.scale3d(1, 1, 1).opacity(1).step()

    let animation_reset = animation1_2.export(),
      animation_element_gen = animation2.export()

    function merge(get, set, fn) {
      let score = 0
      for (let i = 0; i < size; i++) {
        let valueI = get(i)
        for (let j = i + 1; j < size; j++) {
          let valueJ = get(j)

          if (valueJ > 0) {
            if (valueI === 0) {
              valueI = set(i, valueJ)
              set(j, 0)
              fn(i, j, false)
              isValid = true
              continue
            } else {
              if (valueI === valueJ) {
                set(i, valueJ * 2)
                set(j, 0)
                fn(i, j, true)
                isValid = true
                score += valueJ * 2
              }
              break
            }
          }
        }
      }
      return score
    }

    switch (direct) {
      case 'left':
        for (let r = 0; r < size; r++) {
          score = merge(index => {
            return this._matrix[r][index]
          }, (index, value) => {
            return this._matrix[r][index] = value
          }, (i, j, merged) => {
            animation1.translate3d((i - j) * cellWidth, 0, 0).step()
            ani_m_1[r][j] = animation1.export()

            if (merged) {
              ani_m_1_2[r][i] = animation_reset
              ani_m_2[r][i] = animation_element_gen
            }
          })
        }
        break
      case 'right':
        for (let r = 0; r < size; r++) {
          score = merge(index => {
            return this._matrix[r][size - index - 1]
          }, (index, value) => {
            return this._matrix[r][size - index - 1] = value
          }, (i, j, merged) => {
            animation1.translate3d((j - i) * cellWidth, 0, 0).step()
            ani_m_1[r][size - j - 1] = animation1.export()

            if (merged) {
              ani_m_1_2[r][size - i - 1] = animation_reset
              ani_m_2[r][size - i - 1] = animation_element_gen
            }
          })
        }
        break
      case 'up':
        for (let c = 0; c < size; c++) {
          score = merge(index => {
            return this._matrix[index][c]
          }, (index, value) => {
            return this._matrix[index][c] = value
          }, (i, j, merged) => {
            animation1.translate3d(0, (i - j) * cellWidth, 0).step()
            ani_m_1[j][c] = animation1.export()

            if (merged) {
              ani_m_1_2[i][c] = animation_reset
              ani_m_2[i][c] = animation_element_gen
            }
          })
        }
        break
      case 'down':
        for (let c = 0; c < size; c++) {
          score = merge(index => {
            return this._matrix[size - index - 1][c]
          }, (index, value) => {
            return this._matrix[size - index - 1][c] = value
          }, (i, j, merged) => {
            animation1.translate3d(0, (j - i) * cellWidth, 0).step()
            ani_m_1[size - j - 1][c] = animation1.export()

            if (merged) {
              ani_m_1_2[size - i - 1][c] = animation_reset
              ani_m_2[size - i - 1][c] = animation_element_gen
            }
          })
        }
        break
    }
    if (isValid) {
      this.Add((r, c) => {
        ani_m_2[r][c] = animation_element_gen
        ani_m_1_2[r][c] = animation_reset
      })

      let filePath
      if (score) {
        filePath = voice.merge
      } else {
        filePath = voice.move
      }

      if (filePath) {
        wx.stopVoice()
        wx.playVoice({
          filePath,
          complete(res) {
            console.log(res)
          }
        })
      }
    }
    return [ani_m_1, ani_m_1_2, ani_m_2, score]
  },

  Reset() {
    let size = this._size,
      i = size
    while (i--) {
      let j = size
      while (j--) {
        this._matrix[i][j] = 0
      }
    }
    this.Add()
    return this._matrix
  },
}


module.exports = Game

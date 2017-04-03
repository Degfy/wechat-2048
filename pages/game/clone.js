// clone.js
const clone = obj => {
  if (null == obj || "object" != typeof obj) return obj
  if (obj instanceof Array) {
    let copy = [];
    for (let i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i])
    }
    return copy
  }
  if (obj instanceof Object) {
    let copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }
}

module.exports = clone

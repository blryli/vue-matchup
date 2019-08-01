export const debounce = function (fn, wait) {
  let timer;
  return function () {
    const context = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

export const throttle = function (fn, wait) {
  let timer;
  return function () {
    const context = this
    const args = arguments
    !timer && fn.apply(context, args)
    timer = setTimeout(() => {
      timer = null
    }, wait)
  }
}


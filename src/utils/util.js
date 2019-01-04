const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

export const generateId = function () {
  return Math.floor(Math.random() * 10000);
};

export const offset = function(target) {
  if (!target || !target.offsetParent) return false;
  let top = 0;
  let left = 0;
  while (target.offsetParent) {
    top += target.offsetTop;
    left += target.offsetLeft;
    target = target.offsetParent;
  }
  return {
    top: top,
    left: left
  };
}

export const scroll = function() {
  if (window.pageYOffset != null){
    return{
      left:window.pageXOffset,
      top:window.pageYOffset
    }
  }else if (document.compatMode == 'CSS1Compat'){
    return{
      left:document.documentElement.scrollLeft,
      top:document.documentElement.scrollTop
    }
  }
  return{
    left:document.body.scrollLeft,
    top:document.body.scrollTop
  }
}
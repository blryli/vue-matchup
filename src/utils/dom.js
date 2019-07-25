import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 用来绑定事件的方法，它是一个自执行的函数，会根据是否运行于服务器和是否支持addEventListener来返回一个function
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, function (e) {
          handler(e)
        }, false)
      }
    }
  } else {
    return function (element, event, handler, index) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function (e) {
          handler(e)
        })
      }
    }
  }
})()

// 解除绑定事件
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * 删除节点
 * @param {content} self 
 * @param {node ref} ref 
 */
export const removeBody = function (self, ref) {
  const pos = self.$refs[ref];
  if (pos && pos.$el && pos.$el.parentNode === document.body) {
    document.body.removeChild(pos.$el);
  } else if (pos && pos.parentNode === document.body) {
    document.body.removeChild(pos);
  }
}

/**
 * 获取所有父节点
 * @param {documentElement} node 
 */
export const getParentNodes = function (node) {
  let parentNodes = [window];
  while (node !== document.body) {
    parentNodes.push(node);
    if (!node.parentNode || node.parentNode.name) return parentNodes;
    node = node.parentNode;
  }
  return parentNodes;
}

/**
 * 节点绑定 resize scroll 事件
 * @param {array} node 
 * @param {function} handler 
 */
export const enableEventListener = function (nodes, handler) {
  nodes.forEach(p => {
    p.addEventListener('resize', handler, {
      passive: true
    });
    p.addEventListener('scroll', handler, {
      passive: true
    });
  })
};

/**
 * 节点解绑 resize scroll 事件
 * @param {array} node 
 * @param {function} handler 
 */
export const removeEventListener = function (nodes, handler) {
  nodes.forEach(p => {
    p.removeEventListener('resize', handler);
    p.removeEventListener('scroll', handler);
  })
};

/**
 * * 获取节点 getBoundingClientRect
 * @param {节点} target 
 */
export const getDomClientRect = function (target) {
  const targetRect = target.getBoundingClientRect();
  const top = targetRect.top;
  const bottom = targetRect.bottom;
  const left = targetRect.left;
  const right = targetRect.right;
  const width = targetRect.width || right - left;
  const height = targetRect.height || bottom - top;
  return {
    width,
    height,
    top,
    right,
    bottom,
    left,
    centerY: top + height / 2
  }
};

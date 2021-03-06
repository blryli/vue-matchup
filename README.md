# vue-matchup

- canves实现的列表/表格关系动态匹配组件

> 坐标计算用 getBoundingClientRect，动画效果会影响线展示位置，如: 使用element弹窗加载组件 vue-matchup 时，在动画结束前就已经算出个点相对窗口的坐标点，所以坐标值是有偏差的。解决办法是使用一个没有位移动画的弹窗加载组件。

### 演示

[github pages](https://blryli.github.io/vue-matchup/)

#### npm 安装

```js
npm i vue-matchup -S
```

#### 使用

```js
import VueMatchup from 'vue-matchup'

Vue.use(VueMatchup)
```

#### 基本使用

```html
<template>
  <vue-matchup
    v-model="lines"
    :leftData="leftData"
    :rightData="rightData"
    :leftThead="leftThead"
    :rightThead="rightThead"
  >
  </vue-matchup>
</template>
```

```js
<script>
export default {
  data () {
    return {
      lines: [
        { leftId: "L1-1", rightId: "R1-5" },
        { leftId: "L1-3", rightId: "R1-2" }
      ],
      leftData: [
        {
          lineNo: 0,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" }
        }
      ],
      rightData: [
        {
          lineNo: 1,
          qty: 100,
          unit: "KG"
        }
      ],
      leftThead: [
        {
          title: "序号",
          props: "lineNo"
        },
        {
          title: "净重",
          props: "nw/weight" // table需要展示的数据，嵌套对象结构用'/'分隔
        }
      ],
      rightThead: [
        {
          title: "序号",
          props: "lineNo"
        },
        {
          title: "数量",
          props: "qty"
        }
      ]
    }
  }
}
</script>
```

### Attributes

|    参数     |    说明         |   类型     |可选值  |默认值|
| ---------  | ----------      | --------   |----  | ----- |
| lines      | 已连接线的数组       | array      |-     | []    |
| leftData   |  左面板展示的数据   | array       |-     | []  |
| rightData   |  右面板展示的数据   | array       |-     | []  |
| leftThead   |  左面板数据的标题及展示的字段[{title: 'title', props: 'props'}]   | string/array       |-     | []  |
| rightThead  |  右面板数据的标题及展示的字段[{title: 'title', props: 'props'}]   | string/array       |-     | []  |
| leftTitle   |  左面板折叠面板的标题，单个面板为string，多个面板为array ['title','title'] | string/array     |-     | left  |
| rightTitle  |  右面板折叠面板的标题，单个面板为string，多个面板为array ['title','title'] | string/array     |-     | right  |
| leftIdFun  |  自定义左面板row的id，此id用于行操作，及定义线条leftId与rightId，例 (row, index) => `leftId:${index}-${row.lineNo}`，第一个回调参数为行数据，第二个回调参数为行号，leftIdFun不存在则使用默认id| function     |-     | -  |
| rightIdFun  |  自定义右面板row的id，此id用于行操作，及定义线条leftId与rightId，例 (row, index) => `rightId:${index}-${row.lineNo}`，第一个回调参数为行数据，第二个回调参数为行号，leftIdFun不存在则使用默认id| function     |-     | -  |
| collapseMaxHeight  |  用于设置面板最大高度 | number     |-     | -  |
| collapseAccordion  |  折叠面板是否开启手风琴模式(只展开一个面板) | boolean     |-     | false  |
| popover  |  移入行时是否使用 popover 展示行详细内容 | boolean     |-     | false  |
| popoverEnterable  |  popover 是否可移入 | boolean     |-     | false  |
| popoverHideDelay  |  popover 显示隐藏的延时，popoverEnterable为true时可用 | number     |-     | 200  |

#### 行id

左右面板默认使用多层结构，默认id格式为 面板选项卡-行号，即 L1-1、R1-2，L2-1、R2-2的格式。

> 自定义行id使用leftIdFun、rightIdFun属性。

### Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|link    | 连接线的方法            |    {leftIds, rightIds, color}    |
|drawLine    | 重绘线            |-       |
|leftCheckRow    | 左面板选中行的方法，参数为row的id            |id      |
|rightCheckRow    | 右面板选中行的方法，参数为row的id            |id      |
|clearChecked    | 全局清空选中面板            |-      |
|checkLines    | 选中线的方法，参数为要选中线条id组成的数组            | array      |
|unCheckedLines    | 用于取消线的选中状态的方法，参数为要清除线条id组成的数组            | array      |
|clearCheckedLines    | 用于清空选中线的方法            | -      |

> 线的连接可以自定义，控制lines的增删来控制线，由于vue2.0还不能监听数组变化，因此需要用push,splice等方法操作数组。

### Events

|  事件名 |    说明                    |   回调参数      |
|-------- |------                      |------       |
|checkRow | 选中行时触发该事件 | id    |
|unCheckRow | 取消选中行时触发该事件 | id    |
|checkLine | 选中线时触发该事件 | id    |
|unCheckLine | 取消选中线时触发该事件 | id    |
|leftCheckChange | 左面板选中行时触发该事件 | array    |
|rightCheckChange | 右面板选中行时触发该事件 | array    |
|delete | 删除线条时触发该事件 | id    |

### 版本

#### 1.0.31

- 滚动增加debounce、线重绘增加throttle，优化组件性能。

#### 1.0.30

- 解决多线条选中，背景高亮显示不正确的问题。

#### 1.0.29

- 整合解决滚动导致偏移的问题。

#### 1.0.28

- 迁移rollup。

- 线条选中时，线对应的 table 行背景高亮。

[历史版本](https://github.com/blryli/vue-matchup/blob/master/VERSION.md)

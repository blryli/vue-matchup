# vue-matchup

> A Vue.js project

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
      lines: [],
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
| lines      | 连接线的集合       | array      |-     | []    |
| leftData   |  左面板展示的数据   | array       |-     | []  |
| rightData   |  右面板展示的数据   | array       |-     | []  |
| leftThead   |  左面板数据的标题及展示的字段[{title: 'title', props: 'props'}]   | string/array       |-     | []  |
| rightThead  |  右面板数据的标题及展示的字段[{title: 'title', props: 'props'}]   | string/array       |-     | []  |
| leftTitle   |  左面板折叠面板的标题，单个面板为string/array，多个面板为array ['title','title'] | string/array     |-     | left  |
| rightTitle  |  右面板折叠面板的标题，单个面板为string/array，多个面板为array ['title','title'] | string/array     |-     | right  |
| leftIdFun  |  自定义左面板row的id，此id用于切换行选中效果，及定义线条leftId与rightId，(row, index) => `leftId:${index}-${row.lineNo}`，第一个回调参数为行数据，第二个回调参数为行号，leftIdFun不存在则使用默认id| function     |-     | -  |
| rightIdFun  |  自定义右面板row的id，此id用于切换行选中效果，及定义线条leftId与rightId，(row, index) => `rightId:${index}-${row.lineNo}`，第一个回调参数为行数据，第二个回调参数为行号，leftIdFun不存在则使用默认id| function     |-     | -  |
| popover  |  移入行时是否使用 popover 展示行详细内容 | boolean     |-     | false  |
| popoverEnterable  |  popover 是否可移入 | boolean     |-     | false  |
| popoverHideDelay  |  popover 显示隐藏的延时，popoverEnterable为true时可用 | number     |-     | 200  |
| collapseAccordion  |  折叠面板是否开启手风琴模式(只展开一个面板) | boolean     |-     | false  |

### Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|init    | 在数据异步获取成功后，及页面加载时组件由不可见切换到可见状态必须执行init方法            |-      |
|leftCheckRow    | 左面板选中行的方法，参数为row的id            |id      |
|rightCheckRow    | 右面板选中行的方法，参数为row的id            |id      |
|clearChecked    | 全局清空选中面板            |-      |
|join    | 连接线的方法，若传入参数，第一个参数是左面板选中id的数组，第二个参数是右面板选中id的数组，第三个参数是回调函数function(line){}，参数line为当前线，设置的属性会添加或覆盖到当连接前线，若不传参数则连接当前左右两侧面板选中选中的行            |array,array,funtion       |
|checkLines    | 选中线的方法，参数为要选中线条id组成的数组            | array      |
|unCheckedLines    | 用于取消线的选中状态的方法，参数为要清除线条id组成的数组            | array      |
|clearCheckedLines    | 用于清空选中线的方法            | -      |
|drawLine    | 画布重绘            |-       |
|setColor    | 设置线条颜色，此方法作用于当前选中的线条，参数是色值            |  string     |
|delete    | 删除线条，参数是传进来的ID，类型string/array，不传则删除当前选中的线   |  array     |

### Events

|  事件名 |    说明                    |   回调参数      |
|-------- |------                      |------       |
|checkRow | 选中行时触发 | id    |
|unCheckRow | 取消选中行时触发 | id    |
|checkLine | 选中线时触发 | id    |
|unCheckLine | 取消选中线时触发 | id    |
|leftCheckChange | 左面板选中行的回调，回调参数是左面板选中行id组成的数组 | array    |
|rightCheckChange | 右面板选中行的回调，回调参数是右面板选中行id组成的数组 | array    |
|delete | 删除线条时触发 | id    |

#### 行id

左右面板默认使用多层结构，默认id格式为 面板选项卡-行号，即 L1-1、R1-2，L2-1、R2-2的格式。

> 自定义行id使用leftIdFun、rightIdFun属性，第一个回调参数为行数据，第二个回调参数为行号

#### 线id

线id默认使用 leftId 与 rightId 的组合，格式为 leftId--rightId，即 L1-1--R1-2。

> 自定义线id，在连接线方法join的第三个参数中设置，该参数是回调函数，参数为line即当前线，设置的属性会添加或覆盖到当前连接线。

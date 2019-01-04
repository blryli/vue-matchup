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

// 或者直接使用script导入
<script src="https://unpkg.com/vue-matchup/dist/vue-matchup.js"></script>
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
      // 如果有已经确定的对应关系，需要直接连接，只需要如下结构
      // lines: [{leftId: '1-1', rightId: '1-2'}]
      lines: [],
      leftData: [],
      rightData: [],
      leftThead: [],
      rightThead: [],
    }
  }
}
</script>
```

#### 改变线条颜色

> 本例使用element-ui组件，当然可以使用任何组件。

```html
<template>
  <vue-matchup
    ref="matchup"
    v-model="lines"
    :leftData="leftData"
    :rightData="rightData"
    :leftThead="leftThead"
    :rightThead="rightThead"
    @unselect="unselect"
  >
    <template slot-scope="{ disabled }">
      属性
      <el-select v-model="value" placeholder="请选择" :disabled="disabled" @change="change">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </template>
  </vue-matchup>
</template>
```

```js
<script>
export default {
  data () {
    return {
      lines: [],
      leftData: [],
      rightData: [],
      leftThead: [],
      rightThead: [],
    }
  },
  methods: {
    change(val) {
      this.$refs.matchup.setColor(val);
    },
    unselect() {
      this.value = '';
    }
  }
}
</script>
```

```
### Attributes

|    参数     |    说明         |   类型     |可选值  |默认值|
| ---------  | ----------      | --------   |----  | ----- |
| lines      | 连接的数据       | array      |-     | []    |
| leftData   |  左边展示的数据   | array       |-     | []  |
| rightData   |  右边展示的数据   | array       |-     | []  |
| leftThead   |  左边数据的标题   | array       |-     | []  |
| rightThead  |  右边数据的标题   | array       |-     | []  |
| leftTitle   |  左边折叠面板的标题 | string     |-     | left  |
| rightTitle  |  右边折叠面板的标题 | string     |-     | right  |
| collapseAccordion  |  折叠面板是否开启手风琴模式(只展开一个面板) | boolean     |-     | false  |

### Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|join    | 连接线的方法            |-       |
|drawLine    | 画布重绘            |-       |
|setColor    | 设置线条颜色，此方法作用于当前选中的线条            |  颜色值     |
|delete    | 删除线条，参数是传进来的ID，不传则默认是当前选中的ID   |  id     |

### Events
|  事件名 |    说明                    |   回调参数      |
|delete | 删除线条时触发 | 当前删除线条的ID    |
|checked-change | 行选中状态改变时触发 | {left: [左边选中的ID组成的数组]right: [右边选中的ID组成的数组] }    |
|select | 选中线条时触发 | id    |
|unselect | 取消线条选中时触发 | id    |

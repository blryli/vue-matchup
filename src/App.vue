<template>
  <div id="app">
    <vue-matchup
      ref="matchup"
      v-model="lines"
      :leftData="data[0]"
      :rightData="data"
      :leftThead="theadData"
      :rightThead="theadData"
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
    <p>{{lines}}</p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      options: [
        {
          value: "blue",
          label: "拆分"
        },
        {
          value: "red",
          label: "合并"
        },
        {
          value: "orange",
          label: "混装"
        }
      ],
      value: "",
      lines: [{leftId: '1-1', rightId: '1-2'}],
      finishLines: [],
      leftData: [],
      rightData: [],
      theadData: [
        {
          title: "序号"
        },
        {
          title: "数量"
        }
      ],
      data: [
        [
          {
            lineNo: 1,
            qty: 10
          },
          {
            lineNo: 2,
            qty: 10
          },
          {
            lineNo: 3,
            qty: 10
          },
          {
            lineNo: 4,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 6,
            qty: 1
          }
        ],
        [
          {
            lineNo: 1,
            qty: 10
          },
          {
            lineNo: 2,
            qty: 10
          },
          {
            lineNo: 3,
            qty: 10
          },
          {
            lineNo: 4,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 6,
            qty: 1
          }
        ],
        [
          {
            lineNo: 1,
            qty: 10
          },
          {
            lineNo: 2,
            qty: 10
          },
          {
            lineNo: 3,
            qty: 10
          },
          {
            lineNo: 4,
            qty: 10
          },
          {
            lineNo: 5,
            qty: 10
          },
          {
            lineNo: 6,
            qty: 10
          }
        ]
      ]
    };
  },
  methods: {
    change(val) {
      this.$refs.matchup.setColor(val);
    },
    unselect() {
      this.value = '';
    }
  }
};
</script>

<style lang="scss">
.collapse-item__wrap{
  max-height: 200px;
}
</style>


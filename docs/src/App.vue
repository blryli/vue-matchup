<template>
  <div id="app">
    <center>
      <p>
        <el-button @click="link">连接</el-button>
        <el-button @click="clearCheckedLines">清空选中线条</el-button>
      </p>
    </center>
    <div class="box">
      <vue-matchup
        ref="matchup"
        v-model="lines"
        :leftData="items"
        :rightData="decItems"
        :leftThead="leftThead"
        :rightThead="rightThead"
        :leftPopoverContentFun="leftPopoverContentFun"
        :rightPopoverContentFun="rightPopoverContentFun"
        leftTitle="清单"
        :rightTitle="['报关1','报关2','报关3']"
        @checkRow="checkRow"
        @unCheckRow="unCheckRow"
        @checkLine="checkLine"
        @unCheckLine="unCheckLine"
        @leftCheckChange="leftCheckChange"
        @rightCheckChange="rightCheckChange"
        @delete="deleteFun"
      ></vue-matchup>
    </div>
  </div>
</template>

<script>
import mock from 'mockjs';

export default {
  name: "app",
  data() {
    return {
      leftIdFun: (row, index) => `L${index}-${row.lineNo}`,
      rightIdFun: (row, index) => `R${index}-${row.lineNo}`,
      leftPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, [data.lineNo])
        ]);
      },
      rightPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, [data])
        ]);
      },
      items: [],
      decItems: mock.mock([
        [
          {}
        ]
      ]),
      decItems: [],
      lines: [
        { leftId: "L1-1", rightId: "R1-5" },
        { leftId: "L1-3", rightId: "R1-2" },
        { leftId: "L1-9", rightId: "R1-1" },
        { leftId: "L1-2", rightId: "R2-1" },
        { leftId: "L1-15", rightId: "R2-6" },
        { leftId: "L1-18", rightId: "R2-12" },
        { leftId: "L1-2", rightId: "R2-7" }
      ],
      finishLines: [],
      leftData: [],
      rightData: [],
      leftThead: [
        {
          title: "序号",
          props: "lineNo"
        },
        {
          title: "数量",
          props: "qty"
        },
        {
          title: "净重",
          props: "nw/weight"
        },
        {
          title: "毛重",
          props: "gw/weight"
        }
      ],
      rightThead: [
        {
          title: "序号",
          props: "lineNo"
        },
        {
          title: "数量",
          props: "qty1"
        },
        {
          title: "单位",
          props: "unit1"
        }
      ]
    };
  },
  watch: {
    lines(val) {
      console.log(JSON.stringify(val, null, 2))
    }
  },
  methods: {
    // 左面板选中行的方法
    leftCheckRow() {
      this.$refs.matchup.leftCheckRow("L1-1");
    },
    // 右面板选中行的方法
    rightCheckRow() {
      this.$refs.matchup.rightCheckRow("R1-3");
    },
    // 连接的方法
    link() {
      this.$refs.matchup.link();
    },
    linkLine() {
      this.$refs.matchup.link(["L1-1"], ["R1-3"], line => (line.color = "red"));
      this.$refs.matchup.link(
        ["L1-2", "L1-3"],
        ["R1-4"],
        line => (line.color = "red")
      );
    },
    // 选中线的方法
    checkLines() {
      this.$refs.matchup.checkLines(["L1-1--R1-3", "L1-2--R1-4", "L1-3--R1-4"]);
    },
    // 取消选中线的方法
    unCheckedLines() {
      this.$refs.matchup.unCheckedLines(["L1-1--R1-3", "L1-2--R1-4"]);
    },
    // 清空选中线的方法
    clearCheckedLines() {
      this.$refs.matchup.clearCheckedLines();
    },
    // 选中行的回调
    checkRow(id) {
      console.log(`checkRow ${id}`);
    },
    // 取消选中的回调
    unCheckRow(id) {
      console.log(`unCheckRow ${id}`);
    },
    // 删除线的回调
    deleteFun(id) {
      console.log(`deleteFun ${id}`);
    },
    // 选中线的回调
    checkLine(obj) {
      console.log(`checkLine ${JSON.stringify(obj)}`);
    },
    // 取消选中线的回调
    unCheckLine(obj) {
      console.log(`unCheckLine ${JSON.stringify(obj)}`);
    },
    // 左面板选中改变时的回调
    leftCheckChange(obj) {
      console.log(`leftCheckChange ${JSON.stringify(obj)}`);
      this.$refs.matchup.clearCheckedLines();
    },
    // 右面板选中改变时的回调
    rightCheckChange(obj) {
      console.log(`rightCheckChange ${JSON.stringify(obj)}`);
      this.$refs.matchup.clearCheckedLines();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.matchup.drawLine();
      const decItems = (num) => mock.mock({
        ['array|' + num]: [{
          'lineNo|+1': 1,
          customsLedgerId: null,
          customsLedgerLineNo: 0,
          hsCode: "0101000100",
          name: null,
          'qty1|100-500': 100,
          unit1: /kg|g|ml/
        }]
      })
      const items = (num) => mock.mock({
        ['array|' + num]: [{
          'lineNo|+1': 1,
          sku: null,
          'qty|100-500': 100,
          unit: "PCS",
          nw: { 'weight|100-500': 100, unit: /kg|g|ml/ },
          gw: { 'weight|100-500': 100, unit: /kg|g|ml/ }
        }]
      })
      setTimeout(() => {
        this.decItems = [decItems(15).array, decItems(12).array]
        this.items = [items(20).array];
      }, 1000);
    });
  }
};
</script>

<style>
.collapse-item__wrap {
  max-height: 400px;
}
#app {
  /* height: 600px; */
  overflow: auto;
}
.box {
  /* height: 800px; */
}
</style>


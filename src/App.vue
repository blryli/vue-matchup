<template>
  <div id="app">
    <center>
      <p>
        <el-button @click="link">连接</el-button>
        <el-button @click="linkLine">连接line</el-button>
        <el-button @click="leftCheckRow">左边选中</el-button>
        <el-button @click="rightCheckRow">右边选中</el-button>
        <el-button @click="checkLines">选中线条</el-button>
        <el-button @click="unCheckedLines">清除选中线条</el-button>
        <el-button @click="clearCheckedLines">清空选中线条</el-button>
      </p>
    </center>
    <div class="box">
      <vue-matchup
        popover
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
    <p>lines: {{lines}}</p>
  </div>
</template>

<script>
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
          this.$createElement("p", {}, [data.lineNo])
        ]);
      },
      rightPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, ["message"]),
          this.$createElement("p", {}, [data])
        ]);
      },
      items: [
        {
          lineNo: 1,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "1, 2"
        },
        {
          lineNo: 2,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "4"
        },
        {
          lineNo: 3,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "4"
        },
        {
          lineNo: 4,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "5"
        },
        {
          lineNo: 5,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "6, 7"
        },
        {
          lineNo: 6,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "6, 7"
        },
        {
          lineNo: 7,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "5"
        },
        {
          lineNo: 8,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "5"
        },
        {
          lineNo: 9,
          sku: null,
          qty: 100,
          unit: "PCS",
          nw: { weight: 100, unit: "KG" },
          gw: { weight: 120, unit: "KG" },
          to: "5"
        }
      ],
      decItems: [
        [
          {
            lineNo: 1,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 2,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 3,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 4,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 5,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 6,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 7,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          }
        ],
        [
          {
            lineNo: 1,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 2,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 3,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 4,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 5,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 6,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          },
          {
            lineNo: 7,
            customsLedgerId: null,
            customsLedgerLineNo: 0,
            hsCode: "0101000100",
            name: null,
            qty1: 100,
            unit1: "KG"
          }
        ]
      ],
      lines: [
        { leftId: "L1-1", rightId: "R1-5" },
        { leftId: "L1-3", rightId: "R1-2" }
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
    });
  }
};
</script>

<style lang="scss">
.collapse-item__wrap {
  max-height: 200px;
}
#app {
  height: 600px;
  overflow: auto;
}
.box {
  height: 800px;
}
</style>


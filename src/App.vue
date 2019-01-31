<template>
  <div id="app">
    <center>
      <p>
        <button @click="join">连接</button>
        <button @click="joinLine">连接line</button>
        <button @click="leftCheckRow">左边选中</button>
        <button @click="rightCheckRow">右边选中</button>
        <button @click="setCheckLine">选中线条</button>
      </p>
    </center>
    <vue-matchup
      ref="matchup"
      v-model="lines"
      :leftData="batchData.items"
      :rightData="batchData.decItems"
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
    <div>aaa</div>
    <p>lines: {{lines}}</p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      leftIdFun: (row, index) => `leftId:${index}-${row.lineNo}`,
      rightIdFun: (row, index) => `rightId:${index}-${row.lineNo}`,
      leftPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, [data.lineNo])
        ]);
      },
      rightPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, ["message"]),
          this.$createElement("span", {}, [data])
        ]);
      },
      batchData: {
        batchNo: "123",
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
        ]
      },
      lines: [{leftId: 'L1-1', rightId: 'R1-5'}],
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
      ],
      decItems: []
    };
  },
  methods: {
    // 左面板选中行的方法
    leftCheckRow() {
      this.$refs.matchup.leftCheckRow("leftId:1-1");
    },
    // 右面板选中行的方法
    rightCheckRow() {
      this.$refs.matchup.rightCheckRow("rightId:1-3");
    },
    // 连接的方法
    join() {
      this.$refs.matchup.join();
    },
    joinLine() {
      this.$refs.matchup.join(['leftId:1-1'],['rightId:1-3'], line => line.color = 'red');
    },
    // 选中线的方法
    setCheckLine() {
      this.$refs.matchup.setCheckLine(["leftId:1-1--rightId:1-3", "leftId:1-2--rightId:1-4"]);
    },
    // 设置线color的方法
    setColor(val) {
      this.$refs.matchup.setColor(val);
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
    },
    // 右面板选中改变时的回调
    rightCheckChange(obj) {
      console.log(`rightCheckChange ${JSON.stringify(obj)}`);
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
</style>


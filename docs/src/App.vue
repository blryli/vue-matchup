<template>
  <div id="app">
    <center>
      <p>
        <el-button @click="link">连接</el-button>
        <!-- <el-button @click="linkLine">连接多条</el-button>
        <el-button @click="checkLines">选中多条</el-button>
        <el-button @click="unCheckedLines">取消选中多条</el-button>
        <el-button @click="clearCheckedLines">清空选中线条</el-button> -->
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
          this.$createElement("p", {}, ['序号: '+data.lineNo]),
          this.$createElement("p", {}, ['SKU: '+data.sku]),
          this.$createElement("p", {}, ['数量: '+data.qty]),
          this.$createElement("p", {}, ['单位: ' + data.unit]),
          this.$createElement("p", {}, ['毛重: ' + data.nw.weight + '/' + data.nw.unit])
        ]);
      },
      rightPopoverContentFun: data => {
        return this.$createElement("div", {}, [
          this.$createElement("p", {}, [`序号: ${data.lineNo}`]),
          this.$createElement("p", {}, [`customsLedgerId: ${data.customsLedgerId}`]),
          this.$createElement("p", {}, [`customsLedgerLineNo: ${data.customsLedgerLineNo}`]),
          this.$createElement("p", {}, [`hsCode: ${data.hsCode}`]),
          this.$createElement("p", {}, [`名字: ${data.name}`]),
          this.$createElement("p", {}, [`数量: ${data.qty1}`]),
          this.$createElement("p", {}, [`单位: ${data.unit1}`])
        ]);
      },
      items: [],
      decItems: [],
      lines: [],
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
      const data = mock.mock({
        'color': /red|green|#139bd2/
      })
      this.$refs.matchup.link({color: data.color});
    },
    linkLine() {
      this.$refs.matchup.link(
        {leftIds: ["L1-2", "L1-3", "L1-1"],
        rightIds: ["R1-4"],
        color: "red"}
      );
    },
    // 选中线的方法
    checkLines() {
      this.$refs.matchup.checkLines(["L1-1--R1-3", "L1-2--R1-4", "L1-3--R1-4"]);
    },
    // 取消选中线的方法
    unCheckedLines() {
      this.$refs.matchup.unCheckedLines(["L1-1--R1-3", "L1-2--R1-4", "L1-3--R1-4"]);
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
          customsLedgerId: /1000[1-100]/,
          customsLedgerLineNo: /99[1-100]/,
          hsCode: "0101000100",
          name: '@name',
          'qty1|100-500': 100,
          unit1: /kg|g|ml/
        }]
      })
      const items = (num) => mock.mock({
        ['array|' + num]: [{
          'lineNo|+1': 1,
          sku: '@name',
          'qty|100-500': 100,
          unit: "PCS",
          nw: { 'weight|100-500': 100, unit: /kg|g|ml/ },
          gw: { 'weight|100-500': 100, unit: /kg|g|ml/ }
        }]
      })
      const lines = mock.mock({
        'array|5-8': [{ leftId: /L1-([1-9]|[1-2][0-9])/, rightId: /R1-([1-9]|1[0-9])|R2-([1-9]|1[0-4])/, color: /red|green|#139bd2/ }]
      })
      setTimeout(() => {
        this.decItems = [decItems(20).array, decItems(14).array]
        this.items = [items(30).array];
        this.lines = lines.array
      }, 1000);
    });
  }
};
</script>

<style>
body{
  /* height: 120vh; */
}
.collapse-item__wrap {
  max-height: 620px;
}
#app {
  /* height: 600px; */
  overflow: auto;
}
.box {
  /* height: 800px; */
}
</style>


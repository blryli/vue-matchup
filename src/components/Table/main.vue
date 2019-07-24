<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(d, i) in theadData" :key="i" :width="d.width">
            <div class="cell">{{d.title}}</div>
          </th>
          <td width="1">
            <div class="cell"></div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="table__row"
          :style="{'--lineColor': tableRowPointToColor}"
          v-for="(da, idx) in tbodyData"
          :key="idx"
          :class="{active: handleData.length && handleData[idx].check}"
          @click="clickRow(idx)"
          @mouseenter="mouseenter($event, da, handleData[idx].id)"
          @mouseleave="mouseleave"
        >
          <td v-for="(d, i) in theadData" :key="i">
            <div class="cell">{{getValue(da, d.props)}}</div>
          </td>
          <td :id="(idFun && idFun(da, row + 1)) || `${pos}${row + 1}-${idx + 1}`">
            <div class="cell"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <v-popover
      v-if="popover"
      ref="popover"
      v-model="mouseenterId"
      :position="position"
      :data="popoverContent"
      :pos="pos"
      :enterable="enterable"
      :showBg="showBg"
      @mouseenter="mouseenterPopover"
      @mouseleave="mouseleavePopover"
    ></v-popover>
    <div v-if="!tbodyData.length" class="no-data cell">无数据</div>
  </div>
</template>

<script>
import VPopover from 'components/Popover';
import { offset } from "utils/util";
export default {
  name: "Table",
  components: {
    VPopover
  },
  props: {
    value: Array,
    theadData: Array,
    tbodyData: Array,
    idFun: Function,
    row: Number,
    pos: String,
    popover: Boolean,
    enterable: Boolean,
    hideDelay: Number,
    popoverContentFun: Function,
    tableRowPointToColor: {
      type: String,
      default: 'orange'
    }
  },
  data() {
    return {
      handleData: [],
      position: {
        top: 0,
        center: 0,
        bottom: 0
      },
      mouseenterId: null,
      timeoutPending: null,
      popoverContent: null,
      timeoutBg: null,
      showBg: false
    };
  },
  methods: {
    init() {
      this.tbodyData.forEach((d, i) => {
        const id =
          (this.idFun && this.idFun(d, this.row + 1)) ||
          `${this.pos}${this.row + 1}-${i + 1}`;
        this.handleData.push({ id: id, check: false });
      });
      this.popover && this.$refs.popover.init();
    },
    checkRow(id) {
      const index = this.handleData.findIndex(d => d.id === id);
      index !== -1 && this.clickRow(index);
    },
    clickRow(idx) {
      this.handleData[idx].check = !this.handleData[idx].check;
      const checkIds = [];
      this.handleData.forEach(d => {
        d.check && checkIds.push(d.id);
      });
      this.$emit("checkChange", checkIds, this.row);
      this.handleData[idx].check
        ? this.$emit("checkRow", this.handleData[idx].id)
        : this.$emit("unCheckRow", this.handleData[idx].id);
    },
    clearChecked() {
      this.handleData.forEach(d => {
        d.check = false;
      });
      this.$emit("checkChange", [], this.row);
    },
    mouseenter(e, obj, id) {
      if (this.enterable) {
        clearTimeout(this.timeoutBg);
        this.showBg = true;
        clearTimeout(this.timeoutPending);
        this.setMouseenterTarget(e.target, obj, id);
      } else {
        this.setMouseenterTarget(e.target, obj, id);
      }
    },
    setMouseenterTarget(node, obj, id) {
      if (!this.popover || !this.popoverContentFun) return;
      const top = offset(node).top;
      const left = offset(node).left;
      const bottom = node.offsetHeight + top;
      const center = node.offsetWidth / 2 + left;
      this.position = { top: top, center: center, bottom: bottom };
      this.mouseenterId = id;
      this.popoverContent = this.popoverContentFun(obj);
    },
    mouseleave() {
      if (this.enterable) {
        this.timeoutBg = setTimeout(() => {
          this.showBg = false;
        }, this.hideDelay);
        this.timeoutPending = setTimeout(() => {
          this.mouseenterId = null;
        }, this.hideDelay);
      } else {
        this.mouseenterId = null;
      }
    },
    mouseenterPopover() {
      clearTimeout(this.timeoutBg);
      this.showBg = true;
      clearTimeout(this.timeoutPending);
    },
    mouseleavePopover() {
      this.timeoutBg = setTimeout(() => {
        this.showBg = false;
      }, this.hideDelay);
      this.timeoutPending = setTimeout(() => {
        this.mouseenterId = null;
      }, this.hideDelay);
    },
    getValue(data, props) {
      const arr = props.split("/");
      let value = null;
      arr.forEach(d => {
        value = value ? value[d] : data[d];
      });
      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  table-layout: fixed;
  border-collapse: separate;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
  thead {
    color: #909399;
    font-weight: 500;
  }
  tbody {
    position: relative;
  }
  th {
    user-select: none;
  }
  td,
  th {
    padding: 6px 0;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    background-color: #fff;
    border-bottom: 1px solid #dfe2e9;
  }
  .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
  th > .cell {
    position: relative;
    word-wrap: normal;
    vertical-align: middle;
    width: 100%;
  }
  th > .cell,
  th div {
    display: inline-block;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }
}
table {
  -webkit-border-horizontal-spacing: 0px;
  -webkit-border-vertical-spacing: 0px;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
}
.table__row {
  position: relative;
  background-color: #fff;
  &:hover {
    background-color: #f5f7fa;
  }
  &.active {
    background-color: #71b6fc;
    color: #fff;
  }
  td {
    background-color: transparent;
  }
}
.no-data {
  padding: 10px 0;
  text-align: center;
  color: #888;
}
.line-check{
  background-color: var(--lineColor);
}
</style>


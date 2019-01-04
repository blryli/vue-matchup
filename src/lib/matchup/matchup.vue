<template>
  <div class="wrap" ref="wrap">
    <div class="header" ref="header">
      <div class="handle">
        <span>left</span>
        <div class="input">
          <input class="input__inner" v-model="leftValue" placeholder="列：1-1" type="text">
        </div>
        <span class="m-l-10">right</span>
        <div class="input">
          <input class="input__inner" v-model="rightValue" placeholder="列：1-1" type="text">
        </div>
        <button type="button" class="button button--primary" @click="join">连接</button>
      </div>
      <div class="attr">
        <slot :disabled="disabled">{{disabled}}</slot>
      </div>
    </div>
    <div class="left" ref="left" :style="{width: `calc(50% - ${width/2+5}px)`}">
      <div class="card">
        <collapse v-model="leftActiveName" :accordion="collapseAccordion" @change="collapseChange">
          <collapse-item
            v-for="(d, i) in realLeftData"
            :key="i"
            :title="`${leftTitle} ${(i + 1)}`"
            :name="`${i + 1}`"
            scrollDir="left"
          >
            <r-table
              :row="i"
              ref="leftTable"
              :theadData="leftThead"
              :tbodyData="d"
              @checkChange="leftCheckChange($event, i)"
            ></r-table>
          </collapse-item>
        </collapse>
      </div>
    </div>
    <div class="center" :style="{width: `${width}px`}">
      <canves
        ref="canves"
        :width="width"
        :height="height"
        :value="lines"
        :leftCheckedIds="leftCheckedIds"
        :rightCheckedIds="rightCheckedIds"
        :leftActiveName="leftActiveName"
        :rightActiveName="rightActiveName"
        @click="clickLine"
        @input="input"
      />
    </div>
    <div class="right" ref="right" id="right" :style="{width: `calc(50% - ${width/2+5}px)`}">
      <div class="card">
        <collapse v-model="rightActiveName" :accordion="collapseAccordion" @change="collapseChange">
          <collapse-item
            v-for="(d, i) in realRightData"
            :key="i"
            :title="`${rightTitle} ${(i + 1)}`"
            :name="`${i + 1}`"
          >
            <r-table
              v-model="rightChecked"
              ref="rightTable"
              :row="i"
              :theadData="rightThead"
              :tbodyData="d"
              @checkChange="rightCheckChange($event, i)"
            ></r-table>
          </collapse-item>
        </collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { offset, scroll } from "../../utils/util";
import { on, off } from "../../utils/dom";
export default {
  name: "vue-matchup",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    leftData: {
      type: Array,
      default: () => []
    },
    rightData: {
      type: Array,
      default: () => []
    },
    leftThead: {
      type: Array,
      default: () => []
    },
    rightThead: {
      type: Array,
      default: () => []
    },
    leftTitle: {
      type: String,
      default: "left"
    },
    rightTitle: {
      type: String,
      default: "right"
    },
    collapseAccordion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      color: "",
      leftChecked: [],
      rightChecked: [],
      width: 200,
      height: 100,
      leftActiveName: ["1"],
      rightActiveName: ["1"],
      rightBox: [],
      rightBox: [],
      leftHeader: [],
      leftContent: [],
      rightHeader: [],
      rightContent: [],
      leftCheckedIds: [],
      rightCheckedIds: [],
      time: 300,
      accordion: true,
      leftValue: "",
      rightValue: "",
      scrollTargets: [],
      activeData: {},
      disabled: true
    };
  },
  computed: {
    lines() {
      return this.value;
    },
    realLeftData() {
      return Array.isArray(this.leftData[0]) ? this.leftData : [this.leftData];
    },
    realRightData() {
      return Array.isArray(this.rightData[0]) ? this.rightData : [this.rightData];
    }
  },
  watch: {
    activeData(val, oldVal) {
      val.id ? this.$emit("select", val.id) : this.$emit("unselect", oldVal);
    },
    leftChecked(val) {
      this.leftCheckedIds = Array.prototype.concat.apply([], val);
      this.$emit("checked-change", {
        left: this.leftCheckedIds,
        right: this.rightCheckedIds
      });
    },
    rightChecked(val) {
      this.rightCheckedIds = Array.prototype.concat.apply([], val);
      this.$emit("checked-change", {
        left: this.leftCheckedIds,
        right: this.rightCheckedIds
      });
    },
    leftValue(val) {
      if (val && val.indexOf("-") !== -1) {
        const arr = val.split("-");
        const listIndex = parseInt(arr[0]) - 1;
        const itemIndex = parseInt(arr[1]) - 1;
        if (
          arr.length === 2 &&
          this.leftData[listIndex] &&
          this.leftData[listIndex][itemIndex]
        ) {
          this.leftChecked[listIndex].push(val);
          this.$refs.leftTable[listIndex].clickRow(itemIndex);
        }
      }
    },
    rightValue(val) {
      if (val && val.indexOf("-") !== -1) {
        const arr = val.split("-");
        const listIndex = parseInt(arr[0]) - 1;
        const itemIndex = parseInt(arr[1]) - 1;
        if (
          arr.length === 2 &&
          this.rightData[listIndex] &&
          this.rightData[listIndex][itemIndex]
        ) {
          this.rightChecked[listIndex].push(val);
          this.$refs.rightTable[listIndex].clickRow(itemIndex);
        }
      }
    }
  },
  methods: {
    input(val) {
      this.$emit("input", val);
    },
    leftCheckChange(checkeds, i) {
      this.leftChecked.splice(i, 1, checkeds);
    },
    rightCheckChange(checkeds, i) {
      this.rightChecked.splice(i, 1, checkeds);
    },
    drawLine() {
      this.$refs.canves.drawLine();
    },
    // 连接
    join() {
      this.$refs.canves.join();
      this.leftValue = "";
      this.rightValue = "";
      this.leftCheckedIds = [];
      this.rightCheckedIds = [];
      this.$refs.leftTable.forEach(d => {
        d.clearCheck();
      });
      this.$refs.rightTable.forEach(d => {
        d.clearCheck();
      });
    },
    delete() {
      this.$refs.canves.delete();
    },
    scrollChange(event, index) {
      if (!this.lines.length) return;
      this.drawLine();
    },
    collapseChange() {
      if (!this.lines.length) return;
      const timer = setInterval(() => {
        this.setHeight();
        setTimeout(() => {
          this.drawLine();
        }, 0);
      }, 12);
      setTimeout(() => {
        clearTimeout(timer);
      }, this.time);
    },
    clickLine(val) {
      this.activeData = val;
      this.disabled = !val.id;
    },
    // 调整canves高度
    setHeight() {
      const left = this.$refs.left;
      const right = this.$refs.right;
      this.height =
        left.offsetHeight > right.offsetHeight
          ? left.offsetHeight
          : right.offsetHeight;
    },
    windowScroll() {
      if (!this.$refs.header || !this.$refs.wrap) return;
      let scrollTop = scroll().top;
      this.scrollTargets.forEach(d => {
        scrollTop += d.scrollTop;
      });
      if (scrollTop > offset(this.$refs.wrap).top) {
        this.$refs.header.style.top =
          scrollTop - offset(this.$refs.wrap).top + "px";
      } else {
        this.$refs.header.style.top !== 0 && (this.$refs.header.style.top = 0);
      }
    },
    setColor(color) {
      this.$refs.canves.setColor(color);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftHeader = this.$refs.left.querySelectorAll(
        ".collapse-item__header"
      );
      this.leftContent = this.$refs.left.querySelectorAll(
        ".collapse-item__wrap"
      );
      this.rightHeader = this.$refs.right.querySelectorAll(
        ".collapse-item__header"
      );
      this.rightContent = this.$refs.right.querySelectorAll(
        ".collapse-item__wrap"
      );
      this.leftHeader.forEach(d => {
        this.leftChecked.push([]);
      });
      this.rightHeader.forEach(d => {
        this.rightChecked.push([]);
      });
      setTimeout(() => {
        this.setHeight();
      }, this.time + 1);

      this.leftContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });
      this.rightContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });

      let parent = this.$refs.header.parentNode;
      while (parent !== document.body) {
        if (parent.scrollHeight !== parent.offsetHeight) {
          on(parent, "scroll", this.windowScroll);
          this.scrollTargets.push(parent);
        }
        parent = parent.parentNode;
      }
      on(window, "scroll", this.windowScroll);
    });
  },
  beforeDestroy() {
    this.leftContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    this.rightContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
#app {
  width: 100%;
  overflow: hidden;
}
.wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding-top: 50px;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  height: 50px;
  font-size: 0;
  z-index: 110;
  span {
    display: inline-block;
    font-size: 12px;
    margin-right: 5px;
    color: #888;
  }
}
.m-l-10 {
  margin-left: 10px;
}
.handle,
.attr {
  display: inline-block;
  width: 50%;
  padding: 9px 10px;
  font-size: 12px;
}
.handle {
  position: relative;
  border-right: 1px solid #ebeef5;
}
.center {
  position: relative;
  min-height: 100px;
}
.left,
.center,
.right {
  display: inline-block;
}
.left,
.right {
  vertical-align: top;
}
.card {
  background-color: #fff;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  overflow: hidden;
}
.el-table-column--selection.is-leaf {
  .el-checkbox__input {
    display: none;
  }
}
.input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  min-width: 60px;
  width: 25%;
}
.input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 30px;
  line-height: 30px;
  outline: none;
  padding: 0 10px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  &:focus {
    outline: none;
    border-color: #409eff;
  }
}
.button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 7px 12px;
  font-size: 14px;
  border-radius: 4px;
}
.button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.w-100 {
  width: 100px;
}
input::-webkit-input-placeholder {
  color: #ccc;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ccc;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ccc;
}
</style>

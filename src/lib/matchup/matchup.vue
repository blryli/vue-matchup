<template>
  <div
    class="matchup"
    ref="wrap"
    :class="{full: fullEdition}"
    :style="{'min-height': fullEdition ? minHeight : ''}"
  >
    <div
      v-if="fullEdition"
      class="matchup__header"
      ref="header"
      :style="{width: `calc(100% - ${sidebarUseWidth}px)`}"
    >
      <div class="matchup__header-handle">
        <ul>
          <li @click="join">匹配</li>
          <li class="hr">|</li>
          <li>全部匹配</li>
          <li class="hr">|</li>
          <li>清空</li>
          <li ref="dbArrow" class="f-r db-arrow" @click="sidebarWidthChange"></li>
        </ul>
      </div>
    </div>
    <div
      class="matchup__body"
      ref="matchupBody"
      :style="{width: fullEdition ? `calc(100% - ${sidebarUseWidth}px)` : ''}"
    >
      <div class="left" ref="left" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
        <div class="card">
          <collapse
            v-model="leftActiveName"
            :accordion="collapseAccordion"
            @change="collapseChange"
          >
            <collapse-item
              v-for="(d, i) in realLeftData"
              :key="i"
              :title="`${showTitle(leftTitle, i)}`"
              :name="`${i + 1}`"
              scrollDir="left"
              :duration="duration"
              :dataChange="leftDataChange"
            >
              <r-table
                :row="i"
                ref="leftTable"
                :theadData="leftThead"
                :tbodyData="d"
                :idFun="leftIdFun"
                :popover="popover"
                :enterable="popoverEnterable"
                :hideDelay="popoverHideDelay"
                :popoverContentFun="leftPopoverContentFun"
                pos="L"
                @checkChange="leftCheckChange"
                @checkRow="checkRow"
                @unCheckRow="unCheckRow"
              ></r-table>
            </collapse-item>
          </collapse>
        </div>
      </div>
      <div class="center" :style="{width: `${cvsWidth}px`}">
        <m-canves
          ref="canves"
          :width="cvsWidth"
          :height="height"
          :value="value"
          :leftCheckedIds="leftCheckedIds"
          :rightCheckedIds="rightCheckedIds"
          :leftActiveName="leftActiveName"
          :rightActiveName="rightActiveName"
          :duration="duration"
          :fullEdition="fullEdition"
          @click="clickLine"
          @delete="deleteLine"
          @checkLine="cvsCheckLine"
          @unCheckLine="cvsUnCheckLine"
        />
      </div>
      <div class="right" ref="right" id="right" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
        <div class="card">
          <collapse
            v-model="rightActiveName"
            :accordion="collapseAccordion"
            @change="collapseChange"
          >
            <collapse-item
              v-for="(d, i) in realRightData"
              :key="i"
              :title="`${showTitle(rightTitle, i)}`"
              :name="`${i + 1}`"
              :duration="duration"
              :dataChange="rightDataChange"
            >
              <r-table
                v-model="rightChecked"
                ref="rightTable"
                :row="i"
                :theadData="rightThead"
                :tbodyData="d"
                :idFun="rightIdFun"
                :popover="popover"
                :enterable="popoverEnterable"
                :hideDelay="popoverHideDelay"
                :popoverContentFun="rightPopoverContentFun"
                pos="R"
                @checkChange="rightCheckChange"
                @checkRow="checkRow"
                @unCheckRow="unCheckRow"
              ></r-table>
            </collapse-item>
          </collapse>
        </div>
      </div>
    </div>
    <m-sidebar
      v-if="fullEdition"
      :sidebarWidth="sidebarWidth"
      :sidebarUseWidth="sidebarUseWidth"
      :groups="groups"
      :fullEdition="fullEdition"
    ></m-sidebar>
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
    leftTitle: [Array, String],
    rightTitle: [Array, String],
    leftIdFun: Function,
    rightIdFun: Function,
    collapseAccordion: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 300
    },
    sidebarWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: String,
      default: "600px"
    },
    fullEdition: {
      type: Boolean,
      default: false
    },
    popover: {
      type: Boolean,
      default: false
    },
    popoverEnterable: {
      type: Boolean,
      default: false
    },
    popoverHideDelay: {
      type: Number,
      default: 200
    },
    leftPopoverContentFun: Function,
    rightPopoverContentFun: Function
  },
  data() {
    return {
      color: "",
      leftChecked: [],
      rightChecked: [],
      cvsWidth: 200,
      height: 200,
      sidebarUseWidth: this.sidebarWidth,
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
      accordion: true,
      activeData: {},
      leftDataChange: false,
      rightDataChange: false,
      ny: 0,
      rotYINT: null,
      headerParent: [],
    };
  },
  computed: {
    lines() {
      return this.value;
    },
    // groups() {
    //   if (this.fullEdition) {
    //     let groups = [
    //       { label: "多对一", children: [] },
    //       { label: "一对多", children: [] }
    //     ];
    //     this.lines.forEach(d => {
    //       groups.forEach(g => {
    //         if (d.type === g.label) {
    //           const obj = {
    //             leftId: d.leftId,
    //             rightId: d.rightId,
    //           };
    //           // d.groups ? obj.label = d.groups : obj.children = [{label: `L ${}`}]
    //           g.children.push({
    //             leftId: d.leftId,
    //             rightId: d.rightId,
    //             label: d.group
    //           });
    //         }
    //       });
    //     });
    //     return groups;
    //   } else return [];
    // },
    realLeftData() {
      return Array.isArray(this.leftData[0]) ? this.leftData : [this.leftData];
    },
    realRightData() {
      return Array.isArray(this.rightData[0])
        ? this.rightData
        : [this.rightData];
    }
  },
  watch: {
    leftData() {
      this.leftDataChange = true;
    },
    rightData() {
      this.rightDataChange = true;
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.leftTable.forEach(d => {
          d.init();
        })
        this.$refs.rightTable.forEach(d => {
          d.init();
        })
        this.setHeight();
        setTimeout(() => {
          this.drawLine();
        }, 0)
      })
    },
    showTitle(title, i) {
      if (typeof title === "string") {
        return title;
      } else {
        return title[i] || title[0];
      }
    },
    deleteLine(index) {
      this.$emit("delete", this.lines[index].id || `${this.lines[index].leftId}--${this.lines[index].rightId}`);
      this.lines.splice(index, 1);
      this.$emit("input", this.lines);
      this.drawLine();
    },
    leftCheckChange(checkeds, i) {
      this.leftChecked.splice(i, 1, checkeds);
      this.leftCheckedIds = this.leftChecked.flat();
      this.$emit('leftCheckChange', this.leftCheckedIds)
    },
    rightCheckChange(checkeds, i) {
      this.rightChecked.splice(i, 1, checkeds);
      this.rightCheckedIds = this.rightChecked.flat();
      this.$emit('rightCheckChange', this.rightCheckedIds)
    },
    drawLine() {
      this.$refs.canves.drawLine();
    },
    // 选中行
    leftCheckRow(id) {
      this.$refs.leftTable.forEach(d => {
        d.checkRow(id);
      })
    },
    rightCheckRow(id) {
      this.$refs.rightTable.forEach(d => {
        d.checkRow(id);
      })
    },
    checkRow(id) {
      this.$emit('checkRow', id);
    },
    unCheckRow(id) {
      this.$emit('unCheckRow', id);
    },
    checkLines(ids) {
      this.$refs.canves.checkLines(ids)
    },
    unCheckedLines(ids) {
      this.$refs.canves.unCheckedLines(ids)
    },
    clearCheckedLines() {
      this.$refs.canves.clearCheckedLines()
    },
    cvsCheckLine(val) {
      this.$emit('checkLine', val);
    },
    cvsUnCheckLine(val) {
      this.$emit('unCheckLine', val)
    },
    // 建立连接关系
    join(leftCheckedIds, rightCheckedIds, setAttr) {
      leftCheckedIds = leftCheckedIds || this.leftCheckedIds;
      rightCheckedIds = rightCheckedIds || this.rightCheckedIds;
      // if (!leftCheckedIds.length || !rightCheckedIds.length) {
      //   this.$info("必须左右两边都有选中项才能匹配！");
      //   return;
      // }
      // if (leftCheckedIds.length > 1 && rightCheckedIds.length > 1) {
      //   this.$info("左右两边选中项不能同时有多个！");
      //   return;
      // }
      if (leftCheckedIds.length === 1 && rightCheckedIds.length === 1) {
        const leftId = leftCheckedIds[0];
        const rightId = rightCheckedIds[0];
        this.doLine(leftId, rightId, setAttr, "一对一");
      }
      if (leftCheckedIds.length > 1 && rightCheckedIds.length === 1) {
        leftCheckedIds.forEach(d => {
          const leftId = d;
          const rightId = rightCheckedIds[0];
          this.doLine(leftId, rightId, setAttr, "多对一");
        });
      }
      if (leftCheckedIds.length === 1 && rightCheckedIds.length > 1) {
        rightCheckedIds.forEach(d => {
          const leftId = leftCheckedIds[0];
          const rightId = d;
          this.doLine(leftId, rightId, setAttr, "一对多");
        });
      }
      this.clearChecked();
    },
    doLine(leftId, rightId, setAttr, type) {
      // console.log(`line type ${type}`);
      let line = {
        leftId: leftId,
        rightId: rightId
      };
      if (this.fullEdition) {
        line.type = type;
        this.groupsId += 1;
        line.group = `组 ${this.groupsId}`;
      }
      setAttr &&
        (typeof setAttr === "function"
          ? setAttr(line)
          : console.error("必须是函数"));
      this.lines.push(line);
      this.$emit('input', this.lines)
      this.drawLine();
    },
    // 清空
    clearChecked() {
      this.leftCheckedIds = [];
      this.rightCheckedIds = [];
      this.$refs.leftTable.forEach(d => {
        d.clearChecked();
      });
      this.$refs.rightTable.forEach(d => {
        d.clearChecked();
      });
    },
    scrollChange(event, index) {
      if (!this.value.length) return;
      this.drawLine();
    },
    collapseChange() {
      if (!this.value.length) {
        setTimeout(() => {
          this.setHeight();
        }, this.duration);
        return;
      }
      this.setHeight();
    },
    clickLine(val) {
      this.activeData = val;
    },
    // 调整canves高度
    setHeight() {
      const timer = setInterval(() => {
        const left = this.$refs.left;
        const right = this.$refs.right;
        this.height =
          left.offsetHeight > right.offsetHeight
            ? left.offsetHeight
            : right.offsetHeight;
        setTimeout(() => {
          this.drawLine();
        }, 0);
      }, 12);
      setTimeout(() => {
        clearTimeout(timer);
      }, this.duration);
    },
    windowScroll() {
      if (!this.fullEdition || !this.$refs.header || !this.$refs.wrap) return;
      let scrollTop = scroll().top;
      if (scrollTop > offset(this.$refs.wrap).top) {
        this.$refs.header.style.top = this.$refs.sidebar.style.top =
          scrollTop - offset(this.$refs.wrap).top + "px";
      } else {
        if (this.$refs.header.style.top !== 0) {
          this.$refs.header.style.top = 0;
          this.$refs.sidebar.style.top = 0;
        }
      }
    },
    sidebarWidthChange() {
      this.sidebarUseWidth =
        this.sidebarUseWidth === 10 ? this.sidebarWidth : 10;
      clearInterval(this.rotYINT);
      this.rotYINT = setInterval(() => {
        this.startYRotate(this.$refs.dbArrow);
      }, 10);
    },
    startYRotate(y) {
      this.ny = this.ny + 5;
      y.style.transform = `rotateY(${this.ny}deg)`;
      y.style.webkitTransform = `rotateY(${this.ny}deg)`;
      y.style.OTransform = `rotateY(${this.ny}deg)`;
      y.style.MozTransform = `rotateY(${this.ny}deg)`;
      if (this.ny == 180 || this.ny >= 360) {
        clearInterval(this.rotYINT);
        if (this.ny >= 360) {
          this.ny = 0;
        }
      }
    },
    headerOnScroll() {
      let parent = this.$refs.header.parentNode;
      while (parent !== document.body) {
        if (parent.scrollHeight !== parent.offsetHeight) {
          this.headerParent.push(parent);
        }
        parent = parent.parentNode;
      }
      this.headerParent.forEach(d => {
        on(d, "scroll", this.windowScroll);
      });
      on(window, "scroll", this.windowScroll);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftHeader = Array.from(this.$refs.left.querySelectorAll(
        ".collapse-item__header"
      ));
      this.leftContent = Array.from(this.$refs.left.querySelectorAll(
        ".collapse-item__wrap"
      ));
      this.rightHeader = Array.from(this.$refs.right.querySelectorAll(
        ".collapse-item__header"
      ));
      this.rightContent = Array.from(this.$refs.right.querySelectorAll(
        ".collapse-item__wrap"
      ));
      this.leftHeader.forEach(d => {
        this.leftChecked.push([]);
      });
      this.rightHeader.forEach(d => {
        this.rightChecked.push([]);
      });
      setTimeout(() => {
        this.setHeight();
      }, this.duration + 1);

      this.leftContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });
      this.rightContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });

      this.fullEdition && this.headerOnScroll();
    });
  },
  beforeDestroy() {
    this.leftContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    this.rightContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    if (this.fullEdition) {
      this.headerParent.forEach(d => {
        off(d, "scroll", this.windowScroll);
      });
      off(window, "scroll", this.windowScroll);
    }
  }
};
</script>

<style lang="scss">
.matchup {
  position: relative;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  * {
    font-size: 12px;
    box-sizing: border-box;
  }
  &.full {
    padding-top: 50px;
    border: 1px solid #dfe2e9;
    border-radius: 4px;
    background-color: #f5f5f5;
    box-shadow: 0 1px 5px rgba($color: #000000, $alpha: 0.1);
  }
}
.matchup__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom: 1px solid #dfe2e9;
  height: 50px;
  line-height: 50px;
  font-size: 0;
  z-index: 110;
  transition: width 0.3s;
  span {
    display: inline-block;
    font-size: 12px;
    margin-right: 5px;
    color: #888;
  }
}
.full.matchup__body {
  position: relative;
  padding: 10px;
  transition: width 0.3s;
}
.m-l-10 {
  margin-left: 10px;
}
.matchup__header-handle {
  ul {
    padding: 0;
    margin: 0;
    padding: 0 20px;
  }
  li {
    padding: 0 5px;
    list-style: none;
    display: inline-block;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      color: #139de2;
    }
  }
  .hr {
    color: #dfe2e9;
  }
  .db-arrow {
    float: right;
    position: relative;
    margin: 4.5px -15px 0 0;
    padding: 20px;
    background-color: #f5f5f5;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 15px;
      display: block;
      width: 10px;
      height: 10px;
      border-top: 1px solid #888;
      border-right: 1px solid #888;
      transform: rotate(45deg);
      transition: transform 0.3s;
    }
    &::before {
      right: 13px;
    }
    &::after {
      right: 20px;
    }
    &:hover {
      &::before,
      &::after {
        border-color: #139bd2;
      }
    }
  }
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
  border-radius: 4px;
  border: 1px solid #dfe2e9;
  background-color: #fff;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  overflow: hidden;
}
.matchup-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  min-width: 60px;
  width: 25%;
}
.matchup-input__inner {
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
.matchup-button {
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
.matchup-button--primary:hover {
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

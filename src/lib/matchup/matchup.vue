<template>
  <div class="matchup" ref="matchup">
    <div class="left" ref="left" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
      <div class="card">
        <collapse v-model="leftActiveName" :accordion="collapseAccordion" @change="collapseChange">
          <collapse-item
            ref="left-collapse-item"
            v-for="(d, i) in realLeftData"
            :key="i"
            :title="`${showTitle(leftTitle, i)}`"
            :name="`${i + 1}`"
            scrollDir="left"
            :duration="duration"
          >
            <r-table
              :row="i"
              ref="left-table"
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
    <div class="center" :style="{width: `${cvsWidth}px`,height: `${height}px`}">
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
        :loadFinish="loadFinish"
        @delete="deleteLine"
        @checkLine="cvsCheckLine"
        @unCheckLine="cvsUnCheckLine"
      />
    </div>
    <div class="right" ref="right" id="right" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
      <div class="card">
        <collapse v-model="rightActiveName" :accordion="collapseAccordion" @change="collapseChange">
          <collapse-item
            ref="right-collapse-item"
            v-for="(d, i) in realRightData"
            :key="i"
            :title="`${showTitle(rightTitle, i)}`"
            :name="`${i + 1}`"
            :duration="duration"
          >
            <r-table
              v-model="rightChecked"
              ref="right-table"
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
</template>

<script>
import { offset, scroll } from "../../utils/util";
import { on, off } from "../../utils/dom";
import Handle from "./handle";

export default {
  name: "vue-matchup",
  mixins: [Handle],
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
      default: 400
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
      headerParent: []
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
      return Array.isArray(this.rightData[0])
        ? this.rightData
        : [this.rightData];
    },
    loadFinish() {
      return !!(this.leftData.length && this.rightData.length);
    }
  },
  watch: {
    lines(val) {
      val && this.loadFinish && this.drawLine();
    },
    leftData(val) {
      this.leftDataChange = true;
      val && this.loadFinish && this.init();
    },
    rightData(val) {
      this.rightDataChange = true;
      val && this.loadFinish && this.init();
    }
  },
  methods: {
    init() {
      console.log("component init...");
      this.$nextTick(() => {
        this.$refs.canves.init();
        this.$refs["left-collapse-item"].forEach(d => {
          d.init();
        });
        this.$refs["right-collapse-item"].forEach(d => {
          d.init();
        });
        this.$refs["left-table"].forEach(d => {
          d.init();
        });
        this.$refs["right-table"].forEach(d => {
          d.init();
        });
        !this.leftData.length && (this.leftActiveName = []);
        !this.rightData.length && (this.rightActiveName = []);
        setTimeout(() => {
          !this.leftData.length && (this.leftActiveName = ["1"]);
          !this.rightData.length && (this.rightActiveName = ["1"]);
          this.redrawLine();
        }, 0);
      });
    },
    drawLine() {
      this.$refs.canves.drawLine();
    },
    showTitle(title, i) {
      if (typeof title === "string") {
        return title;
      } else {
        return title[i] || title[0];
      }
    },
    scrollChange(event) {
      if (!this.value.length) return;
      this.drawLine();
    },
    collapseChange() {
      if (!this.value.length) {
        setTimeout(() => {
          this.redrawLine();
        }, this.duration);
        return;
      }
      this.redrawLine();
    },
    // 重绘/调整canves高度
    redrawLine() {
      if (!this.lines.length || !this.loadFinish) return;
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
      }, 10);
      setTimeout(() => {
        clearTimeout(timer);
        this.$refs.canves.clearActiveName();
      }, this.duration);
    },
    sizeChange() {
      this.drawLine();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftHeader = Array.from(
        this.$refs.left.querySelectorAll(".collapse-item__header")
      );
      this.leftContent = Array.from(
        this.$refs.left.querySelectorAll(".collapse-item__wrap")
      );
      this.rightHeader = Array.from(
        this.$refs.right.querySelectorAll(".collapse-item__header")
      );
      this.rightContent = Array.from(
        this.$refs.right.querySelectorAll(".collapse-item__wrap")
      );
      this.leftHeader.forEach(d => {
        this.leftChecked.push([]);
      });
      this.rightHeader.forEach(d => {
        this.rightChecked.push([]);
      });
      this.init();

      this.leftContent.forEach(d => {
        on(d, "scroll", this.scrollChange);
      });
      this.rightContent.forEach(d => {
        on(d, "scroll", this.scrollChange);
      });
      on(window, "resize", this.sizeChange);
    });
  },
  beforeDestroy() {
    this.leftContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    this.rightContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    off(window, "resize", this.sizeChange);
  }
};
</script>

<style lang="scss">
.matchup {
  width: 100%;
}
.center {
  position: relative;
  height: 100%;
  min-height: 100px;
  overflow: hidden;
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
</style>

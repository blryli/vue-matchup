<template>
  <div class="canves-group">
    <canvas
      ref="canvas"
      class="canvas"
      :width="width"
      :height="height"
      @mousemove="move($event)"
      @mouseleave="leave"
      @click="click($event)"
      @dblclick="dblclick($event)"
    ></canvas>
    <input
      class="flows__handle-input"
      :style="inputStyle"
      type="text"
      ref="input"
      @keyup.delete="deleted(null)"
    >
  </div>
</template>

<script>
import { getDomClientRect, getParentNodes, enableEventListener, removeEventListener } from "utils/dom";
import Graph from "./graph";
import Handle from "./handle";

export default {
  name: "Canves",
  mixins: [Graph, Handle],
  props: {
    width: Number,
    value: {
      type: Array,
      default: () => []
    },
    leftCheckedIds: {
      type: Array,
      default: () => []
    },
    rightCheckedIds: {
      type: Array,
      default: () => []
    },
    leftActiveName: Array,
    rightActiveName: Array,
    height: {
      type: Number,
      default: 50
    },
    duration: {
      type: Number,
      default: 300
    },
    activeColor: {
      type: String,
      default: "#139BD4"
    },
    loadFinish: Boolean
  },
  data() {
    return {
      elTop: 0,
      canvas: "",
      ctx: "",
      leftActiveNameOld: JSON.parse(JSON.stringify(this.leftActiveName)),
      leftCloseName: null,
      leftOpenName: null,
      rightActiveNameOld: JSON.parse(JSON.stringify(this.rightActiveName)),
      rightCloseName: null,
      rightOpenName: null,
      drawNum: 0,
      groupsId: 0
    };
  },
  computed: {
    lines() {
      return JSON.parse(JSON.stringify(this.value)) || [];
    },
    inputStyle() {
      let style = {};
      if (!this.lineCheckedId) {
        style.cssText = "display:none";
        return style;
      }
      const line = this.lines.find(l => l.id === this.lineCheckedId);
      const top = line.y1 > line.y2 ? `${line.y2}px` : `${line.y1}px`;
      style.cssText = `top:${top};display:block;`;
      return style;
    }
  },
  watch: {
    leftActiveName(newVal) {
      this.leftOpenName = newVal.filter(
        newV => !this.leftActiveNameOld.find(old => old === newV)
      )[0];
      this.leftCloseName = this.leftActiveNameOld.filter(
        old => !newVal.find(newV => old === newV)
      )[0];
      this.rightCloseName && (this.rightCloseName = null);
      this.rightOpenName && (this.rightOpenName = null);
      this.leftActiveNameOld = JSON.parse(JSON.stringify(newVal));
      this.drawNum = 0;
    },
    rightActiveName(newVal) {
      this.rightOpenName = newVal.filter(
        newV => !this.rightActiveNameOld.find(old => old === newV)
      )[0];
      this.rightCloseName = this.rightActiveNameOld.filter(
        old => !newVal.find(newV => old === newV)
      )[0];
      this.leftOpenName && (this.leftOpenName = null);
      this.leftCloseName && (this.leftCloseName = null);
      this.rightActiveNameOld = JSON.parse(JSON.stringify(newVal));
      this.drawNum = 0;
    }
  },
  methods: {
    clearActiveName() {
      this.rightCloseName && (this.rightCloseName = null);
      this.rightOpenName && (this.rightOpenName = null);
      this.leftOpenName && (this.leftOpenName = null);
      this.leftCloseName && (this.leftCloseName = null);
    },
    // 画线
    drawLine() {
      if (!this.lines.length || !this.loadFinish) {
        this.readyLines = [];
        return;
      }
      this.readyLines = [];
      const leftHeader = this.$parent.$data.leftHeader;
      const rightHeader = this.$parent.$data.rightHeader;
      const leftContent = this.$parent.$data.leftContent;
      const rightContent = this.$parent.$data.rightContent;
      if (!leftContent || !rightContent) return;
      this.lines.forEach(line => {
        const leftItem = document.getElementById(line.leftId);
        const rightItem = document.getElementById(line.rightId);
        const leftIndex = leftContent.findIndex(d => d.contains(leftItem));
        const rightIndex = rightContent.findIndex(d => d.contains(rightItem));
        !line.id && (line.id = `${line.leftId}--${line.rightId}`);
        line.x1 = 5;
        line.x2 = this.width - 6;
        line.color = line.color || "#555";
        const leftRect = getDomClientRect(leftItem)
        let y1 = leftRect.centerY
        const gY1 = y1;
        const rightRect = getDomClientRect(rightItem)
        let y2 = rightRect.centerY
        const gY2 = y2;

        this.drawNum++;
        const collapseMaxHeight = this.$parent.$props.collapseMaxHeight;
        /* left y1 坐标 */
        // 动画步长
        const leftHeaderRect = getDomClientRect(leftHeader[leftIndex])
        const leftToHeaderOffset = y1 - leftHeaderRect.centerY; // left节点到 header 中点的距离
        const leftSpeed = leftToHeaderOffset / (this.duration / 6);
        // 边界
        const leftContentRect = getDomClientRect(leftContent[leftIndex])
        if (this.leftActiveName.find(d => parseInt(d) - 1 === leftIndex)) {
          // 展开
          if (leftIndex === this.leftOpenName - 1) {
            // 当前展开
            y1 = leftHeaderRect.centerY;
            y1 += this.drawNum * leftSpeed;
            y1 > gY1 && (y1 = gY1);
            y1 > leftContentRect.bottom && (y1 = leftContentRect.bottom);
          } else {
            // 已展开状态
            if (y1 < leftContentRect.top) {
              y1 = leftContentRect.top;
            } else if (y1 > leftContentRect.bottom) {
              y1 = leftContentRect.bottom;
            }
          }
        } else {
          // left 当前收起
          if (leftIndex === this.leftCloseName - 1) {
            y1 > leftContentRect.bottom && (y1 = leftContentRect.bottom);
            y1 > leftHeaderRect.centerY && (y1 -= this.drawNum * leftSpeed);
            y1 < leftHeaderRect.centerY && (y1 = leftHeaderRect.centerY);
          } else {
            // 已收起状态
            leftIndex !== this.leftCloseName - 1 &&
              (y1 = leftHeaderRect.centerY);
          }
        }

        /* right y2 坐标 */
        // 动画步长
        const rightHeaderRect = getDomClientRect(rightHeader[rightIndex])
        const rightToHeaderOffset = y2 - rightHeaderRect.centerY;
        const rightSpeed = rightToHeaderOffset / (this.duration / 6);
        // 边界
        const rightContentRect = getDomClientRect(rightContent[rightIndex])
        if (this.rightActiveName.find(d => parseInt(d) - 1 === rightIndex)) {
          // 当前展开
          if (rightIndex === this.rightOpenName - 1) {
            y2 = rightHeaderRect.centerY;
            y2 += this.drawNum * rightSpeed;
            y2 > gY2 && (y2 = gY2);
            y2 > rightContentRect.bottom && (y2 = rightContentRect.bottom);
          } else {
            // 已展开状态
            if (y2 < rightContentRect.top) {
              y2 = rightContentRect.top;
            } else if (y2 > rightContentRect.bottom) {
              y2 = rightContentRect.bottom;
            }
          }
        } else {
          // right 当前收起
          if (rightIndex === this.rightCloseName - 1) {
            y2 > rightContentRect.bottom && (y2 = rightContentRect.bottom);
            y2 > rightHeaderRect.centerY && (y2 -= this.drawNum * rightSpeed);
            y2 < rightHeaderRect.centerY && (y2 = rightHeaderRect.centerY);
          } else {
            // 已收起状态
            rightIndex !== this.rightCloseName - 1 && (y2 = rightHeaderRect.centerY);
          }
        }

        line.y1 = y1 - this.elTop + this.scrollTop;
        line.y2 = y2 - this.elTop + this.scrollTop;
        this.readyLines.push({
          id: line.id,
          p1: { x: line.x1, y: line.y1 },
          p2: { x: line.x2, y: line.y2 },
          color: line.color
        });
      });
      this.drawAllLines();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.elTop = getDomClientRect(this.$el).top
    })
  }
};
</script>

<style lang="scss" scoped>
.canves-group {
  position: relative;
  overflow: hidden;
}
.canvas {
  position: absolute;
  left: 0;
  top: 0;
}
.flows__handle-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  z-index: 0;
  opacity: 0;
}
</style>


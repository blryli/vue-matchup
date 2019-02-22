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
import { offset } from "../../utils/util";
import Graph from "./graph";
import Handle from "./handle";

export default {
  name: "m-canves",
  mixins: [Graph, Handle],
  props: {
    width: Number,
    offset: {
      type: Number,
      default: 5
    },
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
    leftActiveName: [Array],
    rightActiveName: [Array],
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
        let y1 =
          offset(leftItem).top +
          leftItem.offsetHeight / 2 -
          leftContent[leftIndex].scrollTop;
        const gY1 = y1;
        let y2 =
          offset(rightItem).top +
          rightItem.offsetHeight / 2 -
          rightContent[rightIndex].scrollTop;
        const gY2 = y2;

        this.drawNum++;
        const collapseMaxHeight = this.$parent.$props.collapseMaxHeight;
        /* left y1 坐标 */
        // 动画步长
        const leftHeaderY =
          offset(leftHeader[leftIndex]).top +
          leftHeader[leftIndex].offsetHeight / 2;
        const leftOffsetY = y1 - leftHeaderY;
        const leftSpeed = leftOffsetY / (this.duration / 3);
        // 边界
        const leftTopY = offset(leftContent[leftIndex]).top;
        const leftBotY =
          offset(leftContent[leftIndex]).top +
          leftContent[leftIndex].offsetHeight;
        if (this.leftActiveName.find(d => parseInt(d) - 1 === leftIndex)) {
          // 展开
          if (leftIndex === this.leftOpenName - 1) {
            // 当前展开
            y1 = leftHeaderY;
            y1 += this.drawNum * leftSpeed;
            y1 > gY1 && (y1 = gY1);
            y1 > leftBotY && (y1 = leftBotY);
          } else {
            // 已展开状态
            if (y1 < leftTopY) {
              y1 = leftTopY;
            } else if (y1 > leftBotY) {
              y1 = leftBotY;
            }
          }
        } else {
          // left 当前收起
          if (leftIndex === this.leftCloseName - 1) {
            y1 > leftBotY && (y1 = leftBotY);
            y1 > leftHeaderY && (y1 -= this.drawNum * leftSpeed);
            y1 < leftHeaderY && (y1 = leftHeaderY);
          } else {
            // 已收起状态
            leftIndex !== this.leftCloseName - 1 &&
              (y1 =
                offset(leftHeader[leftIndex]).top +
                leftHeader[leftIndex].offsetHeight / 2);
          }
        }

        /* right y2 坐标 */
        // 动画步长
        const rightHeaderY =
          offset(rightHeader[rightIndex]).top +
          rightHeader[rightIndex].offsetHeight / 2;
        const rightOffsetY = y2 - rightHeaderY;
        const rightSpeed = rightOffsetY / (this.duration / 3);
        // 边界
        const rightTopY = offset(rightContent[rightIndex]).top;
        const rightBotY =
          offset(rightContent[rightIndex]).top +
          rightContent[rightIndex].offsetHeight;
        if (this.rightActiveName.find(d => parseInt(d) - 1 === rightIndex)) {
          // 当前展开
          if (rightIndex === this.rightOpenName - 1) {
            y2 = rightHeaderY;
            y2 += this.drawNum * rightSpeed;
            y2 > gY2 && (y2 = gY2);
            y2 > rightBotY && (y2 = rightBotY);
          } else {
            // 已展开状态
            if (y2 < rightTopY) {
              y2 = rightTopY;
            } else if (y2 > rightBotY) {
              y2 = rightBotY;
            }
          }
        } else {
          // right 当前收起
          if (rightIndex === this.rightCloseName - 1) {
            y2 > rightBotY && (y2 = rightBotY);
            y2 > rightHeaderY && (y2 -= this.drawNum * rightSpeed);
            y2 < rightHeaderY && (y2 = rightHeaderY);
          } else {
            // 已收起状态
            rightIndex !== this.rightCloseName - 1 &&
              (y2 =
                offset(rightHeader[rightIndex]).top +
                rightHeader[rightIndex].offsetHeight / 2);
          }
        }

        line.y1 = y1 - offset(this.$el).top;
        line.y2 = y2 - offset(this.$el).top;
        this.readyLines.push({
          id: line.id,
          p1: { x: line.x1, y: line.y1 },
          p2: { x: line.x2, y: line.y2 },
          color: line.color
        });
      });
      this.drawAllLines();
    }
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


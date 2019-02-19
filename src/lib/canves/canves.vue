<template>
  <div class="canves" :style="{left: `-${offset}px`}">
    <canvas
      ref="canvas"
      class="canvas"
      :width="width + offset*2"
      :height="height"
      @mousemove="move($event)"
      @click="check($event)"
      @dblclick="edit($event)"
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
      default: 2
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
  created() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
    });
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
      this.ctx &&
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        line.x2 = this.width + this.offset * 2 - 6;
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

        // left y1 坐标
        if (this.leftActiveName.find(d => parseInt(d) - 1 === leftIndex)) {
          // 当前展开
          if (leftIndex === this.leftOpenName - 1) {
            this.drawNum++;
            const leftHeaderY =
              offset(leftHeader[leftIndex]).top +
              leftHeader[leftIndex].offsetHeight / 2;
            const leftOffsetY = y1 - leftHeaderY;
            const speed = leftOffsetY / (this.duration / 6);
            y1 = leftHeaderY;
            y1 += this.drawNum * speed;
            y1 > gY1 && (y1 = gY1);
          } else {
            // 已展开状态
            const topY = offset(leftContent[leftIndex]).top;
            const botY =
              offset(leftContent[leftIndex]).top +
              leftContent[leftIndex].offsetHeight;
            if (y1 < topY) {
              y1 = topY;
            } else if (y1 > botY) {
              y1 = botY;
            }
          }
        } else {
          // left 当前收起
          if (leftIndex === this.leftCloseName - 1) {
            this.drawNum++;
            const leftHeaderY =
              offset(leftHeader[leftIndex]).top +
              leftHeader[leftIndex].offsetHeight / 2;
            const leftOffsetY = y1 - leftHeaderY;
            const speed = leftOffsetY / (this.duration / 6);
            y1 > leftHeaderY && (y1 -= this.drawNum * speed);
            y1 < leftHeaderY && (y1 = leftHeaderY);
          } else {
            // 已收起状态
            leftIndex !== this.leftCloseName - 1 &&
              (y1 =
                offset(leftHeader[leftIndex]).top +
                leftHeader[leftIndex].offsetHeight / 2);
          }
        }

        // right y2 坐标
        if (this.rightActiveName.find(d => parseInt(d) - 1 === rightIndex)) {
          // 当前展开
          if (rightIndex === this.rightOpenName - 1) {
            this.drawNum++;
            const rightHeaderY =
              offset(rightHeader[rightIndex]).top +
              rightHeader[rightIndex].offsetHeight / 2;
            const rightOffsetY = y2 - rightHeaderY;
            const speed = rightOffsetY / (this.duration / 6);
            y2 = rightHeaderY;
            y2 += this.drawNum * speed;
            y2 > gY2 && (y2 = gY2);
          } else {
            // 已展开状态
            const topY = offset(rightContent[rightIndex]).top;
            const botY =
              offset(rightContent[rightIndex]).top +
              rightContent[rightIndex].offsetHeight;
            if (y2 < topY) {
              y2 = topY;
            } else if (y2 > botY) {
              y2 = botY;
            }
          }
        } else {
          // right 当前收起
          if (rightIndex === this.rightCloseName - 1) {
            this.drawNum++;
            const rightHeaderY =
              offset(rightHeader[rightIndex]).top +
              rightHeader[rightIndex].offsetHeight / 2;
            const rightOffsetY = y2 - rightHeaderY;
            const speed = rightOffsetY / (this.duration / 6);
            y2 > rightHeaderY && (y2 -= this.drawNum * speed);
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
        this.Arrow(line.x1, line.y1, line.x2, line.y2);
      });
      this.drawAllLines();
    }
  }
};
</script>

<style lang="scss">
.canves {
  position: absolute;
  top: 0;
  z-index: 100;
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


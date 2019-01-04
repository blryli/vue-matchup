<template>
  <div class="canves" ref="canves" :style="{left: `-${offset}px`}">
    <canvas
      ref="canvas"
      class="canvas"
      :width="width + offset*2"
      :height="height"
      @mousemove="move($event)"
      @click="check($event)"
      @dblclick="edit($event)"
    ></canvas>
    <input class="flows__handle-input" type="text" ref="input" @keyup.delete="deleted">
  </div>
</template>

<script>
import { offset } from "../../utils/util";
import Graph from "./graph";
import Handle from "./handle";

export default {
  name: "canves",
  mixins: [Graph, Handle],
  props: {
    width: Number,
    offset: {
      type: Number,
      default: 0
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
    leftActiveName: [Array, String],
    rightActiveName: [Array, String],
    height: {
      type: Number,
      default: 50
    },
    time: {
      type: Number,
      default: 300
    },
    readonly: Boolean
  },
  data() {
    return {
      canvas: "",
      ctx: "",
      lines: [],
      leftActiveNameOld: JSON.parse(JSON.stringify(this.leftActiveName)),
      leftCloseName: null,
      rightActiveNameOld: JSON.parse(JSON.stringify(this.rightActiveName)),
      rightCloseName: null,
      drawNum: 0
    };
  },
  created() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.lines = this.value;
    });
  },
  watch: {
    leftActiveName(newVal, oldVal) {
      if (this.readonly) return;
      this.rightCloseName = null;
      if (typeof newVal === "string") {
        this.leftCloseName = `${oldVal}`;
      } else if (
        newVal &&
        Array.isArray(newVal) &&
        Array.isArray(this.leftActiveNameOld)
      ) {
        this.leftActiveNameOld.forEach(old => {
          if (!newVal.find(newV => `${newV}` === `${old}`)) {
            this.leftCloseName = `${old}`;
          }
        });
        newVal.length > this.leftActiveNameOld.length &&
          (this.leftCloseName = null);
        this.leftActiveNameOld = JSON.parse(JSON.stringify(newVal));
      }
      this.drawNum = 0;
      console.log(this.leftCloseName);
    },
    rightActiveName(newVal, oldVal) {
      if (this.readonly) return;
      this.leftCloseName = null;
      if (typeof newVal === "string") {
        this.rightCloseName = `${oldVal}`;
      } else if (
        newVal &&
        Array.isArray(newVal) &&
        Array.isArray(this.rightActiveNameOld)
      ) {
        this.rightActiveNameOld.forEach(old => {
          if (!newVal.find(newV => `${newV}` === `${old}`)) {
            this.rightCloseName = `${old}`;
          }
        });
        newVal.length > this.rightActiveNameOld.length &&
          (this.rightCloseName = null);
        this.rightActiveNameOld = JSON.parse(JSON.stringify(newVal));
      }
      this.drawNum = 0;
      console.log(this.rightCloseName);
    }
  },
  methods: {
    // 建立连接关系
    join() {
      if (
        this.leftCheckedIds.length === 1 &&
        this.rightCheckedIds.length === 1
      ) {
        console.log("一对一");
        const leftId = this.leftCheckedIds[0];
        const rightId = this.rightCheckedIds[0];
        const line = {
          leftId: leftId,
          rightId: rightId,
        };
        this.lines.push(line);
      }
      if (this.leftCheckedIds.length > 1 && this.rightCheckedIds.length === 1) {
        console.log("多对一");
        this.leftCheckedIds.forEach(d => {
          const leftId = d;
          const rightId = this.rightCheckedIds[0];
          const line = {
            leftId: leftId,
            rightId: rightId,
          };
          this.lines.push(line);
        });
      }
      if (this.leftCheckedIds.length === 1 && this.rightCheckedIds.length > 1) {
        console.log("一对多");
        this.rightCheckedIds.forEach(d => {
          const leftId = this.leftCheckedIds[0];
          const rightId = d;
          const line = {
            leftId: leftId,
            rightId: rightId,
          };
          this.lines.push(line);
        });
      }
      this.drawLine();
    },
    // 画线
    drawLine(e, event, color) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.lines.length) return;
      const leftHeader = this.$parent.$data.leftHeader;
      const rightHeader = this.$parent.$data.rightHeader;
      const leftContent = this.$parent.$data.leftContent;
      const rightContent = this.$parent.$data.rightContent;
      if (!leftContent || !rightContent) return;
      if (e === undefined && e !== null) {
        this.lines.forEach(line => {
          const leftIndex = parseInt(line.leftId.split("-")[0] - 1);
          const rightIndex = parseInt(line.rightId.split("-")[0] - 1);
          const leftRow = parseInt(line.leftId.split("-")[1] - 1);
          const rightRow = parseInt(line.rightId.split("-")[1] - 1);

          const leftItem = leftContent[leftIndex] && leftContent[leftIndex].querySelectorAll(
            ".table__row"
          )[leftRow];
          const rightItem = rightContent[rightIndex] && rightContent[rightIndex].querySelectorAll(
            ".table__row"
          )[rightRow];
          line.id = `${line.leftId}--${line.rightId}`,
          line.x1 = 0;
          line.x2 = this.width + this.offset * 2;
          line.color = line.color || '#555';
          let y1 =
            offset(leftItem).top +
            leftItem.offsetHeight / 2 -
            leftContent[leftIndex].scrollTop;
          let y2 =
            offset(rightItem).top +
            rightItem.offsetHeight / 2 -
            rightContent[rightIndex].scrollTop;

          // left y1 坐标
          if (
            (typeof this.leftActiveName === "string" &&
              parseInt(this.leftActiveName) - 1 === leftIndex) ||
            (this.leftActiveName &&
              (Array.isArray(this.leftActiveName) &&
                this.leftActiveName.find(d => parseInt(d) - 1 === leftIndex)))
          ) {
            // 展开状态
            const topY = offset(leftContent[leftIndex]).top;
            const botY =
              offset(leftContent[leftIndex]).top +
              leftContent[leftIndex].offsetHeight;
            if (y1 < topY) {
              y1 = topY;
            } else if (y1 > botY) {
              y1 = botY;
            }
          } else {
            // 已收起状态
            leftIndex !== this.leftCloseName - 1 &&
              (y1 =
                offset(leftHeader[leftIndex]).top +
                leftHeader[leftIndex].offsetHeight / 2);
          }
          // left 当前收起
          if (leftIndex === this.leftCloseName - 1) {
            this.drawNum++;
            const leftHeaderY =
              offset(leftHeader[leftIndex]).top +
              leftHeader[leftIndex].offsetHeight / 2;
            const leftOffsetY = y1 - leftHeaderY;
            const speed = leftOffsetY / (this.time / 12);
            y1 > leftHeaderY && (y1 -= this.drawNum * speed);
            y1 < leftHeaderY && (y1 = leftHeaderY);
          }

          // right y2 坐标
          if (
            (typeof this.rightActiveName === "string" &&
              parseInt(this.rightActiveName) - 1 === rightIndex) ||
            (this.rightActiveName &&
              (Array.isArray(this.rightActiveName) &&
                this.rightActiveName.find(d => parseInt(d) - 1 === rightIndex)))
          ) {
            // 展开状态
            const topY = offset(rightContent[rightIndex]).top;
            const botY =
              offset(rightContent[rightIndex]).top +
              rightContent[rightIndex].offsetHeight;
            if (y2 < topY) {
              y2 = topY;
            } else if (y2 > botY) {
              y2 = botY;
            }
          } else {
            // 已收起状态
            rightIndex !== this.rightCloseName - 1 &&
              (y2 =
                offset(rightHeader[rightIndex]).top +
                rightHeader[rightIndex].offsetHeight / 2);
          }
          // right 当前收起
          if (rightIndex === this.rightCloseName - 1) {
            this.drawNum++;
            const rightHeaderY =
              offset(rightHeader[rightIndex]).top +
              rightHeader[rightIndex].offsetHeight / 2;
            const rightOffsetY = y2 - rightHeaderY;
            const speed = rightOffsetY / (this.time / 12);
            y2 > rightHeaderY && (y2 -= this.drawNum * speed);
            y2 < rightHeaderY && (y2 = rightHeaderY);
          }

          line.y1 = y1 - offset(this.$refs.canves).top;
          line.y2 = y2 - offset(this.$refs.canves).top;
          this.Arrow(line.x1, line.y1, line.x2, line.y2, line.color, line.activeColor);
        });
      } else {
        this.moveLine = false;
        this.clickLine = false;
        this.lines.forEach(d => {
          const activeColor =
            this.activeData.id === d.id ? "#139BD4" : "transparent";
          this.$set(d, "activeColor", activeColor);
          this.Arrow(d.x1, d.y1, d.x2, d.y2, d.color, d.activeColor);
          const p = e && this.getEventPosition(e);
          if (
            p &&
            event &&
            (this.ctx.isPointInPath(p.x, p.y) ||
              this.ctx.isPointInStroke(p.x, p.y))
          ) {
            if (event === "move") {
              this.moveData = d;
              this.moveLine = true;
            } else if (event === "click") {
              this.activeData = d;
              this.clickLine = true;
            }
          }
        });
      }
      this.$emit("input", this.lines);
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.lines.length && this.drawLine();
      }, 310)
    });
  }
};
</script>

<style lang="scss">
.canves {
  position: absolute;
  top: 0;
  width: 240px;
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


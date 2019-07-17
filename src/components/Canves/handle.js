import {
  offset,
  scroll,
  getParentNodes
} from "../../utils/util";
import {
  on,
  off
} from "../../utils/dom";

export default {
  data() {
    return {
      lineMoveId: null,
      lineCheckedId: null,
      lineCheckedIds: [],
      readyLines: [],
      scrollTargets: [],
      scrollTop: scroll().top,
      scrollLeft: scroll().left,
      cacheCanvas: null
    }
  },
  watch: {
    lineCheckedId(val, oldVal) {
      this.drawAllLines();
      if (val !== oldVal) {
        oldVal && this.$emit('unCheckLine', oldVal);
        val && this.$emit('checkLine', val);
        this.$nextTick(() => {
          this.$refs.input.focus();
        })
      } else {
        this.$emit('unCheckLine', oldVal)
      }
    },
    lineMoveId() {
      this.drawAllLines();
    }
  },
  computed: {
    matchup() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueMatchup") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    }
  },
  methods: {
    init() {
      this.scrollTargets = getParentNodes(this.matchup.$el.parentNode);
      this.scrollTargets.forEach(d => {
        on(d, "scroll", this.windowScroll);
      })
    },
    // 画布鼠标移动
    move(e) {
      e = e || event;
      if (!this.lines.length || !this.readyLines.length) return;
      this.inLine(e, 'move');
    },
    leave() {
      this.lineMoveId = null;
      this.drawAllLines();
    },
    click(e) {
      e = e || event;
      if (!this.lines.length || !this.readyLines.length) return;
      this.lineCheckedIds = [];
      this.inLine(e, 'click');
    },
    dblclick() {
      if (!this.lineMoveId) return;
      this.$emit('dblclick', this.lineMoveId);
    },
    drawAllLines() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.readyLines.forEach(d => {
        let lineColor = d.color;
        let lineWidth = 1.6;
        if (this.lineCheckedId && this.lineCheckedId === d.id || this.lineCheckedIds.find(id => id === d.id)) {
          lineColor = '#139bd2';
          lineWidth = 3;
        }
        if (this.lineMoveId && this.lineMoveId === d.id) {
          lineColor = 'orange';
          lineWidth = 3;
        }
        this.drawArrow(this.ctx, d.p1.x, d.p1.y, d.p2.x, d.p2.y, lineColor, lineWidth);
      })
    },
    inLine(e, type) {
      // 鼠标点击的坐标
      const px = e.clientX - offset(this.$refs.canvas).left + this.scrollLeft;
      const py = e.clientY - offset(this.$refs.canvas).top + this.scrollTop;

      // 逐条线确定是否有点中
      const lineOffset = 5; // 可接受（偏移）范围
      for (let i = 0; i < this.readyLines.length; i++) {
        const line = this.readyLines[i];
        const p1 = line.p1; // 直线起点
        const p2 = line.p2; // 直线终点 
        const minX = Math.min(p1.x, p2.x); // 较小的X轴坐标值
        const maxX = Math.max(p1.x, p2.x); // 较大的X轴坐标值
        const minY = Math.min(p1.y, p2.y); // 较小的Y轴坐标值
        const maxY = Math.max(p1.y, p2.y); // 较大的Y轴坐标值

        if (p1.y === p2.y) {
          // 水平线
          if ((px >= minX && px <= maxX) && (py >= minY - lineOffset && py <= maxY + lineOffset)) {
            this.setHandleId(line, type);
            break;
          }

        } else if (p1.x === p2.x) {
          // 垂直线
          if ((py >= minY && py <= maxY) && (px >= minX - lineOffset && px <= maxX + lineOffset)) {
            this.setHandleId(line, type);
            break;
          }
        } else {
          if ((px >= minX && px <= maxX) && (py >= minY - lineOffset && py <= maxY + lineOffset)) {
            var hudu = Math.atan2(p2.y - p1.y, p2.x - p1.x); // 直线的弧度(倾斜度)
            // 用三角函数计出直线上的交叉点
            var r = (px - p1.x) / Math.cos(hudu); // 直角三角形的斜边（或理解成圆的半径）
            var y = Math.sin(hudu) * r; // Y轴坐标

            var p = {
              x: px,
              y: p1.y + y
            };
            if ((Math.abs(px - p.x) <= lineOffset) && (Math.abs(py - p.y) <= lineOffset)) {
              this.setHandleId(line, type);
              break;
            }
          }
        }
        type === 'move' && (this.lineMoveId = null);
        type === 'click' && this.lineCheckedId === line.id && (this.lineCheckedId = null);
      }
    },
    setHandleId(line, type) {
      if (type === 'move') {
        this.lineMoveId = line.id
      }
      if (type === 'click') {
        this.lineCheckedId = this.lineCheckedId === line.id ? null : line.id;
      }
    },
    deleted() {
      if (this.lineCheckedId) {
        // 删除线
        const index = this.lines.findIndex(d => d.id === this.lineCheckedId);
        this.$emit("delete", index);
      }
      this.lineCheckedId = null;
      this.lineMoveId = null;
    },
    checkLines(ids) {
      this.lineCheckedIds = ids;
      this.drawAllLines();
    },
    unCheckedLines(ids) {
      if (!ids || !ids.length) return;
      for (let i = 0; i < this.lineCheckedIds.length; i++) {
        const checkedId = this.lineCheckedIds[i];
        if (ids.find(id => id === checkedId)) {
          this.lineCheckedIds.splice(i, 1);
          i--;
        }
      }
      ids.find(id => id === this.lineCheckedId) && (this.lineCheckedId = null);
      this.drawAllLines();
    },
    clearCheckedLines() {
      this.lineCheckedIds = [];
      this.lineCheckedId = null;
      this.drawAllLines();
    },
    windowScroll() {
      this.scrollTop = scroll().top;
      this.scrollLeft = scroll().left;
      this.scrollTargets.forEach(d => {
        this.scrollTop += d.scrollTop;
        this.scrollLeft += d.scrollLeft;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
    })
  },
  beforeDestroy() {
    this.scrollTargets.forEach(d => {
      off(d, "scroll", this.windowScroll);
    })
  }
}

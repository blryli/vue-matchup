import { offset } from "../../utils/util";

export default {
  data() {
    return {
      lineMoveId: null,
      lineCheckedId: null,
      lineCheckedIds: [],
      readyLines: []
    }
  },
  watch: {
    lineCheckedId(val, oldVal) {
      if (val !== oldVal) {
        oldVal && this.$emit('unCheckLine', oldVal);
        val && this.$emit('checkLine', val);
        this.$nextTick(() => {
          this.$refs.input.focus();
        })
      } else {
        this.$emit('unCheckLine', oldVal)
      }
    }
  },
  computed: {},
  methods: {
    // 画布鼠标移动
    move(e) {
      if (!this.readyLines.length) return;
      this.inLine(e, 'move')
    },
    check(e) {
      if (!this.readyLines.length) return;
      this.lineCheckedIds = [];
      this.inLine(e, 'click')
    },
    edit() {
      if (!this.lineMoveId) return;
      this.$emit('dblclick', this.lineMoveId);
    },
    drawAllLines() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // 画出逐条线
      this.readyLines.forEach(d => {
        var lineColor = d.color;
        this.lineMoveId && this.lineMoveId === d.id && (lineColor = 'orange');
        this.lineCheckedId && this.lineCheckedId === d.id && (lineColor = '#139bd2');
        this.lineCheckedIds.find(id => id === d.id) && (lineColor = '#139bd2');
        this.Arrow(d.p1.x, d.p1.y,d.p2.x, d.p2.y, lineColor);
      })
    },
    inLine (e, type) {
      // 鼠标点击的坐标
      const px = e.clientX - offset(this.$refs.canvas).left;
      const py = e.clientY - offset(this.$refs.canvas).top;

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
            if (type === 'move') {
              this.lineMoveId = line.id
            } 
            if (type === 'click'){
              this.lineCheckedId = this.lineCheckedId === line.id ? null : line.id; 
            }
            break;
          }

        } else if (p1.x === p2.x) {
          // 垂直线
          if ((py >= minY && py <= maxY) && (px >= minX - lineOffset && px <= maxX + lineOffset)) {
            if (type === 'move') {
              this.lineMoveId = line.id
            } 
            if (type === 'click'){
              this.lineCheckedId = this.lineCheckedId === line.id ? null : line.id; 
            }  
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
              if (type === 'move') {
                this.lineMoveId = line.id
              } 
              if (type === 'click'){
                this.lineCheckedId = this.lineCheckedId === line.id ? null : line.id; 
              }  
              break;
            }
          }
        }
        type === 'move' && (this.lineMoveId = null);
        type === 'click' && this.lineCheckedId === line.id && (this.lineCheckedId = null);
      }
      this.drawAllLines();
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
    }
  }
}

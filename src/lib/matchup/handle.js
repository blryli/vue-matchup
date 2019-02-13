import { offset } from "../../utils/util";

export default {
  data() {
    return {
      
    }
  },
  watch: {
    
  },
  computed: {
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
  methods: {
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
    }
  }
}

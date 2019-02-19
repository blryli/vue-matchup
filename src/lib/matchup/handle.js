export default {
  methods: {
    // 连接线的方法
    link(leftCheckedIds, rightCheckedIds) {
      leftCheckedIds = leftCheckedIds || this.leftCheckedIds;
      rightCheckedIds = rightCheckedIds || this.rightCheckedIds;
      if (leftCheckedIds.length === 1 && rightCheckedIds.length === 1) {
        const leftId = leftCheckedIds[0];
        const rightId = rightCheckedIds[0];
        this.doLine(leftId, rightId);
      }
      if (leftCheckedIds.length > 1 && rightCheckedIds.length === 1) {
        leftCheckedIds.forEach(d => {
          const leftId = d;
          const rightId = rightCheckedIds[0];
          this.doLine(leftId, rightId);
        });
      }
      if (leftCheckedIds.length === 1 && rightCheckedIds.length > 1) {
        rightCheckedIds.forEach(d => {
          const leftId = leftCheckedIds[0];
          const rightId = d;
          this.doLine(leftId, rightId);
        });
      }
      this.clearChecked();
    },
    doLine(leftId, rightId) {
      let line = {
        leftId: leftId,
        rightId: rightId
      };
      this.lines.push(line);
      this.$emit('input', this.lines)
    },
    // 清空选中行
    clearChecked() {
      this.leftCheckedIds = [];
      this.rightCheckedIds = [];
      this.$refs['left-table'].forEach(d => {
        d.clearChecked();
      });
      this.$refs['right-table'].forEach(d => {
        d.clearChecked();
      });
    },
    // 选中行的回调
    leftCheckChange(checkeds, i) {
      this.leftChecked.splice(i, 1, checkeds);
      this.leftCheckedIds = [].concat.apply([],this.leftChecked);
      this.$emit('leftCheckChange', this.leftCheckedIds)
    },
    rightCheckChange(checkeds, i) {
      this.rightChecked.splice(i, 1, checkeds);
      this.rightCheckedIds = [].concat.apply([],this.rightChecked);
      this.$emit('rightCheckChange', this.rightCheckedIds)
    },
    // 选中行的方法
    leftCheckRow(id) {
      this.$refs['left-table'].forEach(d => {
        d.checkRow(id);
      })
    },
    rightCheckRow(id) {
      this.$refs['right-table'].forEach(d => {
        d.checkRow(id);
      })
    },
    // 选中线的方法
    checkLines(ids) {
      this.$refs.canves.checkLines(ids)
    },
    // 取消选中线的方法
    unCheckedLines(ids) {
      this.$refs.canves.unCheckedLines(ids)
    },
    // 清空选中线的方法
    clearCheckedLines() {
      this.$refs.canves.clearCheckedLines()
    },
    // 删除线的回调事件
    deleteLine(index) {
      this.$emit("delete", this.lines[index].id || `${this.lines[index].leftId}--${this.lines[index].rightId}`);
      this.lines.splice(index, 1);
      this.$emit("input", this.lines);
    },
    // 选中行的回调事件
    checkRow(id) {
      this.$emit('checkRow', id);
    },
    // 取消选中行的回调事件
    unCheckRow(id) {
      this.$emit('unCheckRow', id);
    },
    // 选中线的回调事件
    cvsCheckLine(val) {
      this.$emit('checkLine', val);
    },
    // 取消选中线的回调事件
    cvsUnCheckLine(val) {
      this.$emit('unCheckLine', val)
    }
  }
}

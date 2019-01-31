export default {
  data() {
    return {
      form: {},
      movePosition: {},
      moveData: {
        id: ''
      },
      activeData: {
        id: ''
      },
      checkedLines: [],
      moveLine: false,
      isEdit: false
    }
  },
  watch: {
    activeData(val) {
      if (val.id) {
        this.$nextTick(() => {
          val.id && this.$refs.input.focus();
        })
      } else {
        this.checkedLines = []
      }
      this.drawLine(null, 'click');
    },
    isEdit(val) {
      console.log(val)
    }
  },
  computed: {},
  methods: {
    // 画布鼠标移动
    move(e) {
      if (this.isEdit || !this.lines.length) return;
      this.movePosition = this.getEventPosition(e);
      // this.drawLine(e, 'move');
      !this.moveLine && (this.moveData = {
        id: ''
      });
    },
    check(e) {
      if (this.isEdit) return;
      this.drawLine(e, 'click');
      !this.clickLine && (this.activeData = {
        id: ''
      });
      this.$emit('click', this.activeData);
    },
    edit() {
      if (!this.moveData.id) return;
      this.form = JSON.parse(JSON.stringify(this.moveData));
      this.isEdit = true;
      this.$emit('dblclick', this.moveData);
    },
    deleted() {
      if (this.isEdit) return;
      if (this.activeData.id) {
        // 删除线
        const index = this.lines.findIndex(d => d.id === this.activeData.id);
        this.$emit("delete", index);
      }
      this.activeData = {
        id: ''
      }
      this.moveData = {
        id: ''
      }
    },
    checkLines(ids) {
      this.checkedIds = ids;
      this.drawLine(null, 'click');
    },
    unCheckedLines(ids) {
      if (!ids || !ids.length) return;
      for (let i = 0; i < this.checkedIds.length; i++) {
        const checkedId = this.checkedIds[i];
        if (ids.find(id => id === checkedId)) {
          this.checkedIds.splice(i, 1);
          i--;
        }
      }
      this.drawLine(null, 'click');
    },
    getEventPosition(ev) {
      let x, y;
      if (ev.movePositionX || ev.movePositionX == 0) {
        x = ev.movePositionX;
        y = ev.movePositionY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
      }
      return {
        x: x,
        y: y
      };
    }
  }
}

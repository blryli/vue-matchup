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
      moveLine: false,
      isEdit: false
    }
  },
  watch: {
    activeData(val) {
      console.log('activeData change')
      this.drawLine(null, 'click');
      this.$nextTick(() => {
        val.id && this.$refs.input.focus();
      })
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
      this.drawLine(e, 'move');
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
    deleted(id) {
      if (this.isEdit) return;
      if (this.activeData.id || id) {
        const deleteId = id || this.activeData.id;
        // 删除线
        const index = this.lines.findIndex(d => d.id === deleteId);
        this.lines.splice(index, 1);
        this.$emit('input', this.lines)
        this.$emit("delete", deleteId);
        this.drawLine();
      }
      this.activeData = {
        id: ''
      }
      this.moveData = {
        id: ''
      }
    },
    save() {

    },
    setColor(val) {
      if (!val || !this.activeData.id) return;
      this.lines.forEach(d => {
        d.id === this.activeData.id && this.$set(d, 'color', val);
      })
      this.$emit('input', this.lines);
      this.activeData.color = val;
      this.drawLine();
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

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(d, i) in theadData" :key="i" :width="d.width">
          <div class="cell">{{d.title}}</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="table__row" v-for="(da, idx) in tbodyData" :key="idx" :class="{active: handleData[idx].check}" @click="clickRow(idx)">
        <td v-for="(d, i) in Object.keys(da)" :key="i">
          <div class="cell">{{da[d]}}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "r-table",
  props: {
    value: Array,
    theadData: Array,
    tbodyData: Array,
    row: Number
  },
  data() {
    return {
      handleData: []
    };
  },
  created() {
    this.tbodyData.forEach((d, i) => {
      const id = typeof this.row === 'number' ? `${this.row + 1}-${i + 1}` : i + 1;
      this.handleData.push({id: id, check: false})
    })
  },
  computed: {
    
  },
  watch: {},
  methods: {
    clickRow(i) {
      this.handleData[i].check = !this.handleData[i].check;
      const checked = [];
      this.handleData.forEach(d => {
        d.check && checked.push(d.id);
      })
      this.$emit('checkChange', checked);
    },
    clearCheck() {
      this.handleData.forEach(d => {
        d.check = false;
      })
      this.$emit('checkChange', []);
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
  thead {
    color: #909399;
    font-weight: 500;
  }
  tbody{
    position: relative;
  }
  th {
    user-select: none;
  }
  td,
  th {
    padding: 6px 0;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
  }
  .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
  th > .cell {
    position: relative;
    word-wrap: normal;
    vertical-align: middle;
    width: 100%;
  }
  th > .cell,
  th div {
    display: inline-block;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }
}
table {
  -webkit-border-horizontal-spacing: 0px;
  -webkit-border-vertical-spacing: 0px;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
}
.table__row {
  position: relative;
  background-color: #fff;
  &:hover {
    background-color: #f5f7fa;
  }
  &.active{
    background-color: #71b6fc;
    color: #fff;
  }
  td {
    background-color: transparent;
  }
}
</style>


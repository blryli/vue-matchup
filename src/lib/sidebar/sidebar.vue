<template>
  <div
    class="matchup-sidebar"
    ref="sidebar"
    :style="{width: `${sidebarWidth}px`, right: `${sidebarUseWidth === sidebarWidth ? 0 : -sidebarWidth + 10}px`}"
  >
    <div class="matchup-sidebar__item matchup-sidebar__attrs">
      <strong>属性</strong>
    </div>
    <div class="matchup-sidebar__item matchup-sidebar__groups">
      <groups
        :menus="groups"
        :select-id="selectId"
        @select-id="getSelectId"
        @open="menuOpen"
        @close="menuClose"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "m-sidebar",
  props: {
    sidebarWidth: Number,
    sidebarUseWidth: Number,
    groups: Array,
  },
  watch: {},
  data() {
    return {
      selectId: "",
    };
  },
  methods: {
    menuOpen(val) {
      console.log("菜单组件 打开的ID: " + val);
    },
    menuClose(val) {
      console.log("菜单组件 关闭的ID: " + val);
    },
    //菜单选中的UID
    getSelectId(val) {
      this.selectId = val;
      console.log("选中的UID： " + val);
    }
  }
};
</script>

<style lang="scss" scoped>
.matchup-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #dfe2e9;
  transition: right 0.3s;
}
.matchup-sidebar__item {
  height: 50%;
  padding: 10px;
  box-sizing: border-box;
  & + .matchup-sidebar__item {
    border-top: 1px solid #dfe2e9;
  }
}
</style>


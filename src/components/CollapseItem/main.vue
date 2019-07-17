<template>
  <div class="collapse-item" :style="{'--duration': `${duration/1000}s`}">
    <div ref="header" class="collapse-item__header" :class="{active: active}" @click="change">
      {{title}}
      <div class="collapse-item__header-handle" @click="clear">清空</div>
    </div>
    <div
      class="collapse-item__wrap"
      :class="{active: active}"
      :dir="scrollDir === 'left' ? 'rtl' : undefined"
      :style="{maxHeight: collapseMaxHeight ? `${collapseMaxHeight}px` : ''}"
    >
      <div
        class="collapse-item__content"
        ref="content"
        :style="{'--height': active ? contentHeight  + 'px' : 0}"
        :dir="scrollDir === 'left' ? 'ltr' : undefined"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CollapseItem",
  props: {
    title: String,
    name: String,
    scrollDir: {
      type: String,
      default: "right"
    },
    duration: {
      type: Number,
      default: 300
    },
    collapseMaxHeight: Number
  },
  computed: {
    activeName() {
      return this.$parent.$props.value;
    },
    accordion() {
      return this.$parent.$props.accordion;
    }
  },
  watch: {
    activeName(val) {
      if (this.accordion) {
        this.active = val[0] === this.name;
      }
    }
  },
  data() {
    return {
      headerHeight: 0,
      contentHeight: 0,
      active: false
    };
  },
  methods: {
    change() {
      this.active = !this.active;
      if (this.accordion) {
        const index = this.activeName.findIndex(d => d === this.name);
        if (this.active) {
          this.$set(this.$parent.$data, "activeName", [this.name]);
        } else {
          this.$set(this.$parent.$data, "activeName", []);
        }
      } else {
        const index = this.activeName.findIndex(d => d === this.name);
        if (this.active) {
          index === -1 && this.activeName.push(this.name);
        } else {
          this.activeName.splice(index, 1);
        }
        this.$set(this.$parent.$data, "activeName", this.activeName);
      }
    },
    init() {
      this.headerHeight = this.$refs.header.offsetHeight;
      this.contentHeight = this.$slots.default[0].elm.offsetHeight;
      this.active = !!this.activeName.find(d => d === this.name);
    },
    clear(e) {
      e.stopPropagation();
      this.$children[0].clearChecked();
    }
  }
};
</script>

<style lang="scss" scoped>
.collapse-item__header {
  position: relative;
  padding: 0 10px;
  align-items: center;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  transition-property: border-bottom-color;
  transition-duration: var(--duration);
  outline: none;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-right: 1px solid;
    border-bottom: 1px solid;
    border-color: #303133;
    position: absolute;
    top: 38%;
    right: 15px;
    opacity: 0.7;
    transform: rotate(-45deg);
    transition-property: all;
    transition-duration: var(--duration);
  }
  &.active {
    border-bottom-color: transparent;
    &::after {
      transform: rotate(45deg);
    }
  }
  .collapse-item__header-handle {
    position: absolute;
    top: -100%;
    transition: top 0.3s, opacity 0.3s;
    right: 40px;
    opacity: 0;
    color: #139bd2;
  }
  &:hover {
    .collapse-item__header-handle {
      top: 0;
      opacity: 1;
    }
  }
}
.collapse-item__content {
  overflow: hidden;
  height: 0;
  font-size: 13px;
  color: #303133;
  line-height: 1.769230769230769;
  border-bottom: 0;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: var(--duration);
}

.collapse-item__wrap {
  overflow: auto;
  background-color: #fff;
  &.active {
    .collapse-item__content {
      height: var(--height);
    }
  }
  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: rgb(202, 212, 223);
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background: #f0f0f0;
  }
}
</style>


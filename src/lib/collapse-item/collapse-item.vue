<template>
  <div class="collapse-item" :style="{'--duration': `${duration/1000}s`}">
    <div class="collapse-item__header" :class="{active: active}" @click="change">{{title}}</div>
    <div
      class="collapse-item__wrap"
      :class="{active: active}"
      :dir="scrollDir === 'left' ? 'rtl' : undefined"
    >
      <div
        class="collapse-item__content"
        ref="content"
        :style="{'--height': height  + 'px'}"
        :dir="scrollDir === 'left' ? 'ltr' : undefined"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "collapse-item",
  props: {
    title: String,
    name: [String, Number],
    scrollDir: {
      type: String,
      default: "right"
    },
    duration: {
      type: Number,
      default: 300
    }
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
      this.accordion && `${val}` !== `${this.name}` && (this.active = false);
    }
  },
  data() {
    return {
      height: 0,
      active: false
    };
  },
  methods: {
    change() {
      this.active = !this.active;
      if (this.accordion) {
        if (this.activeName && Array.isArray(this.activeName)) {
          const index = this.activeName.findIndex(
            d => `${d}` === `${this.name}`
          );
          if (this.active) {
            this.$set(this.$parent.$data, "activeName", `${this.name}`);
          } else {
            this.activeName.splice(index, 1);
            this.$set(
              this.$parent.$data,
              "activeName",
              `${this.activeName[0]}`
            );
          }
        } else {
          this.active
            ? this.$set(this.$parent.$data, "activeName", `${this.name}`)
            : this.$set(this.$parent.$data, "activeName", "");
        }
      } else {
        if (this.activeName && Array.isArray(this.activeName)) {
          const index = this.activeName.findIndex(
            d => `${d}` === `${this.name}`
          );
          if (this.active) {
            index === -1 && this.activeName.push(`${this.name}`);
          } else {
            this.activeName.splice(index, 1);
          }
        }
      }
    },
    init() {
      this.$refs.content.style.height = "auto";
      this.height = this.$refs.content.offsetHeight;
      this.$refs.content.removeAttribute("style");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();

      !this.accordion &&
        this.activeName &&
        !Array.isArray(this.activeName) &&
        this.$set(this.$parent.$data, "activeName", [this.activeName]);
      if (this.activeName && Array.isArray(this.activeName)) {
        this.activeName.find(d => `${d}` === `${this.name}`) &&
          (this.active = true);
      } else {
        `${this.activeName}` === `${this.name}` && (this.active = true);
      }
    });
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
}
.collapse-item__wrap {
  background-color: #fff;
  overflow: hidden;
  &.active {
    border-bottom: 1px solid #dfe2e9;
    .collapse-item__content {
      height: var(--height);
    }
  }
}
.collapse-item__content {
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


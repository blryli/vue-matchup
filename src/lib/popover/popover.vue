<template>
  <span class="vue-popover">
    <transition name="fade">
      <div class="vue-popover-wrap" :class="[
        effectClass,
        {'vue-popover-wrap-top': momentPlacement === 'top'},
        {'vue-popover-wrap-bottom': momentPlacement === 'bottom'},
        {'vue-popover-wrap-visible': value},
        {'vue-popover-wrap-hidden': !value}
      ]" ref="popover" role="popover" :style="popoverStyle"
      @mouseenter="mouseenter" @mouseleave="mouseleave">
        <div class="vue-popover-arrow" ref="arrow"></div>
        <vue-content :data="data"></vue-content>
      </div>
    </transition>
    <div class="vue-popover-bg" v-show="enterable && showBg" ref="bg">{{showBg}}</div>
  </span>
</template>

<script>
import { offset, scroll, generateId } from "../../utils/util";
import { on, off, removeBody } from "../../utils/dom";

export default {
  name: "VuePopover",
  props: {
    value: String,
    effect: {
      type: [String, Object],
      default: 'light'
    },
    // popover消息提示
    data: [String, Object, Array],
    placement: {
      type: String,
      default: "top"
    },
    borderColor: {
      type: String,
      default: "#ccc"
    },
    popoverClass: String,
    position: {
      type: Object,
      default: function() {
        return {top: 0,center: 0, bottom: 0}
      }
    },
    pos: String,
    enterable: Boolean,
    showBg: Boolean
  },
  data() {
    return {
      addedBody: false,
      scrollTargets: [],
      scrollTop: scroll().top,
      scrollLeft: scroll().left,
      momentPlacement: this.placement
    };
  },
  computed: {
    id() {
      return `${generateId()}`;
    },
    effectClass() {
      let effect = this.effect ? `is-${this.effect}` : "is-light";
      effect += ` ${this.popoverClass}`;
      return effect;
    },
    popoverStyle() {
      let style = {
        "--borderColor": "#ccc",
        "--bgColor": "#fff",
        "--color": "#303133"
      };
      if (!this.effect) {
        return style;
      }
      if (typeof this.effect === "string") {
        switch (this.effect) {
          case "light":
            style["--borderColor"] = "#ccc";
            style["--bgColor"] = "#fff";
            style["--color"] = "#303133";
            break;
          case "dark":
            style["--borderColor"] = "#303133";
            style["--bgColor"] = "#303133";
            style["--color"] = "#fff";
            break;
          case "info":
            style["--borderColor"] = "#e6a23c";
            style["--bgColor"] = "#e6a23c";
            style["--color"] = "#fff";
            break;
          case "error":
            style["--borderColor"] = "#f56c6c";
            style["--bgColor"] = "#f56c6c";
            style["--color"] = "#fff";
            break;
          default:
            style["--borderColor"] = this.effect;
            style["--bgColor"] = this.effect;
            style["--color"] = "#fff";
            break;
        }
      } else if (typeof this.effect === "object") {
        if (Array.isArray(this.effect)) {
          console.error("effect 只能是对象或字符串");
        } else {
          style["--borderColor"] = this.effect.borderColor
            ? this.effect.borderColor
            : "#ccc";
          style["--bgColor"] = this.effect.backgroundColor
            ? this.effect.backgroundColor
            : "#fff";
          style["--color"] = this.effect.olor ? this.effect.olor : "#303133";
        }
      } else {
        console.error("effect 只能是对象或字符串");
      }
      return style;
    },
    matchup() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "vue-matchup") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    }
  },
  watch: {
    value(val) {
      val && setTimeout(() => {
        this.calculateCoordinate();
      }, 0)
    }
  },
  methods: {
    popoverAddedBody() {
      document.body.appendChild(this.$refs.popover)
      this.addedBody = true;
    },
    mouseenter() {
      this.$emit('mouseenter');
    },
    mouseleave() {
      this.$emit('mouseleave');
    },
    calculateCoordinate() {
      !this.addedBody && this.popoverAddedBody();
      const popover = this.$refs.popover;
      const arrow = this.$refs.arrow;
      const bg = this.$refs.bg;
      let popoverTop;
      let arrowTop;
      let bgTop;
      this.changeDirection(popover);
      switch (this.momentPlacement) {
        case 'top':
          popoverTop = this.position.top - popover.offsetHeight - 10;
          arrowTop = this.position.top - 11;
          bgTop = this.position.top - 10;
          break;
        case 'bottom':
          popoverTop = this.position.bottom + 10;
          arrowTop = this.position.bottom - 2;
          bgTop = this.position.bottom;
          break;
      
        default:
          console.error("Wrong placement must top/bottom");
          break;
      }
      let popoverLeft = this.position.center - popover.offsetWidth / 2;
      const body = this.matchup.$refs.matchupBody;
      const bodyLeft = offset(body).left;
      const bodyRight = bodyLeft + body.offsetWidth;
      if (this.pos === 'L') {
        popoverLeft < bodyLeft && (popoverLeft = bodyLeft)
      } else {
        popoverLeft + popover.offsetWidth > bodyRight && (popoverLeft = bodyRight - popover.offsetWidth)
      }
      arrow.style.top = this.scrollTop ? arrowTop - this.scrollTop + "px" : arrowTop + "px";
      arrow.style.left = this.position.center + "px";
      popover.style.top = this.scrollTop ? popoverTop - this.scrollTop + "px" : popoverTop + "px";
      bg.style.top = this.scrollTop ? bgTop - this.scrollTop + 'px' : bgTop + 'px';
      bg.style.left = popover.style.left = popoverLeft + "px";
      bg.style.width = popover.offsetWidth + "px";
    },
    changeDirection(popover) {
      const allHeight = this.position.bottom + popover.offsetHeight + 5;
      switch (this.placement) {
        case "top":
          if (this.position.top - popover.offsetHeight - 5 - this.scrollTop < 10) {
            this.momentPlacement = 'bottom';
          } else {
            this.momentPlacement = 'top';
          }
          break;
        case "bottom":
          if (window.innerHeight - allHeight < 10) {
            this.momentPlacement = 'top';
          } else {
            this.momentPlacement = 'bottom';
          }
          break;
        default:
          break;
      }
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
      let parent = this.$el.parentNode;
      while (parent !== document.body) {
        if (parent.scrollHeight !== parent.offsetHeight) {
          this.scrollTargets.push(parent);
          on(parent, "scroll", this.windowScroll);
        }
        parent = parent.parentNode;
      }

      on(window, "scroll", this.windowScroll);
      
      if (!this.$refs.popover) {
        return console.error(
          "Couldn't find popover ref in your component that uses popoverMixin."
        );
      }
    })
  },
  beforeDestroy() {
    off(window, "scroll", this.windowScroll);
    this.scrollTargets.forEach(d => {
      off(d, "scroll", this.windowScroll);
    })
    removeBody(this, 'popover');
  }
};
</script>

<style lang="scss" scoped>
.vue-popover {
  position: relative;
}
.vue-popover-wrap {
  visibility: hidden;
  position: fixed;
  z-index: 3000;
  opacity: 0;
  padding: 10px;
  line-height: 1.2;
  font-size: 14px;
  min-width: 10px;
  border-radius: 4px;
  border: 1px solid;
  transition: opacity 0.3s ease;
  background-color: var(--bgColor);
  border-color: var(--borderColor);
  color: var(--color);
}
.vue-popover-bg {
  position: fixed;
  z-index: 2980;
  height: 10px;
  min-width: 10px;
  opacity: 0;
  background-color: red;
}

.vue-popover-wrap-visible {
  visibility: visible;
  opacity: 1;
}
.vue-popover-wrap-hidden {
  visibility: hidden;
  opacity: 0;
}

// 气泡箭头
.vue-popover-arrow {
  position: fixed;
  z-index: 2990;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
  }
}
.vue-popover-wrap-top {
  .vue-popover-arrow {
    border-top-color: var(--borderColor);
    margin-left: -6px;
    &:after {
      top: -6px;
      margin-left: -5px;
      border-top: 5px solid var(--bgColor);
    }
  }
}
.vue-popover-wrap-bottom {
  .vue-popover-arrow {
    border-bottom-color: var(--borderColor);
    margin-left: -6px;
    &:after {
      top: -3px;
      margin-left: -5px;
      border-bottom: 5px solid var(--bgColor);
    }
  }
}

.light {
  color: #666;
}
</style>

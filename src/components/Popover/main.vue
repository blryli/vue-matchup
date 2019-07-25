<template>
  <span class="v-popover">
    <transition name="fade">
      <div
        class="v-popover-wrap"
        :class="[
        effectClass,
        {'v-popover-wrap-top': momentPlacement === 'top'},
        {'v-popover-wrap-bottom': momentPlacement === 'bottom'},
        {'v-popover-wrap-visible': value},
        {'v-popover-wrap-hidden': !value}
      ]"
        ref="popover"
        role="popover"
        :style="popoverStyle"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >
        <div class="v-popover-arrow" ref="arrow"></div>
        <v-content :data="data"/>
      </div>
    </transition>
    <div class="v-popover-bg" v-show="enterable && showBg" ref="bg">{{showBg}}</div>
  </span>
</template>

<script>
import VContent from 'components/Content';
import { removeBody, getDomClientRect } from "utils/dom";

export default {
  name: "Popover",
  components: {
    VContent
  },
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
    referenceRect: {
      type: Object,
      default: function () {
        return { top: 0, center: 0, bottom: 0 }
      }
    },
    pos: String,
    enterable: Boolean,
    showBg: Boolean
  },
  data() {
    return {
      addedBody: false,
      momentPlacement: this.placement
    };
  },
  computed: {
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
      while (parentName !== "VueMatchup") {
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

      const popoverRect = getDomClientRect(popover)
      this.changeDirection(popoverRect);
      switch (this.momentPlacement) {
        case 'top':
          popoverTop = this.referenceRect.top - popoverRect.height - 10;
          arrowTop = this.referenceRect.top - 11;
          bgTop = this.referenceRect.top - 10;
          break;
        case 'bottom':
          popoverTop = this.referenceRect.bottom + 10;
          arrowTop = this.referenceRect.bottom - 2;
          bgTop = this.referenceRect.bottom;
          break;

        default:
          console.error("Wrong placement must top/bottom");
          break;
      }
      let popoverLeft = this.referenceRect.center - popoverRect.width / 2;
      const matchuprRect = getDomClientRect(this.matchup.$refs.matchup)
      // 限制 popover 不超出左侧或右侧
      if (this.pos === 'L') {
        popoverLeft < matchuprRect.left && (popoverLeft = matchuprRect.left)
      } else {
        popoverLeft + popoverRect.width > matchuprRect.right && (popoverLeft = matchuprRect.right - popoverRect.width)
      }
      arrow.style.top = arrowTop + "px";
      arrow.style.left = this.referenceRect.center + "px";
      popover.style.top = popoverTop + "px";
      bg.style.top = bgTop + 'px';
      bg.style.left = popover.style.left = popoverLeft + "px";
      bg.style.width = popoverRect.width + "px";
    },
    changeDirection(popoverRect) {
      const allHeight = this.referenceRect.bottom + popoverRect.height + 5;
      switch (this.placement) {
        case "top":
          if (this.referenceRect.top - popoverRect.height - 5 < 10) {
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
    }
  },
  mounted() {
  },
  beforeDestroy() {
    removeBody(this, 'popover');
  }
};
</script>

<style lang="scss" scoped>
.v-popover {
  position: relative;
}
.v-popover-wrap {
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
.v-popover-bg {
  position: fixed;
  z-index: 2980;
  height: 10px;
  min-width: 10px;
  opacity: 0;
  background-color: red;
}

.v-popover-wrap-visible {
  visibility: visible;
  opacity: 1;
}
.v-popover-wrap-hidden {
  visibility: hidden;
  opacity: 0;
}

// 气泡箭头
.v-popover-arrow {
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
.v-popover-wrap-top {
  .v-popover-arrow {
    border-top-color: var(--borderColor);
    margin-left: -6px;
    &:after {
      top: -6px;
      margin-left: -5px;
      border-top: 5px solid var(--bgColor);
    }
  }
}
.v-popover-wrap-bottom {
  .v-popover-arrow {
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

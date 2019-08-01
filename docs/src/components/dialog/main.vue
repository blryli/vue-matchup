<template>
  <transition name="fade">
    <div class="v-dialog__wrapper" v-show="show">
      <div class="v-dialog">
        <div class="v-dialog__header">
          <div class="v-dialog__title">{{title}}</div>
          <div class="v-dialog__close" @click="handleClose">
            <div class="v-dialog__icon"/>
          </div>
        </div>
        <div class="v-dialog__body" v-if="rendered">
          <slot/>
        </div>
        <div class="v-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: String
  },
  data() {
    return {
      show: this.value,
      rendered: false
    }
  },
  watch: {
    value(val) {
      this.show = val
      this.renderedFn()
      val ? this.$emit('open') : this.$emit('close')
    }
  },
  methods: {
    handleClose() {
      this.show = false
      this.$emit('input', false)
    },
    renderedFn() {
      this.$nextTick(() => {
        !this.rendered && this.value && (this.rendered = true)
      })
    }
  },
  mounted () {
    this.renderedFn()
  }
}
</script>

<style scoped>
.v-dialog__wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  transition: opacity 0.3s;
}
.v-dialog {
  position: relative;
  background-color: #fff;
  margin: 0 auto 50px;
}
.v-dialog__bg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 2999;
}
.v-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 60px;
  padding: 0 20px;
}
.v-dialog__close {
  padding: 10px;
  box-sizing: border-box;
}
.v-dialog__close:hover {
  cursor: pointer;
}
.v-dialog__icon {
  position: relative;
  width: 16px;
  height: 16px;
}
.v-dialog__icon::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 16px;
  height: 2px;
  background-color: #999;
  border-radius: 2px;
  transform: rotate(45deg);
}
.v-dialog__icon::after {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 16px;
  height: 2px;
  background-color: #999;
  border-radius: 2px;
  transform: rotate(-45deg);
}
.v-dialog__body {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 25px 25px 30px;
  box-sizing: border-box;
}
.v-dialog__footer {
  height: 50px;
  line-height: 45px;
  padding: 0 20px;
  text-align: right;
  border-top: 1px solid #ddd;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

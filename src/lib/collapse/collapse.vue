<template>
  <div class="collapse">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "collapse",
  props: {
    value: Array,
    accordion: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    activeName(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    }
  },
  data() {
    return {
      activeName: this.value
    };
  }
};
</script>

<style lang="scss" scoped>
</style>


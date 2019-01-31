<script>
export default {
  name: "VueContent",
  props: {
    data: [Array, Object, String]
  },
  render(h) {
    return h("div", {class: {'vue-popover-content': true}}, [this.data]);
  }
};
</script>

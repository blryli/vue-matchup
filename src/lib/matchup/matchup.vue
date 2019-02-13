<template>
  <div
    class="matchup"
    ref="wrap"
    :class="{full: fullEdition}"
    :style="{'min-height': fullEdition ? minHeight : ''}"
  >
    <div
      v-if="fullEdition"
      class="matchup__header"
      ref="header"
      :style="{width: `calc(100% - ${sidebarUseWidth}px)`}"
    >
      <div class="matchup__header-handle">
        <ul>
          <li @click="join">匹配</li>
          <li class="hr">|</li>
          <li>全部匹配</li>
          <li class="hr">|</li>
          <li>清空</li>
          <li ref="dbArrow" class="f-r db-arrow" @click="sidebarWidthChange"></li>
        </ul>
      </div>
    </div>
    <div
      class="matchup__body"
      ref="matchupBody"
      :style="{width: fullEdition ? `calc(100% - ${sidebarUseWidth}px)` : ''}"
    >
      <div class="left" ref="left" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
        <div class="card">
          <collapse
            v-model="leftActiveName"
            :accordion="collapseAccordion"
            @change="collapseChange"
          >
            <collapse-item
              v-for="(d, i) in realLeftData"
              :key="i"
              :title="`${showTitle(leftTitle, i)}`"
              :name="`${i + 1}`"
              scrollDir="left"
              :duration="duration"
              :dataChange="leftDataChange"
            >
              <r-table
                :row="i"
                ref="leftTable"
                :theadData="leftThead"
                :tbodyData="d"
                :idFun="leftIdFun"
                :popover="popover"
                :enterable="popoverEnterable"
                :hideDelay="popoverHideDelay"
                :popoverContentFun="leftPopoverContentFun"
                pos="L"
                @checkChange="leftCheckChange"
                @checkRow="checkRow"
                @unCheckRow="unCheckRow"
              ></r-table>
            </collapse-item>
          </collapse>
        </div>
      </div>
      <div class="center" :style="{width: `${cvsWidth}px`}">
        <m-canves
          ref="canves"
          :width="cvsWidth"
          :height="height"
          :value="value"
          :leftCheckedIds="leftCheckedIds"
          :rightCheckedIds="rightCheckedIds"
          :leftActiveName="leftActiveName"
          :rightActiveName="rightActiveName"
          :duration="duration"
          :fullEdition="fullEdition"
          @click="clickLine"
          @delete="deleteLine"
          @checkLine="cvsCheckLine"
          @unCheckLine="cvsUnCheckLine"
        />
      </div>
      <div class="right" ref="right" id="right" :style="{width: `calc(50% - ${cvsWidth/2+5}px)`}">
        <div class="card">
          <collapse
            v-model="rightActiveName"
            :accordion="collapseAccordion"
            @change="collapseChange"
          >
            <collapse-item
              v-for="(d, i) in realRightData"
              :key="i"
              :title="`${showTitle(rightTitle, i)}`"
              :name="`${i + 1}`"
              :duration="duration"
              :dataChange="rightDataChange"
            >
              <r-table
                v-model="rightChecked"
                ref="rightTable"
                :row="i"
                :theadData="rightThead"
                :tbodyData="d"
                :idFun="rightIdFun"
                :popover="popover"
                :enterable="popoverEnterable"
                :hideDelay="popoverHideDelay"
                :popoverContentFun="rightPopoverContentFun"
                pos="R"
                @checkChange="rightCheckChange"
                @checkRow="checkRow"
                @unCheckRow="unCheckRow"
              ></r-table>
            </collapse-item>
          </collapse>
        </div>
      </div>
    </div>
    <m-sidebar
      v-if="fullEdition"
      :sidebarWidth="sidebarWidth"
      :sidebarUseWidth="sidebarUseWidth"
      :groups="groups"
      :fullEdition="fullEdition"
    ></m-sidebar>
  </div>
</template>

<script>
import { offset, scroll } from "../../utils/util";
import { on, off } from "../../utils/dom";
import Handle from "./handle";

export default {
  name: "vue-matchup",
  mixins: [Handle],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    leftData: {
      type: Array,
      default: () => []
    },
    rightData: {
      type: Array,
      default: () => []
    },
    leftThead: {
      type: Array,
      default: () => []
    },
    rightThead: {
      type: Array,
      default: () => []
    },
    leftTitle: [Array, String],
    rightTitle: [Array, String],
    leftIdFun: Function,
    rightIdFun: Function,
    collapseAccordion: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 300
    },
    sidebarWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: String,
      default: "600px"
    },
    fullEdition: {
      type: Boolean,
      default: false
    },
    popover: {
      type: Boolean,
      default: false
    },
    popoverEnterable: {
      type: Boolean,
      default: false
    },
    popoverHideDelay: {
      type: Number,
      default: 200
    },
    leftPopoverContentFun: Function,
    rightPopoverContentFun: Function
  },
  data() {
    return {
      color: "",
      leftChecked: [],
      rightChecked: [],
      cvsWidth: 200,
      height: 200,
      sidebarUseWidth: this.sidebarWidth,
      leftActiveName: ["1"],
      rightActiveName: ["1"],
      rightBox: [],
      rightBox: [],
      leftHeader: [],
      leftContent: [],
      rightHeader: [],
      rightContent: [],
      leftCheckedIds: [],
      rightCheckedIds: [],
      accordion: true,
      activeData: {},
      leftDataChange: false,
      rightDataChange: false,
      ny: 0,
      rotYINT: null,
      headerParent: [],
    };
  },
  computed: {
    lines() {
      return this.value;
    }
  },
  watch: {
    leftData() {
      this.leftDataChange = true;
    },
    rightData() {
      this.rightDataChange = true;
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.leftTable.forEach(d => {
          d.init();
        })
        this.$refs.rightTable.forEach(d => {
          d.init();
        })
        this.setHeight();
        setTimeout(() => {
          this.drawLine();
        }, 0)
      })
    },
    showTitle(title, i) {
      if (typeof title === "string") {
        return title;
      } else {
        return title[i] || title[0];
      }
    },
    scrollChange(event, index) {
      if (!this.value.length) return;
      this.drawLine();
    },
    collapseChange() {
      if (!this.value.length) {
        setTimeout(() => {
          this.setHeight();
        }, this.duration);
        return;
      }
      this.setHeight();
    },
    clickLine(val) {
      this.activeData = val;
    },
    // 调整canves高度
    setHeight() {
      const timer = setInterval(() => {
        const left = this.$refs.left;
        const right = this.$refs.right;
        this.height =
          left.offsetHeight > right.offsetHeight
            ? left.offsetHeight
            : right.offsetHeight;
        setTimeout(() => {
          this.drawLine();
        }, 0);
      }, 12);
      setTimeout(() => {
        clearTimeout(timer);
      }, this.duration);
    },
    windowScroll() {
      if (!this.fullEdition || !this.$refs.header || !this.$refs.wrap) return;
      let scrollTop = scroll().top;
      if (scrollTop > offset(this.$refs.wrap).top) {
        this.$refs.header.style.top = this.$refs.sidebar.style.top =
          scrollTop - offset(this.$refs.wrap).top + "px";
      } else {
        if (this.$refs.header.style.top !== 0) {
          this.$refs.header.style.top = 0;
          this.$refs.sidebar.style.top = 0;
        }
      }
    },
    sidebarWidthChange() {
      this.sidebarUseWidth =
        this.sidebarUseWidth === 10 ? this.sidebarWidth : 10;
      clearInterval(this.rotYINT);
      this.rotYINT = setInterval(() => {
        this.startYRotate(this.$refs.dbArrow);
      }, 10);
    },
    startYRotate(y) {
      this.ny = this.ny + 5;
      y.style.transform = `rotateY(${this.ny}deg)`;
      y.style.webkitTransform = `rotateY(${this.ny}deg)`;
      y.style.OTransform = `rotateY(${this.ny}deg)`;
      y.style.MozTransform = `rotateY(${this.ny}deg)`;
      if (this.ny == 180 || this.ny >= 360) {
        clearInterval(this.rotYINT);
        if (this.ny >= 360) {
          this.ny = 0;
        }
      }
    },
    headerOnScroll() {
      let parent = this.$refs.header.parentNode;
      while (parent !== document.body) {
        if (parent.scrollHeight !== parent.offsetHeight) {
          this.headerParent.push(parent);
        }
        parent = parent.parentNode;
      }
      this.headerParent.forEach(d => {
        on(d, "scroll", this.windowScroll);
      });
      on(window, "scroll", this.windowScroll);
    },
    sizeChange() {
      this.drawLine();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.leftHeader = Array.from(this.$refs.left.querySelectorAll(
        ".collapse-item__header"
      ));
      this.leftContent = Array.from(this.$refs.left.querySelectorAll(
        ".collapse-item__wrap"
      ));
      this.rightHeader = Array.from(this.$refs.right.querySelectorAll(
        ".collapse-item__header"
      ));
      this.rightContent = Array.from(this.$refs.right.querySelectorAll(
        ".collapse-item__wrap"
      ));
      this.leftHeader.forEach(d => {
        this.leftChecked.push([]);
      });
      this.rightHeader.forEach(d => {
        this.rightChecked.push([]);
      });
      setTimeout(() => {
        this.setHeight();
      }, this.duration + 1);

      this.leftContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });
      this.rightContent.forEach((d, i) => {
        on(d, "scroll", this.scrollChange, i);
      });
      on(window, "resize", this.sizeChange);

      this.fullEdition && this.headerOnScroll();
    });
  },
  beforeDestroy() {
    this.leftContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    this.rightContent.forEach((d, i) => {
      off(d, "scroll", this.scrollChange, i);
    });
    if (this.fullEdition) {
      this.headerParent.forEach(d => {
        off(d, "scroll", this.windowScroll);
      });
      off(window, "scroll", this.windowScroll);
    }
    off(window, "resize", this.sizeChange);
  }
};
</script>

<style lang="scss">
@import './matchup.scss'
</style>

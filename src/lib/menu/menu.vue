<template>
  <ul :class="{ 'sp-menu': isUpNav }">
    <li class="sp-menu-item" v-show="menus" v-for="menu in menus" :key="menu.uid" :style="{'background-color': backgroundColor}">
      <div :class="['sp-title',{'is-active': selectId == menu.uid}]" 
        :style="{'padding-left': !isUpNav && pdleft + 'px','--color': activeMenuColor != menuColor && selectId == menu.uid ? activeMenuColor : menuColor, '--bgColor': selectId == menu.uid ? hoverBgColor : backgroundColor, '--height': height, '--hoverBgColor': hoverBgColor}">
        <i v-if="menu.children" class="iconfont" :class="{'active': menu.active}" @click="clickIcon(menu)"></i>
        <span @click="clickItem(menu)">{{ menu.label }}{{menu.active}}</span>
      </div>
      <sp-collapse-transition>
        <groups v-show="menu.active" @select-id="getSelectId"  @open="menuOpen" @close="menuClose" 
          :menus="menu.children" 
          :backgroundColor="backgroundColor" 
          :hoverBgColor="hoverBgColor" 
          :menuColor="menuColor" 
          :activeMenuColor="activeMenuColor" 
          :width="width" 
          :height="height" 
          :selectId="selectId" 
          :isUpNav="false" 
          :paddingLeft="pdleft"
        :style="{'width': width}"/>
      </sp-collapse-transition>
    </li>
  </ul>
</template>

<script>
export default {
    name: 'groups',
    props: {
      //菜单数组
      menus: {
        type: Array,
        default: () => [],
      },
      backgroundColor: {//背景颜色
        type: String,
        default: '#fff'
      },
      hoverBgColor: {//hove及选中背景颜色
        type: String,
        default: '#409eff'
      },
      menuColor: {//字体颜色
        type: String,
        default: '#333'
      },
      activeMenuColor: {//选中字体颜色
        type: String,
        default: '#fff'
      },
      width: {//menu宽度
        type: String,
        default: '100%'
      },
      height: {//menu item高度
        type: String,
        default: '30px'
      },
      selectId: {//选中的ID
        type: String,
        default: '1'
      },
      isUpNav: {//是否是一级按钮
        type: Boolean,
        default: true
      },
      paddingLeft: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
      }
    },
    created() {
      if(this.isUpNav) {
        !sessionStorage.selectId && (sessionStorage.selectId = this.selectId);
        this.muneSetId(this.menus);
        // this.setHighlight(this.menus);
      }
    },
    watch: {
      menus(val) {
        // this.muneSetId(val);
        console.log(val)
        // this.setHighlight(val);
      },
      selectId(val) {
        // sessionStorage.selectId = val;
      }
    },
    computed: {
      //层级padding-left
      pdleft() {
        return this.paddingLeft + 20;
      }
    },
    methods:{
      //menu选中
      clickItem(menu) {
        this.$emit('select-id', menu.uid);
      },
      //menu收缩展开
      clickIcon(menu) {
        menu.active = !menu.active;
        menu.active ? this.$emit('open', menu.uid) : this.$emit('close', menu.uid);
        console.log(menu.active)
      },
      //初始化设置ID
      muneSetId(menus, id) {
        let len = menus.length;
        for (let i = 0; i < len; i++) {
          menus[i].children && this.$set(menus[i], "active", false);
          id ? this.$set(menus[i], "uid", id + "-" + (i + 1)) : this.$set(menus[i], "uid", '' + parseInt(i + 1));
          menus[i].children && this.muneSetId(menus[i].children, menus[i].uid);
        }
      },
      //高亮展开
      setHighlight(menus) {
        console.log(sessionStorage.selectId)
        if (sessionStorage.selectId) {
          this.$emit('select-id', sessionStorage.selectId);
          let activeArr = sessionStorage.selectId.split('-'),
            this_menu;
          for (let i = 0; i < activeArr.length - 1; i++) {
            if (this_menu) {
              this_menu.children[activeArr[i] - 1].active = true;
              this_menu = this_menu.children[activeArr[i] - 1];
            } else {
              menus[activeArr[i] - 1].active = true;
              this_menu = menus[activeArr[i] - 1];
            }
          }
        }
      },
      //手风琴 关闭菜单
      navClose(array) {
        for (let i = 0; i < array.length; i++) {
          if(array[i].active) {
            array[i].active = false;
            this.$emit('close', array[i].uid);
          }
          array[i].children && this.navClose(array[i].children);
        }
      },
      menuOpen(val) {
        this.$emit('open', val)
      },
      menuClose(val) {
        this.$emit('close', val);
      },
      //选中的ID
      getSelectId(val) {
        this.$emit('select-id', val);
      }
    }
}
</script>

<style lang="scss" scoped>
ul{
  padding: 0;
  margin: 0;
}
li{
  list-style: none;
}
.sp-menu-item{
  position: relative;
  .sp-title{
    height: var(--height);
    line-height: var(--height);
    color: var(--color);
    background-color: var(--bgColor);
    font-size: 14px;
    padding: 0 20px;
    cursor: default;
    position: relative;
    transition: border-color .3s,background-color .3s,color .3s;
    box-sizing: border-box;
    white-space: nowrap;
    span{
      width: 100%;
      text-decoration: none;
      display: inline-block;
    }
    span, i{
      position: relative;
      opacity: .7;
      transition: opacity .1s ease;
    }
    &:hover{
      color: var(--color);
      background-color: var(--hoverBgColor);
      span, i{
        opacity: 1;
      }
    }
    &.is-active{
      span, i{
        opacity: 1;
      }
    }
  }
}
.iconfont {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 12px;
    cursor: pointer;
    &::after{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      border: 6px solid;
      border-color: transparent transparent transparent #888;
      transition: .3s;
    }
    &.active{
      ::after{
        left: -4px;
        top: 3px;
        transform: rotate(90deg);
      }
    }
}
.is-active{
  .iconfont::after{
    border-color: transparent transparent transparent #fff;
  }
}
</style>

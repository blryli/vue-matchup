import Vue from 'vue'
import App from './App.vue'
import VueMatchup from './lib'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, {
  size: 'mini'
})
Vue.use(VueMatchup)

new Vue({
  el: '#app',
  render: h => h(App)
})

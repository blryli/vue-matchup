import Vue from 'vue'
import App from './App.vue'
import VueMatchup from '../../'
import ElementUI from 'element-ui'
import '../../dist/vue-matchup.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueMatchup)
Vue.use(ElementUI, {size: 'small'})

new Vue({
  el: '#app',
  render: h => h(App)
})

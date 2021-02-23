
import 'babel-polyfill'
import fastclick from "fastclick"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import VueLazyLoad from 'vue-lazyload'
// 
import 'common/stylus/index.styl'
// 减去移动端300ms延时
fastclick.attach(document.body)

//axios挂载到vue原型
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 使用懒加载
Vue.use(VueLazyLoad,{
  // 加载时的图片
  loading: require('common/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

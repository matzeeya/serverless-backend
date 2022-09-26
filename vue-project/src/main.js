import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import axios from 'axios'
import 'buefy/dist/buefy.css'

Vue.prototype.$liff = window.liff
Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.use(Buefy)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

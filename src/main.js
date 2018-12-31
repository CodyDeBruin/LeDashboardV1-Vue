import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material' //imports all components, for performance reasons update this and only import needed components in production
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts)

import store from './store'
import router from './router'

Vue.use(VueMaterial) //we'll import each module separately later on

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

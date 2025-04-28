import App from './App'
import store from '@/store'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { hasPermi } from '@/components/utils/hasPermi.js'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.hasPermi = hasPermi
  app.config.globalProperties.BASEURL = 'http://192.168.67.112:8080/'
  app.use(store)
  return {
    app
  }
}

// #endif